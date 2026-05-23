import { json, badMethod, parseJsonBody } from "./_lib/http.js";
import { readSessionToken } from "./_lib/session.js";
import { createPayment } from "./_lib/mercadopago.js";
import { sendPaymentConfirmedWebhook } from "./_lib/automation.js";

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
  if (event.httpMethod !== "POST") return badMethod();

  try {
    const body = parseJsonBody(event.body);
    const session = readSessionToken(body.session_id || "");
    const payment = await createPayment(session, body.form_data || {});
    const artifacts = extractPaymentArtifacts(payment);

    if (payment.status === "approved") {
      try {
        await sendPaymentConfirmedWebhook({ session, payment });
      } catch (automationError) {
        console.error("Falha ao disparar webhook de automação:", automationError);
      }
    }

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
      message: error.message || "Não foi possível processar o pagamento.",
    });
  }
}
