import Link from "next/link";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <main id="main" className="grid min-h-svh place-items-center bg-mist px-4 pt-12 text-center">
        <div>
          <p className="font-hand text-6xl text-cobalt">Blank page.</p>
          <h1 className="mt-4 font-serif text-title font-medium">We couldn’t find that page.</h1>
          <p className="mt-3 text-muted">The link may be old, or the address may have a typo.</p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-cobalt px-8 py-3 font-medium text-white transition-colors hover:bg-ink"
          >
            Go to the home page
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
