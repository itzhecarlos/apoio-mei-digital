const appConfig = window.APP_CONFIG || {};
const ALLOWED_PAYMENT_HOSTS = Array.isArray(appConfig.allowedPaymentHosts)
  ? appConfig.allowedPaymentHosts
      .map((host) => String(host || "").trim().toLowerCase())
      .filter(Boolean)
  : [];
const ALLOWED_EXTERNAL_PAYMENT_HOSTS = Array.isArray(appConfig.allowedExternalPaymentHosts)
  ? appConfig.allowedExternalPaymentHosts
      .map((host) => String(host || "").trim().toLowerCase())
      .filter(Boolean)
  : [];

const statusTitle = document.getElementById("status-title");
const statusMsg = document.getElementById("status-msg");
const actions = document.getElementById("pix-actions");
const payLink = document.getElementById("pay-link");
const copyBtn = document.getElementById("copy-btn");

function hideActions() {
  if (actions) actions.style.display = "none";
}

function loadPaymentResult() {
  try {
    return JSON.parse(sessionStorage.getItem("payment_result") || "null");
  } catch {
    return null;
  }
}

function hostMatchesAllowedList(hostname, allowedHosts) {
  return allowedHosts.some((allowedHost) =>
    hostname === allowedHost || hostname.endsWith(`.${allowedHost}`)
  );
}

function isAllowedPaymentUrl(value, options = {}) {
  if (!value || ALLOWED_PAYMENT_HOSTS.length === 0) return false;

  try {
    const parsedUrl = new URL(value);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (hostMatchesAllowedList(hostname, ALLOWED_PAYMENT_HOSTS)) return true;
    if (options.allowExternal === true) {
      return hostMatchesAllowedList(hostname, ALLOWED_EXTERNAL_PAYMENT_HOSTS);
    }

    return false;
  } catch {
    return false;
  }
}

function applyStatus(result) {
  const status = result?.status || "";

  if (status === "approved") {
    if (statusTitle) statusTitle.textContent = "Pagamento aprovado";
    if (statusMsg) statusMsg.textContent = result.message || "Seu pagamento foi aprovado com sucesso.";
    hideActions();
    return;
  }

  if (status === "pending" || status === "in_process") {
    if (statusTitle) statusTitle.textContent = "Pagamento pendente";
    if (statusMsg) {
      statusMsg.textContent =
        result.message || "Siga as instruções abaixo para concluir ou acompanhar o pagamento.";
    }
    return;
  }

  if (statusTitle) statusTitle.textContent = "Pagamento recebido";
  if (statusMsg) statusMsg.textContent = result?.message || "Recebemos seu pagamento para análise.";
}

const paymentResult = loadPaymentResult();
const ticketUrl = paymentResult?.ticket_url || "";
const qrCode = paymentResult?.qr_code || "";

if (!paymentResult) {
  if (statusTitle) statusTitle.textContent = "Pagamento não encontrado";
  if (statusMsg) {
    statusMsg.textContent =
      "Não encontramos o resultado desta sessão. Volte ao formulário e tente novamente.";
  }
  hideActions();
} else {
  applyStatus(paymentResult);
  const allowExternalPaymentLink =
    paymentResult?.status === "pending" || paymentResult?.status === "in_process";

  if (!ticketUrl && !qrCode) {
    hideActions();
  } else if (!isAllowedPaymentUrl(ticketUrl, { allowExternal: allowExternalPaymentLink })) {
    if (statusMsg) {
      statusMsg.textContent =
        "O link de pagamento desta sessão foi bloqueado por segurança. Solicite uma nova análise.";
    }
    hideActions();
  } else if (payLink) {
    payLink.href = ticketUrl;
  }
}

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const value = qrCode || "";
    if (!value) {
      alert("Nenhum código Pix disponível para cópia.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      alert("Código Pix copiado.");
    } catch (error) {
      try {
        const helper = document.createElement("textarea");
        helper.value = value;
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.focus();
        helper.select();
        document.execCommand("copy");
        document.body.removeChild(helper);
        alert("Código Pix copiado.");
      } catch {
        alert("Não foi possível copiar automaticamente. Copie manualmente no aplicativo do banco.");
      }
    }
  });
}
