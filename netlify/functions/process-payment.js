import { json, badMethod, parseJsonBody } from "./_lib/http.js";
import { readSessionToken } from "./_lib/session.js";
import { createPayment } from "./_lib/mercadopago.js";

function mapStatusMessage(status) {
  switch (status) {
    case "approved":
      return "Pagamento aprovado com sucesso.";
    case "pending":
      return "Pagamento pendente. Aguarde a confirmação do Mercado Pago.";
    case "in_process":
      return "Pagamento em processamento.";
    default:
      return "Pagamento recebido pelo Mercado Pago.";
  }
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return badMethod();

  try {
    const body = parseJsonBody(event.body);
    const session = readSessionToken(body.session_id || "");
    const payment = await createPayment(session, body.form_data || {});

    return json(200, {
      ok: true,
      payment_id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      message: mapStatusMessage(payment.status),
    });
  } catch (error) {
    console.error(error);
    return json(500, {
      ok: false,
      message: error.message || "Não foi possível processar o pagamento.",
    });
  }
}
