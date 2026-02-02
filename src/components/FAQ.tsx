import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Quanto tempo demora para regularizar meu MEI?",
    answer: "Na maioria dos casos, conseguimos regularizar em até 24 horas úteis. Casos mais complexos podem levar até 72 horas, mas você sempre será informado sobre o andamento.",
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer: "Aceitamos pagamento via PIX, que é a forma mais rápida e segura. Assim que confirmamos o pagamento, já iniciamos o processo de regularização.",
  },
  {
    question: "Vocês atendem todo o Brasil?",
    answer: "Sim! Nosso atendimento é 100% online, então atendemos MEIs de todos os estados brasileiros.",
  },
  {
    question: "Preciso ter conhecimento de contabilidade?",
    answer: "Não! Nós cuidamos de tudo para você. Explicamos cada passo de forma simples e você só precisa seguir nossas orientações.",
  },
  {
    question: "E se meu MEI estiver muito atrasado?",
    answer: "Não importa há quanto tempo está atrasado, sempre tem solução. Já ajudamos pessoas com mais de 5 anos de atraso a regularizar. Entre em contato e vamos analisar sua situação.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-8">
            <span className="inline-block text-sm font-semibold text-secondary bg-secondary/10 px-4 py-2 rounded-full mb-4">
              Tire suas dúvidas
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
              Perguntas <span className="text-primary">frequentes</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Reunimos as dúvidas mais comuns sobre nosso serviço de regularização MEI. 
              Não encontrou o que procura? Fale conosco pelo WhatsApp!
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-primary/30 data-[state=open]:shadow-soft transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
