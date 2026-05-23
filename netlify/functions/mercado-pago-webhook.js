import { json, badMethod } from "./_lib/http.js";
import { getPaymentById } from "./_lib/mercadopago.js";
import { sendPaymentApprovedWebhook } from "./_lib/automation.js";

function buildSessionFromPayment(payment) {
  const metadata = payment?.metadata || {};

  return {
    external_reference: payment.external_reference || "",
    full_name: metadata.full_name || payment.payer?.first_name || "",
    email: metadata.email || payment.payer?.email || "",
    whatsapp: metadata.whatsapp || "",
    payer_cpf: metadata.payer_cpf || payment.payer?.identification?.number || "",
    cnpj: metadata.cnpj || "",
    plan_code: metadata.plan_code || "",
    plan_label: metadata.plan_label || "",
    plan_type: metadata.plan_type || "",
    amount: payment.transaction_amount || 0,
  };
}

function extractPaymentId(event) {
  if (event.queryStringParameters?.["data.id"]) return event.queryStringParameters["data.id"];
  if (event.queryStringParameters?.id) return event.queryStringParameters.id;

  try {
    const body = JSON.parse(event.body || "{}");
    return body?.data?.id || body?.id || "";
  } catch {
    return "";
  }
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return badMethod();

  const paymentId = extractPaymentId(event);
  if (!paymentId) {
    return json(200, { ok: true, ignored: true });
  }

  try {
    const payment = await getPaymentById(paymentId);

    if (payment.status === "approved") {
      const session = buildSessionFromPayment(payment);
      try {
        await sendPaymentApprovedWebhook({ session, payment });
      } catch (automationError) {
        console.error("Falha ao disparar webhook de pagamento aprovado:", automationError);
      }
    }

    return json(200, { ok: true });
  } catch (error) {
    console.error(error);
    return json(500, {
      ok: false,
      message: error.message || "Não foi possível processar o webhook do Mercado Pago.",
    });
  }
}
