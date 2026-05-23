const appConfig = window.APP_CONFIG || {};
const PAYMENT_SESSION_API_PATH = appConfig.paymentSessionApiPath || "/api/payment-session";
const PROCESS_PAYMENT_API_PATH = appConfig.processPaymentApiPath || "/api/process-payment";
const CHECKOUT_PATH = appConfig.checkoutPath || "/checkout.html";
const MERCADO_PAGO_PUBLIC_KEY = appConfig.mercadoPagoPublicKey || "";
const ALLOWED_PAYMENT_HOSTS = Array.isArray(appConfig.allowedPaymentHosts)
  ? appConfig.allowedPaymentHosts
      .map((host) => String(host || "").trim().toLowerCase())
      .filter(Boolean)
  : [];

const statusNode = document.getElementById("checkout-status");
const warningNode = document.getElementById("checkout-warning");
const summaryPlanNode = document.getElementById("summary-plan");
const summaryNameNode = document.getElementById("summary-name");
const summaryEmailNode = document.getElementById("summary-email");
const summaryAmountNode = document.getElementById("summary-amount");

function setStatus(message) {
  if (statusNode) statusNode.textContent = message;
}

function showWarning(message) {
  if (!warningNode) return;
  warningNode.hidden = false;
  warningNode.textContent = message;
}

function getSessionId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("session") || "";
}

function isAllowedHost(hostname) {
  return ALLOWED_PAYMENT_HOSTS.includes(String(hostname || "").toLowerCase());
}

function savePaymentResult(result) {
  sessionStorage.setItem("payment_result", JSON.stringify(result));
}

function ensurePaymentHost() {
  if (ALLOWED_PAYMENT_HOSTS.length === 0) {
    showWarning("Nenhum host de pagamento autorizado foi configurado.");
    return false;
  }

  const currentHost = window.location.hostname.toLowerCase();
  if (isAllowedHost(currentHost)) return true;

  const redirectUrl = new URL(`https://${ALLOWED_PAYMENT_HOSTS[0]}${CHECKOUT_PATH}`);
  redirectUrl.search = window.location.search;
  window.location.replace(redirectUrl.toString());
  return false;
}

async function loadPaymentSession(sessionId) {
  const url = new URL(PAYMENT_SESSION_API_PATH, window.location.origin);
  url.searchParams.set("session", sessionId);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok || !data || data.ok === false) {
    throw new Error(data?.message || "Não foi possível carregar a sessão de checkout.");
  }

  return data;
}

function updateSummary(session) {
  if (summaryPlanNode) summaryPlanNode.textContent = session.plan_label || "Plano selecionado";
  if (summaryNameNode) summaryNameNode.textContent = session.full_name || "Não informado";
  if (summaryEmailNode) summaryEmailNode.textContent = session.email || "Não informado";

  const amountValue = typeof session.amount === "number" ? session.amount : Number(session.amount || 0);
  if (summaryAmountNode) {
    summaryAmountNode.textContent = amountValue > 0
      ? amountValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : "A definir no backend";
  }
}

async function renderBrick(sessionData) {
  if (!MERCADO_PAGO_PUBLIC_KEY || MERCADO_PAGO_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
    throw new Error(
      "Defina a chave pública do Mercado Pago em public/site-config.js antes de publicar o checkout."
    );
  }

  if (typeof window.MercadoPago !== "function") {
    throw new Error("O SDK do Mercado Pago não foi carregado corretamente.");
  }

  const mp = new window.MercadoPago(MERCADO_PAGO_PUBLIC_KEY, {
    locale: "pt-BR",
  });

  const bricksBuilder = mp.bricks();

  await bricksBuilder.create("payment", "paymentBrick_container", {
    initialization: {
      amount: Number(sessionData.amount || 0),
      preferenceId: sessionData.preference_id,
      payer: {
        email: sessionData.email || "",
      },
    },
    customization: {
      visual: {
        style: {
          theme: "default",
        },
      },
      paymentMethods: {
        ticket: "all",
        bankTransfer: "all",
        creditCard: "all",
        debitCard: "all",
      },
    },
    callbacks: {
      onReady: () => {
        setStatus("Checkout carregado. Revise os dados e conclua o pagamento com segurança.");
      },
      onSubmit: async ({ selectedPaymentMethod, formData }) => {
        const response = await fetch(PROCESS_PAYMENT_API_PATH, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            session_id: sessionData.session_token || sessionData.session_id,
            selected_payment_method: selectedPaymentMethod,
            form_data: formData,
          }),
        });

        const result = await response.json();
        if (!response.ok || !result || result.ok === false) {
          throw new Error(result?.message || "Não foi possível processar o pagamento.");
        }

        savePaymentResult({
          payment_id: result.payment_id || "",
          status: result.status || "",
          status_detail: result.status_detail || "",
          message: result.message || "",
          qr_code: result.qr_code || "",
          ticket_url: result.ticket_url || "",
          plan_label: sessionData.plan_label || "",
          full_name: sessionData.full_name || "",
          email: sessionData.email || "",
          amount: sessionData.amount || 0,
        });

        if (typeof result.redirect_url === "string" && result.redirect_url) {
          window.location.href = result.redirect_url;
          return;
        }

        window.location.href = "./enviado.html";
      },
      onError: (error) => {
        console.error(error);
        showWarning(
          "O checkout encontrou um erro. Verifique a sessão no backend e a configuração do Mercado Pago."
        );
        alert(
          "O pagamento não foi concluído. Selecione Pix, boleto, cartão de crédito ou débito e, se o erro persistir, consulte os logs da função process-payment na Netlify."
        );
      },
    },
  });
}

async function initCheckout() {
  if (!ensurePaymentHost()) return;

  const sessionId = getSessionId();
  if (!sessionId) {
    showWarning("Sessão de checkout ausente. Volte ao formulário e tente novamente.");
    setStatus("Não foi possível identificar a sua solicitação.");
    return;
  }

  setStatus("Consultando a sessão segura de pagamento...");

  try {
    const payload = await loadPaymentSession(sessionId);
    const sessionData = payload.session || payload;
    updateSummary(sessionData);
    await renderBrick(sessionData);
  } catch (error) {
    console.error(error);
    showWarning(error.message || "Falha ao carregar o checkout.");
    setStatus("Não foi possível iniciar o checkout com segurança.");
  }
}

initCheckout();
