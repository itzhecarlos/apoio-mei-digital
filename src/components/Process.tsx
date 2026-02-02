import { MessageCircle, Search, CreditCard, ClipboardCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_LINK = "https://w.app/io4srv";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Chame no WhatsApp",
    description: "Entre em contato conosco de forma rápida e fácil pelo WhatsApp.",
    color: "bg-[hsl(142_70%_45%)]",
  },
  {
    number: "02",
    icon: Search,
    title: "Analisamos sua situação",
    description: "Verificamos todas as pendências do seu MEI na Receita Federal.",
    color: "bg-primary",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Pagamento via PIX",
    description: "Escolha seu plano e pague de forma rápida e segura via PIX.",
    color: "bg-secondary",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Orientamos até regularizar",
    description: "Acompanhamos você até seu CNPJ estar completamente regular.",
    color: "bg-primary",
  },
];

export const Process = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-secondary bg-secondary/10 px-4 py-2 rounded-full mb-4">
            Simples e rápido
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
            Como <span className="text-primary">funciona?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Em apenas 4 passos simples você regulariza seu MEI e volta a trabalhar tranquilo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border">
                  <ArrowRight className="absolute -right-2 -top-2 w-5 h-5 text-muted-foreground" />
                </div>
              )}
              
              <div className="relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 h-full">
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-xs font-bold text-muted-foreground mb-2">PASSO {step.number}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="xl">
              <MessageCircle className="w-6 h-6" />
              Começar agora no WhatsApp
              <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
