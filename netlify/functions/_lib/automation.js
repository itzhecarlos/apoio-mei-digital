const DEFAULT_PAYMENT_CONFIRMED_WEBHOOK =
  "https://apoiomeidigital.app.n8n.cloud/webhook/send_whatsapp_payment_confirmed";

const PAYMENT_CONFIRMED_WEBHOOK =
  process.env.N8N_PAYMENT_CONFIRMED_WEBHOOK_URL ||
  process.env.N8N_WHATSAPP_PAYMENT_CONFIRMED_WEBHOOK ||
  DEFAULT_PAYMENT_CONFIRMED_WEBHOOK;

const PAYMENT_PENDING_WEBHOOK =
  process.env.N8N_PAYMENT_PENDING_WEBHOOK_URL ||
  process.env.N8N_WHATSAPP_PAYMENT_PENDING_WEBHOOK ||
  PAYMENT_CONFIRMED_WEBHOOK;

function buildPayload(eventName, session, payment) {
  const metadata = payment?.metadata || {};

  return {
    event: eventName,
    payment_id: payment.id,
    payment_status: payment.status,
    payment_status_detail: payment.status_detail,
    transaction_amount: payment.transaction_amount,
    external_reference: payment.external_reference || session.external_reference || "",
    customer: {
      full_name: metadata.full_name || session.full_name || "",
      email: metadata.email || session.email || "",
      whatsapp: metadata.whatsapp || session.whatsapp || "",
      payer_cpf: metadata.payer_cpf || session.payer_cpf || "",
      cnpj: metadata.cnpj || session.cnpj || "",
    },
    plan: {
      code: metadata.plan_code || session.plan_code || "",
      label: metadata.plan_label || session.plan_label || "",
      type: metadata.plan_type || session.plan_type || "",
      amount: payment.transaction_amount ?? session.amount ?? 0,
    },
    metadata,
  };
}

async function postWebhook(url, payload) {
  if (!url) return null;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(
      `Webhook de automacao retornou ${response.status}: ${body || "sem corpo de resposta"}`
    );
  }

  return {
    status: response.status,
    body,
  };
}

export function getPaymentConfirmedWebhookUrl() {
  return PAYMENT_CONFIRMED_WEBHOOK;
}

export function buildConfirmedPaymentPayload(payment) {
  const metadata = payment?.metadata || {};

  return {
    event: "payment_confirmed",
    payment_id: payment.id,
    payment_status: payment.status,
    payment_status_detail: payment.status_detail,
    transaction_amount: payment.transaction_amount,
    external_reference: payment.external_reference || "",
    customer: {
      full_name: metadata.full_name || "",
      email: metadata.email || "",
      whatsapp: metadata.whatsapp || "",
      payer_cpf: metadata.payer_cpf || "",
      cnpj: metadata.cnpj || "",
    },
    plan: {
      code: metadata.plan_code || "",
      label: metadata.plan_label || "",
      type: metadata.plan_type || "",
      amount: payment.transaction_amount,
    },
    metadata,
  };
}

export async function sendPaymentPendingWebhook({ session, payment }) {
  const payload = buildPayload("payment_pending", session, payment);
  return postWebhook(PAYMENT_PENDING_WEBHOOK, payload);
}
