import crypto from "node:crypto";

const SESSION_SECRET = process.env.CHECKOUT_SESSION_SECRET || "";

function base64UrlEncode(input) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function signPayload(encodedPayload) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(encodedPayload).digest("base64url");
}

export function assertSessionSecret() {
  if (!SESSION_SECRET) {
    throw new Error("Defina CHECKOUT_SESSION_SECRET nas variáveis de ambiente da Netlify.");
  }
}

export function createSessionToken(payload) {
  assertSessionSecret();
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function readSessionToken(token) {
  assertSessionSecret();
  if (!token || !token.includes(".")) {
    throw new Error("Sessão inválida.");
  }

  const [encodedPayload, providedSignature] = token.split(".");
  const expectedSignature = signPayload(encodedPayload);

  if (
    !crypto.timingSafeEqual(
      Buffer.from(providedSignature, "utf8"),
      Buffer.from(expectedSignature, "utf8")
    )
  ) {
    throw new Error("Assinatura de sessão inválida.");
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  if (payload.expires_at && Date.now() > payload.expires_at) {
    throw new Error("Sessão expirada.");
  }

  return payload;
}
