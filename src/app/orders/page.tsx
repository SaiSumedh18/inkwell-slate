import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { OrderLookup } from "@/components/order-lookup";

export const metadata: Metadata = { title: "Order status — Inkwell" };

export default function OrdersPage() {
  return (
    <>
      <main id="main" className="min-h-svh bg-mist px-4 pb-24 pt-28">
        <Suspense>
          <OrderLookup />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
