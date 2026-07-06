import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import Hero from "@/components/sections/Hero";
import WhyUs from "@/components/sections/WhyUs";
import Expertises from "@/components/sections/Expertises";
import Gallery from "@/components/sections/Gallery";
import Stats from "@/components/sections/Stats";
import QuoteForm from "@/components/sections/QuoteForm";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <a
        href="#accueil"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-brass-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-smoke-950"
      >
        Aller au contenu
      </a>
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Expertises />
        <Gallery />
        <Stats />
        <QuoteForm />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
