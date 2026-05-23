import { json, badMethod } from "./_lib/http.js";
import { readSessionToken } from "./_lib/session.js";
import { createPreference } from "./_lib/mercadopago.js";

export async function handler(event) {
  if (event.httpMethod !== "GET") return badMethod();

  try {
    const sessionId = event.queryStringParameters?.session || "";
    const session = readSessionToken(sessionId);
    const preference = await createPreference(session);

    return json(200, {
      ok: true,
      session: {
        ...session,
        preference_id: preference.id,
      },
    });
  } catch (error) {
    console.error(error);
    return json(500, {
      ok: false,
      message: error.message || "Não foi possível carregar a sessão de pagamento.",
    });
  }
}
