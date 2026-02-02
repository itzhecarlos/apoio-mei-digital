import { Shield, MessageCircle, Mail, MapPin } from "lucide-react";

const WHATSAPP_LINK = "https://w.app/io4srv";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12 lg:py-16">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">Apoio MEI Digital</span>
            </div>
            <p className="text-primary-foreground/70 mb-6 max-w-md">
              Especialistas em regularização de MEI. Ajudamos você a resolver pendências 
              com a Receita Federal de forma rápida, segura e sem burocracia.
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Fale conosco no WhatsApp
            </a>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <ul className="space-y-3 text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contato@apoiomeidigital.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Atendimento 100% online</span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Serviços</h4>
            <ul className="space-y-3 text-primary-foreground/70">
              <li>Regularização DAS MEI</li>
              <li>Consulta de pendências</li>
              <li>Parcelamento de débitos</li>
              <li>Orientação fiscal</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {currentYear} Apoio MEI Digital. Todos os direitos reservados.
          </p>
          <p className="text-primary-foreground/50 text-sm">
            Atendimento em todo o Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};
