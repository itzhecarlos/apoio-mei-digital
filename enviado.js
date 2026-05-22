const appConfig = window.APP_CONFIG || {};
const ALLOWED_PAYMENT_HOSTS = Array.isArray(appConfig.allowedPaymentHosts)
  ? appConfig.allowedPaymentHosts
      .map((host) => String(host || "").trim().toLowerCase())
      .filter(Boolean)
  : [];

const statusMsg = document.getElementById("status-msg");
const actions = document.getElementById("pix-actions");
const payLink = document.getElementById("pay-link");
const copyBtn = document.getElementById("copy-btn");

function hideActions() {
  if (actions) actions.style.display = "none";
}

function loadPaymentSession() {
  try {
    return JSON.parse(sessionStorage.getItem("payment_session") || "null");
  } catch {
    return null;
  }
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

const paymentSession = loadPaymentSession();
const ticketUrl = paymentSession?.ticket_url || "";
const qrCode = paymentSession?.qr_code || "";

if (!ticketUrl || !qrCode) {
  if (statusMsg) {
    statusMsg.textContent =
      "Não encontramos o Pix desta sessão. Volte ao formulário e tente novamente.";
  }
  hideActions();
} else if (!isAllowedPaymentUrl(ticketUrl)) {
  if (statusMsg) {
    statusMsg.textContent =
      "O link de pagamento desta sessão foi bloqueado por segurança. Solicite uma nova análise.";
  }
  hideActions();
} else if (payLink) {
  payLink.href = ticketUrl;
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
