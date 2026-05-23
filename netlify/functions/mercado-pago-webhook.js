import { json, badMethod } from "./_lib/http.js";
import {
  buildConfirmedPaymentPayload,
  getPaymentConfirmedWebhookUrl,
} from "./_lib/automation.js";

function parseWebhookBody(body) {
  if (!body) return {};

  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

function extractPaymentId(event) {
  const body = parseWebhookBody(event.body);
  const query = event.queryStringParameters || {};

  return {
    body,
    query,
    paymentId:
      body?.data?.id ||
      body?.id ||
      body?.payment_id ||
      query?.id ||
      query?.["data.id"] ||
      "",
  };
}

async function postConfirmedWebhook(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text();

  return {
    status: response.status,
    body,
    ok: response.ok,
  };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return badMethod();

  try {
    const { body, query, paymentId } = extractPaymentId(event);

    if (!paymentId) {
      console.log("Webhook recebido sem paymentId", { body, query });
      return json(200, {
        success: true,
        n8n_called: false,
        message: "Nenhum paymentId recebido",
      });
    }

    console.log("PaymentId recebido:", paymentId);

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || "";
    if (!accessToken) {
      console.error("MERCADO_PAGO_ACCESS_TOKEN nao configurado.");
      return json(200, {
        success: false,
        n8n_called: false,
        message: "MERCADO_PAGO_ACCESS_TOKEN nao configurado",
      });
    }

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const payment = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("Erro ao consultar pagamento no Mercado Pago", {
        payment_id: paymentId,
        status: mpResponse.status,
        payment,
      });

      return json(200, {
        success: false,
        n8n_called: false,
        message: "Erro ao consultar pagamento no Mercado Pago",
        mp_status_code: mpResponse.status,
      });
    }

    console.log("Status real do pagamento:", payment.status, {
      payment_id: payment.id,
      payment_status_detail: payment.status_detail,
    });

    if (payment.status !== "approved") {
      console.log("Pagamento ainda nao aprovado. n8n nao chamado.", {
        payment_id: payment.id,
        payment_status: payment.status,
        payment_status_detail: payment.status_detail,
      });

      return json(200, {
        success: true,
        n8n_called: false,
        message: "Pagamento ainda nao aprovado. n8n nao chamado.",
        payment_id: payment.id,
        payment_status: payment.status,
        payment_status_detail: payment.status_detail,
      });
    }

    const n8nWebhookUrl = getPaymentConfirmedWebhookUrl();
    const n8nPayload = buildConfirmedPaymentPayload(payment);

    console.log("Pagamento aprovado. Chamando n8n.", {
      payment_id: payment.id,
      payment_status: payment.status,
      n8n_url_configured: Boolean(n8nWebhookUrl),
    });

    if (!n8nWebhookUrl) {
      console.log("Webhook de confirmacao nao configurado. n8n nao chamado.", {
        payment_id: payment.id,
      });

      return json(200, {
        success: true,
        n8n_called: false,
        message: "Pagamento aprovado, mas webhook do n8n nao configurado.",
        payment_id: payment.id,
        payment_status: payment.status,
      });
    }

    const n8nResponse = await postConfirmedWebhook(n8nWebhookUrl, n8nPayload);

    console.log("Resposta do n8n:", {
      payment_id: payment.id,
      called: true,
      status: n8nResponse.status,
      body: n8nResponse.body,
    });

    if (!n8nResponse.ok) {
      return json(200, {
        success: false,
        n8n_called: true,
        message: "Pagamento aprovado, mas o n8n retornou erro.",
        payment_id: payment.id,
        payment_status: payment.status,
        n8n_status: n8nResponse.status,
      });
    }

    return json(200, {
      success: true,
      n8n_called: true,
      message: "Pagamento aprovado e webhook do n8n chamado.",
      payment_id: payment.id,
      payment_status: payment.status,
      payment_status_detail: payment.status_detail,
      n8n_status: n8nResponse.status,
    });
  } catch (error) {
    console.error("Erro ao processar webhook do Mercado Pago:", error);

    return json(200, {
      success: false,
      n8n_called: false,
      message: "Erro interno ao processar webhook do Mercado Pago",
    });
  }
}
