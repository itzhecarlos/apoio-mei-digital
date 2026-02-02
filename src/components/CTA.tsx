import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight, Shield } from "lucide-react";

const WHATSAPP_LINK = "https://w.app/io4srv";

export const CTA = () => {
  return (
    <section className="py-20 lg:py-28 bg-hero relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-2xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl mb-6 animate-float">
            <Shield className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            Regularize seu MEI <span className="text-gradient">hoje mesmo</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Não deixe para depois! Quanto mais tempo você demora, mais juros acumulam. 
            Fale conosco agora e resolva sua situação de uma vez por todas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                <MessageCircle className="w-6 h-6" />
                Falar no WhatsApp agora
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>

          <p className="text-white/60 text-sm">
            Atendimento de segunda a sexta, das 8h às 18h
          </p>
        </div>
      </div>
    </section>
  );
};
