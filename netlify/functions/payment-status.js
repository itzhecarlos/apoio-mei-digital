import { json, badMethod } from "./_lib/http.js";
import { readSessionToken } from "./_lib/session.js";
import { getPaymentById } from "./_lib/mercadopago.js";

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

function extractPaymentArtifacts(payment) {
  const transactionData = payment?.point_of_interaction?.transaction_data || {};
  const qrCode = transactionData.qr_code || transactionData.qr_code_base64 || "";
  const ticketUrl =
    transactionData.ticket_url ||
    transactionData.external_resource_url ||
    payment?.transaction_details?.external_resource_url ||
    "";

  return {
    qr_code: qrCode,
    ticket_url: ticketUrl,
  };
}

export async function handler(event) {
  if (event.httpMethod !== "GET") return badMethod();

  try {
    const sessionToken = event.queryStringParameters?.session || "";
    const paymentId = event.queryStringParameters?.payment_id || "";
    const session = readSessionToken(sessionToken);

    if (!paymentId) {
      return json(400, {
        ok: false,
        message: "payment_id é obrigatório para consultar o status.",
      });
    }

    const payment = await getPaymentById(paymentId);

    if (
      session.external_reference &&
      payment.external_reference &&
      payment.external_reference !== session.external_reference
    ) {
      return json(403, {
        ok: false,
        message: "Pagamento não pertence a esta sessão.",
      });
    }

    const artifacts = extractPaymentArtifacts(payment);

    return json(200, {
      ok: true,
      payment_id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      message: mapStatusMessage(payment.status),
      qr_code: artifacts.qr_code,
      ticket_url: artifacts.ticket_url,
    });
  } catch (error) {
    console.error(error);
    return json(500, {
      ok: false,
      message: error.message || "Não foi possível consultar o status do pagamento.",
    });
  }
}
