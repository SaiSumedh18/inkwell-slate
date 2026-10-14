import { Buy } from "@/components/buy";
import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { PenSection } from "@/components/pen-section";
import { Specs } from "@/components/specs";
import { Statement } from "@/components/statement";
import { Templates } from "@/components/templates";
import { Timeline } from "@/components/timeline";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Statement />
        <Features />
        <Templates />
        <PenSection />
        <Timeline />
        <Specs />
        <Buy />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
