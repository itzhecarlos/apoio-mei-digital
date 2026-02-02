import { AlertTriangle, Ban, FileX, Frown } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Multas e juros acumulados",
    description: "Cada mês de atraso gera juros que só aumentam sua dívida com a Receita Federal.",
  },
  {
    icon: Ban,
    title: "CNPJ irregular",
    description: "Sem regularização, você fica impedido de participar de licitações e perder benefícios.",
  },
  {
    icon: FileX,
    title: "Impossível emitir notas",
    description: "Com pendências, você não consegue emitir notas fiscais e perde oportunidades de negócio.",
  },
  {
    icon: Frown,
    title: "Problemas com a Receita",
    description: "Situação irregular pode gerar cobranças judiciais e negativação do seu nome.",
  },
];

export const Problems = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-secondary bg-secondary/10 px-4 py-2 rounded-full mb-4">
            Você se identifica?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
            Seu MEI está <span className="text-primary">atrasado?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Esses são os principais problemas de quem deixa o DAS MEI em atraso.
            Se você se identificou, não se preocupe — isso tem solução!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-card hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{problem.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-accent rounded-full px-6 py-3">
            <span className="text-2xl">👉</span>
            <span className="text-lg font-semibold text-accent-foreground">Isso tem solução!</span>
          </div>
        </div>
      </div>
    </section>
  );
};
