import { Hero } from "@/components/Hero";
import { Problems } from "@/components/Problems";
import { Benefits } from "@/components/Benefits";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Problems />
      <Benefits />
      <Process />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
