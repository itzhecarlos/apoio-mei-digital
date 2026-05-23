const MERCADO_PAGO_BASE_URL = "https://api.mercadopago.com";
const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || "";
const MERCADO_PAGO_WEBHOOK_URL =
  process.env.MERCADO_PAGO_WEBHOOK_URL ||
  "https://pay.apoiomeidigital.com.br/api/mercado-pago/webhook";

function pruneUndefined(value) {
  if (Array.isArray(value)) {
    return value.map(pruneUndefined).filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, pruneUndefined(item)])
        .filter(([, item]) => item !== undefined)
    );
  }

  return value === undefined ? undefined : value;
}

function getHeaders(idempotencyKey) {
  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  if (idempotencyKey) {
    headers["X-Idempotency-Key"] = idempotencyKey;
  }

  return headers;
}

export function assertMercadoPagoAccessToken() {
  if (!ACCESS_TOKEN) {
    throw new Error("Defina MERCADO_PAGO_ACCESS_TOKEN nas variáveis de ambiente da Netlify.");
  }
}

async function mercadoPagoRequest(path, payload, options = {}) {
  assertMercadoPagoAccessToken();

  const response = await fetch(`${MERCADO_PAGO_BASE_URL}${path}`, {
    method: options.method || "POST",
    headers: getHeaders(options.idempotencyKey),
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || data?.error || "Erro ao comunicar com o Mercado Pago.";
    const error = new Error(message);
    error.details = data;
    throw error;
  }

  return data;
}

export async function getPaymentById(paymentId) {
  return mercadoPagoRequest(`/v1/payments/${paymentId}`, undefined, {
    method: "GET",
  });
}

export async function createPreference(session) {
  const body = {
    items: [
      {
        id: session.plan_code,
        title: session.plan_label,
        description: `Atendimento Apoio MEI Digital - ${session.plan_label}`,
        quantity: 1,
        currency_id: "BRL",
        unit_price: Number(session.amount),
      },
    ],
    payer: {
      name: session.full_name,
      email: session.email,
    },
    external_reference: session.external_reference,
    notification_url: MERCADO_PAGO_WEBHOOK_URL,
    metadata: {
      plan_code: session.plan_code,
      plan_type: session.plan_type,
      cnpj: session.cnpj,
      payer_cpf: session.payer_cpf,
      full_name: session.full_name,
      whatsapp: session.whatsapp,
      email: session.email,
    },
  };

  return mercadoPagoRequest("/checkout/preferences", body, {
    idempotencyKey: session.idempotency_key,
  });
}

export async function createPayment(session, formData) {
  const isCardPayment = Boolean(formData.token);

  const body = pruneUndefined({
    token: formData.token,
    issuer_id: formData.issuer_id,
    payment_method_id: formData.payment_method_id,
    transaction_amount: Number(formData.transaction_amount || session.amount),
    installments: isCardPayment ? Number(formData.installments || 1) : undefined,
    description: `Apoio MEI Digital - ${session.plan_label}`,
    payer: {
      email: formData.payer?.email || session.email,
      first_name: session.full_name,
      identification: formData.payer?.identification || {
        type: "CPF",
        number: session.payer_cpf,
      },
    },
    external_reference: session.external_reference,
    notification_url: MERCADO_PAGO_WEBHOOK_URL,
    metadata: {
      session_id: session.session_id,
      plan_code: session.plan_code,
      cnpj: session.cnpj,
      payer_cpf: session.payer_cpf,
      full_name: session.full_name,
      whatsapp: session.whatsapp,
      email: session.email,
      plan_label: session.plan_label,
      plan_type: session.plan_type,
    },
  });

  return mercadoPagoRequest("/v1/payments", body, {
    idempotencyKey: `${session.idempotency_key}-payment`,
  });
}
