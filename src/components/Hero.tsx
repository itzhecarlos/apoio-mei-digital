import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, CheckCircle, ArrowRight } from "lucide-react";

const WHATSAPP_LINK = "https://w.app/io4srv";

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-hero overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl animate-float" />
      </div>

      <div className="container relative z-10 pt-8 pb-20 lg:pt-12">
        {/* Top bar */}
        <nav className="flex items-center justify-between mb-16 lg:mb-24">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-xl font-bold text-white">Apoio MEI</span>
          </div>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            <Button variant="heroOutline" size="sm">
              <MessageCircle className="w-4 h-4" />
              Falar conosco
            </Button>
          </a>
        </nav>

        {/* Hero content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-sm text-white/90">Atendimento 100% online para todo Brasil</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              MEI atrasado?
              <br />
              <span className="text-gradient">Regularize hoje</span>
              <br />
              sem complicação.
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
              Evite multas, juros e problemas com a Receita Federal. 
              Especialistas prontos para regularizar seu CNPJ de forma rápida e segura.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <MessageCircle className="w-5 h-5" />
                  Regularizar meu MEI agora
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span className="text-sm">Sem burocracia</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span className="text-sm">Pagamento via PIX</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span className="text-sm">Suporte completo</span>
              </div>
            </div>
          </div>

          {/* Right side - Stats/Visual */}
          <div className="relative animate-fade-in hidden lg:block">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4">
                    <div className="text-4xl font-extrabold text-secondary mb-2">+5.000</div>
                    <div className="text-sm text-white/70">MEIs regularizados</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-extrabold text-white mb-2">98%</div>
                    <div className="text-sm text-white/70">Clientes satisfeitos</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-extrabold text-white mb-2">24h</div>
                    <div className="text-sm text-white/70">Tempo médio</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-extrabold text-secondary mb-2">100%</div>
                    <div className="text-sm text-white/70">Online</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-secondary rounded-2xl p-4 shadow-elevated animate-float">
                <Shield className="w-8 h-8 text-emerald-dark" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl px-5 py-3 shadow-elevated">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">CNPJ Regularizado!</div>
                    <div className="text-xs text-muted-foreground">Há 2 minutos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};
