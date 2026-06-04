const form = document.querySelector(".lead-form");
const planSelect = document.getElementById("plano");
const WHATSAPP_NUMBER = "5541999763884";

const PLAN_META = {
  monthly: {
    label: "Plano Regular Mensal",
    type: "assinatura",
    price: "29,90",
  },
  total_regularization: {
    label: "Regularização Total",
    type: "único",
    price: "99,90",
  },
};

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function buildWhatsAppMessage(payload) {
  const lines = [
    "Olá! Vim pelo site da Apoio MEI Digital e quero solicitar atendimento.",
    "",
    `Plano de interesse: ${payload.plan_label}`,
    `Tipo de contratação: ${payload.plan_type}`,
    `Valor: R$ ${payload.plan_price}`,
    "",
    `Nome completo: ${payload.full_name}`,
    `E-mail: ${payload.email}`,
    `CNPJ: ${payload.cnpj}`,
    "",
    "Estou ciente de que este contato inicial será continuado pelo WhatsApp.",
  ];

  return lines.join("\n");
}

function buildWhatsAppUrl(message) {
  const url = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
  url.searchParams.set("text", message);
  return url.toString();
}

if (form) {
  if (planSelect) {
    const params = new URLSearchParams(window.location.search);
    const preselectedPlan = params.get("plano");
    if (preselectedPlan && PLAN_META[preselectedPlan]) {
      planSelect.value = preselectedPlan;
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedPlan = planSelect?.value || "";
    const selectedMeta = PLAN_META[selectedPlan] || {};

    if (!selectedPlan) {
      alert("Selecione um plano para continuar.");
      return;
    }

    const payload = {
      full_name: (document.getElementById("nome-completo")?.value || "").trim(),
      cnpj: onlyDigits(document.getElementById("cnpj")?.value || ""),
      email: (document.getElementById("email")?.value || "").trim(),
      consent_lgpd: !!document.getElementById("aceite-lgpd")?.checked,
      consent_terms: !!document.getElementById("aceite-termos")?.checked,
      consent_flow: !!document.getElementById("aceite-fluxo")?.checked,
      plan_label: selectedMeta.label || "",
      plan_type: selectedMeta.type || "",
      plan_price: selectedMeta.price || "",
    };

    if (!payload.full_name || !payload.email || !payload.cnpj) {
      alert("Preencha todos os campos obrigatórios antes de continuar.");
      return;
    }

    if (!payload.consent_lgpd || !payload.consent_terms || !payload.consent_flow) {
      alert("Você precisa aceitar os termos, a política de privacidade e o aviso sobre o fluxo para continuar.");
      return;
    }

    const whatsappMessage = buildWhatsAppMessage(payload);
    const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

    window.location.href = whatsappUrl;
  });
}
