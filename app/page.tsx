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
