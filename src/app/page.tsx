import { Buy } from "@/components/buy";
import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { InTheBox } from "@/components/in-the-box";
import { PenSection } from "@/components/pen-section";
import { Specs } from "@/components/specs";
import { Statement } from "@/components/statement";
import { Templates } from "@/components/templates";
import { Timeline } from "@/components/timeline";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Statement />
        <Features />
        <Templates />
        <PenSection />
        <InTheBox />
        <Timeline />
        <Specs />
        <Buy />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
