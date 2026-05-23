import { json, badMethod, parseJsonBody } from "./_lib/http.js";
import { readSessionToken } from "./_lib/session.js";
import { createPayment } from "./_lib/mercadopago.js";
import { sendPaymentPendingWebhook } from "./_lib/automation.js";

function mapStatusMessage(status) {
  switch (status) {
    case "approved":
      return "Pagamento aprovado com sucesso.";
    case "pending":
      return "Pagamento pendente. Aguarde a confirmacao do Mercado Pago.";
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

    console.log("Pagamento criado no Mercado Pago.", {
      payment_id: payment.id,
      payment_status: payment.status,
      payment_status_detail: payment.status_detail,
    });

    if (payment.status === "pending" || payment.status === "in_process") {
      try {
        const automationResponse = await sendPaymentPendingWebhook({ session, payment });
        console.log("Webhook de pagamento pendente chamado.", {
          payment_id: payment.id,
          payment_status: payment.status,
          n8n_called: true,
          n8n_status: automationResponse?.status ?? null,
        });
      } catch (automationError) {
        console.error("Falha ao disparar webhook de automacao pendente:", automationError);
      }
    } else {
      console.log("Pagamento nao esta pendente. Webhook de pendencia nao chamado.", {
        payment_id: payment.id,
        payment_status: payment.status,
      });
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
      message: error.message || "Nao foi possivel processar o pagamento.",
    });
  }
}
