import crypto from "node:crypto";
import { json, badMethod, parseJsonBody } from "./_lib/http.js";
import { createSessionToken } from "./_lib/session.js";

const PLAN_PRICING = {
  monthly: {
    label: "Plano Regular Mensal",
    amount: 0.9,
  },
  total_regularization: {
    label: "Regularização Total",
    amount: 1.9,
  },
};

function buildCheckoutUrl(sessionId) {
  return `https://pay.apoiomeidigital.com.br/checkout.html?session=${encodeURIComponent(sessionId)}`;
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return badMethod();

  try {
    const body = parseJsonBody(event.body);
    const pricing = PLAN_PRICING[body.plan_code];

    if (!pricing) {
      return json(400, {
        ok: false,
        message: "Plano de pagamento inválido.",
      });
    }

    const sessionPayload = {
      session_id: crypto.randomUUID(),
      external_reference: `lead_${Date.now()}`,
      idempotency_key: body.idempotency_key || crypto.randomUUID(),
      full_name: String(body.full_name || "").trim(),
      email: String(body.email || "").trim(),
      whatsapp: String(body.whatsapp || "").trim(),
      cnpj: String(body.cnpj || "").trim(),
      payer_cpf: String(body.payer_cpf || "").trim(),
      plan_code: body.plan_code,
      plan_label: pricing.label,
      plan_type: body.plan_type || "",
      amount: pricing.amount,
      expires_at: Date.now() + 30 * 60 * 1000,
    };

    if (!sessionPayload.full_name || !sessionPayload.email || sessionPayload.payer_cpf.length !== 11) {
      return json(400, {
        ok: false,
        message: "Nome, e-mail e CPF do pagador são obrigatórios para iniciar o checkout.",
      });
    }

    const sessionToken = createSessionToken(sessionPayload);

    return json(200, {
      ok: true,
      session_id: sessionToken,
      checkout_url: buildCheckoutUrl(sessionToken),
    });
  } catch (error) {
    console.error(error);
    return json(500, {
      ok: false,
      message: error.message || "Não foi possível criar a sessão de checkout.",
    });
  }
}
