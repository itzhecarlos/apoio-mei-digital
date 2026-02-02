import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Santos",
    role: "Artesã",
    content: "Estava com 2 anos de MEI atrasado e achava que nunca ia resolver. Em menos de 48h já estava tudo regularizado! Atendimento incrível.",
    rating: 5,
  },
  {
    name: "Carlos Silva",
    role: "Prestador de Serviços",
    content: "Precisava urgente regularizar para fechar um contrato grande. A equipe foi super ágil e resolveu tudo muito rápido. Super recomendo!",
    rating: 5,
  },
  {
    name: "Ana Oliveira",
    role: "Consultora",
    content: "Atendimento humanizado e profissional. Me explicaram tudo passo a passo e ficaram comigo até o final. Nota 10!",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary bg-accent px-4 py-2 rounded-full mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
            O que nossos clientes <span className="text-primary">dizem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Veja o que pessoas que já regularizaram o MEI conosco têm a dizer.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-card rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
