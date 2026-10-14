import { Buy } from "@/components/buy";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Specs } from "@/components/specs";
import { Statement } from "@/components/statement";
import { Timeline } from "@/components/timeline";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Features />
        <Timeline />
        <Specs />
        <Buy />
      </main>
      <footer className="bg-mist px-4 py-10 text-sm text-muted">
        <div className="mx-auto max-w-5xl">
          Inkwell and Inkwell Slate are a made-up brand and product, designed for this demo site.
        </div>
      </footer>
    </>
  );
}
