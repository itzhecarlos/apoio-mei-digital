import { CheckCircle, FileCheck, Headphones, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: FileCheck,
    title: "Regularizar DAS MEI atrasado",
    description: "Resolvemos todas as pendências do seu DAS, calculamos valores e geramos as guias corretas.",
  },
  {
    icon: Headphones,
    title: "Orientação passo a passo",
    description: "Você não precisa entender de contabilidade. Guiamos você em cada etapa do processo.",
  },
  {
    icon: CheckCircle,
    title: "Conferência de pendências",
    description: "Analisamos sua situação completa na Receita Federal e identificamos tudo que precisa resolver.",
  },
  {
    icon: TrendingUp,
    title: "Acompanhamento até regularizar",
    description: "Não abandonamos você no meio do caminho. Ficamos juntos até seu CNPJ estar 100% regular.",
  },
];

export const Benefits = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="inline-block text-sm font-semibold text-primary bg-accent px-4 py-2 rounded-full mb-4">
              Nossos serviços
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
              Como podemos <span className="text-primary">te ajudar</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Especialistas em regularização MEI prontos para resolver sua situação 
              de forma rápida, segura e sem dor de cabeça.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-primary rounded-3xl p-8 lg:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-2xl mb-4">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                  Mais de 5.000 MEIs
                </h3>
                <p className="text-primary-foreground/80">
                  já regularizaram com nossa ajuda
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-primary-foreground/80 text-sm">Satisfação</span>
                    <span className="text-secondary font-bold">98%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-primary-foreground/80 text-sm">Casos resolvidos</span>
                    <span className="text-secondary font-bold">99%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '99%' }} />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-primary-foreground/80 text-sm">Tempo médio</span>
                    <span className="text-secondary font-bold">24h</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -z-10 top-8 right-8 w-full h-full bg-secondary/20 rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
