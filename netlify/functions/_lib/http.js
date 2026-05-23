export function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(payload),
  };
}

export function badMethod() {
  return json(405, {
    ok: false,
    message: "Método não permitido.",
  });
}

export function parseJsonBody(body) {
  if (!body) return {};
  return JSON.parse(body);
}
