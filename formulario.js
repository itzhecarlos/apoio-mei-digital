const appConfig = window.APP_CONFIG || {};
const PAYMENT_API_PATH = appConfig.paymentApiPath || "/api/create-payment";
const ALLOWED_PAYMENT_HOSTS = Array.isArray(appConfig.allowedPaymentHosts)
  ? appConfig.allowedPaymentHosts
      .map((host) => String(host || "").trim().toLowerCase())
      .filter(Boolean)
  : [];

const form = document.querySelector(".lead-form");
const overlay = document.getElementById("loadingOverlay");
const planSelect = document.getElementById("plano");
const securityNotice = document.getElementById("security-notice");

const PLAN_META = {
  monthly: {
    label: "Plano Regular Mensal",
    type: "assinatura",
    price: "29,90",
  },
  total_regularization: {
    label: "Regularização Total",
    type: "unico",
    price: "99,90",
  },
};

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function setFormDisabled(targetForm, isDisabled) {
  if (!targetForm) return;
  const fields = targetForm.querySelectorAll("input, select, textarea, button");
  fields.forEach((field) => {
    field.disabled = isDisabled;
  });
}

function showLoading(targetForm) {
  if (overlay) {
    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");
  }
  setFormDisabled(targetForm, true);
}

function hideLoading(targetForm) {
  if (overlay) {
    overlay.style.display = "none";
    overlay.setAttribute("aria-hidden", "true");
  }
  setFormDisabled(targetForm, false);
}

function makeIdempotencyKey(payload) {
  const base =
    `${payload.email}|${payload.cnpj}|${payload.whatsapp}|` +
    `${payload.plan_code}|${Date.now()}`;
  let hash = 0;
  for (let index = 0; index < base.length; index += 1) {
    hash = (hash * 31 + base.charCodeAt(index)) >>> 0;
  }
  return `web_${hash}`;
}

function isAllowedPaymentUrl(value) {
  if (!value || ALLOWED_PAYMENT_HOSTS.length === 0) return false;

  try {
    const parsedUrl = new URL(value);
    return ALLOWED_PAYMENT_HOSTS.includes(parsedUrl.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function savePaymentSession(data) {
  sessionStorage.setItem("payment_session", JSON.stringify(data));
}

function showSecurityNotice(message) {
  if (!securityNotice) return;
  securityNotice.hidden = false;
  securityNotice.textContent = message;
}

if (securityNotice) {
  if (ALLOWED_PAYMENT_HOSTS.length === 0) {
    showSecurityNotice(
      "Configuração pendente: defina os domínios autorizados de pagamento em site-config.js antes de publicar."
    );
  } else {
    securityNotice.hidden = true;
  }
}

if (form) {
  if (planSelect) {
    const params = new URLSearchParams(window.location.search);
    const preselectedPlan = params.get("plano");
    if (preselectedPlan && PLAN_META[preselectedPlan]) {
      planSelect.value = preselectedPlan;
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedPlan = planSelect?.value || "";
    const selectedMeta = PLAN_META[selectedPlan] || {};

    if (!selectedPlan) {
      alert("Selecione um plano para continuar.");
      return;
    }

    if (ALLOWED_PAYMENT_HOSTS.length === 0) {
      alert("O pagamento ainda não está configurado com segurança. Tente novamente mais tarde.");
      return;
    }

    const payload = {
      full_name: (document.getElementById("nome-completo")?.value || "").trim(),
      cnpj: onlyDigits(document.getElementById("cnpj")?.value || ""),
      email: (document.getElementById("email")?.value || "").trim(),
      whatsapp: onlyDigits(document.getElementById("celular")?.value || ""),
      consent_lgpd: !!document.getElementById("aceite-lgpd")?.checked,
      consent_terms: !!document.getElementById("aceite-termos")?.checked,
      plan_code: selectedPlan,
      plan_label: selectedMeta.label || "",
      plan_type: selectedMeta.type || "",
      plan_price: selectedMeta.price || "",
    };

    payload.idempotency_key = makeIdempotencyKey(payload);

    showLoading(form);

    try {
      const response = await fetch(PAYMENT_API_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      let data = null;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Resposta não JSON do endpoint de pagamento:", text);
        alert("O servidor retornou uma resposta inesperada. Tente novamente em instantes.");
        return;
      }

      if (!response.ok || !data || data.ok === false) {
        const errorText = Array.isArray(data?.errors)
          ? data.errors.join("\n")
          : data?.message || "Não foi possível enviar os dados. Tente novamente.";
        alert(errorText);
        return;
      }

      if (!isAllowedPaymentUrl(data.ticket_url)) {
        console.error("Destino de pagamento bloqueado:", data?.ticket_url);
        alert(
          "Bloqueamos um destino de pagamento não autorizado. Nosso time foi notificado para revisar o fluxo."
        );
        return;
      }

      savePaymentSession({
        ticket_url: data.ticket_url,
        qr_code: typeof data.qr_code === "string" ? data.qr_code : "",
        plan_label: payload.plan_label,
      });

      window.location.href = "./enviado.html";
    } catch (error) {
      console.error(error);
      alert("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      hideLoading(form);
    }
  });
}
