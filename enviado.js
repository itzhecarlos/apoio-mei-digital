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
const PAYMENT_STATUS_API_PATH = appConfig.paymentStatusApiPath || "/api/payment-status";

const statusTitle = document.getElementById("status-title");
const statusMsg = document.getElementById("status-msg");
const actions = document.getElementById("pix-actions");
const payLink = document.getElementById("pay-link");
const copyBtn = document.getElementById("copy-btn");

let pollHandle = null;

function hideActions() {
  if (actions) actions.style.display = "none";
}

function showActions() {
  if (actions) actions.style.display = "flex";
}

function loadPaymentResult() {
  try {
    return JSON.parse(sessionStorage.getItem("payment_result") || "null");
  } catch {
    return null;
  }
}

function savePaymentResult(result) {
  sessionStorage.setItem("payment_result", JSON.stringify(result));
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
    if (statusTitle) statusTitle.textContent = "Pagamento concluído";
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

function applyArtifacts(result) {
  const ticketUrl = result?.ticket_url || "";
  const qrCode = result?.qr_code || "";
  const allowExternalPaymentLink =
    result?.status === "pending" || result?.status === "in_process";

  if (!ticketUrl && !qrCode) {
    hideActions();
    return;
  }

  if (!isAllowedPaymentUrl(ticketUrl, { allowExternal: allowExternalPaymentLink })) {
    if (statusMsg) {
      statusMsg.textContent =
        "O link de pagamento desta sessão foi bloqueado por segurança. Solicite uma nova análise.";
    }
    hideActions();
    return;
  }

  if (payLink && ticketUrl) {
    payLink.href = ticketUrl;
  }

  showActions();
}

async function refreshPaymentStatus(result) {
  if (!result?.payment_id || !result?.session_token) return result;

  const url = new URL(result.payment_status_api_path || PAYMENT_STATUS_API_PATH, window.location.origin);
  url.searchParams.set("payment_id", result.payment_id);
  url.searchParams.set("session", result.session_token);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const payload = await response.json();
  if (!response.ok || !payload || payload.ok === false) {
    throw new Error(payload?.message || "Não foi possível atualizar o status do pagamento.");
  }

  return {
    ...result,
    status: payload.status || result.status,
    status_detail: payload.status_detail || result.status_detail,
    message: payload.message || result.message,
    qr_code: payload.qr_code || result.qr_code,
    ticket_url: payload.ticket_url || result.ticket_url,
  };
}

async function pollPaymentStatus() {
  const current = loadPaymentResult();
  if (!current) return;

  try {
    const updated = await refreshPaymentStatus(current);
    savePaymentResult(updated);
    applyStatus(updated);
    applyArtifacts(updated);

    if (updated.status === "approved" && pollHandle) {
      clearInterval(pollHandle);
      pollHandle = null;
    }
  } catch (error) {
    console.error(error);
  }
}

const paymentResult = loadPaymentResult();

if (!paymentResult) {
  if (statusTitle) statusTitle.textContent = "Pagamento não encontrado";
  if (statusMsg) {
    statusMsg.textContent =
      "Não encontramos o resultado desta sessão. Volte ao formulário e tente novamente.";
  }
  hideActions();
} else {
  applyStatus(paymentResult);
  applyArtifacts(paymentResult);

  if (paymentResult.status === "pending" || paymentResult.status === "in_process") {
    pollHandle = window.setInterval(pollPaymentStatus, 8000);
  }
}

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const current = loadPaymentResult();
    const value = current?.qr_code || "";
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
