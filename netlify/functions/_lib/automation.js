const DEFAULT_PAYMENT_CONFIRMED_WEBHOOK =
  "https://apoiomeidigital.app.n8n.cloud/webhook/send_whatsapp_payment_confirmed";

const PAYMENT_CONFIRMED_WEBHOOK =
  process.env.N8N_WHATSAPP_PAYMENT_CONFIRMED_WEBHOOK || DEFAULT_PAYMENT_CONFIRMED_WEBHOOK;
const PAYMENT_PENDING_WEBHOOK =
  process.env.N8N_WHATSAPP_PAYMENT_PENDING_WEBHOOK || PAYMENT_CONFIRMED_WEBHOOK;

function buildPayload(eventName, session, payment) {
  return {
    event: eventName,
    payment_id: payment.id,
    payment_status: payment.status,
    payment_status_detail: payment.status_detail,
    transaction_amount: payment.transaction_amount,
    external_reference: session.external_reference,
    customer: {
      full_name: session.full_name,
      email: session.email,
      whatsapp: session.whatsapp,
      payer_cpf: session.payer_cpf,
      cnpj: session.cnpj,
    },
    plan: {
      code: session.plan_code,
      label: session.plan_label,
      type: session.plan_type,
      amount: session.amount,
    },
    metadata: payment.metadata || {},
  };
}

async function postWebhook(url, payload) {
  if (!url) return;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Webhook de automação retornou ${response.status}: ${body || "sem corpo de resposta"}`
    );
  }
}

export async function sendPaymentConfirmedWebhook({ session, payment }) {
  const payload = buildPayload("payment_confirmed", session, payment);
  await postWebhook(PAYMENT_CONFIRMED_WEBHOOK, payload);
}

export async function sendPaymentPendingWebhook({ session, payment }) {
  const payload = buildPayload("payment_pending", session, payment);
  await postWebhook(PAYMENT_PENDING_WEBHOOK, payload);
}

export async function sendPaymentApprovedWebhook({ session, payment }) {
  const payload = buildPayload("payment_confirmed", session, payment);
  await postWebhook(PAYMENT_CONFIRMED_WEBHOOK, payload);
}
