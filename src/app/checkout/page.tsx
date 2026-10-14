import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";
import { Footer } from "@/components/footer";

export const metadata: Metadata = { title: "Check out — Inkwell" };

export default function CheckoutPage() {
  return (
    <>
      <main className="min-h-svh bg-mist px-4 pb-24 pt-28">
        <Checkout />
      </main>
      <Footer />
    </>
  );
}
