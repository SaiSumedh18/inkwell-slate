import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Orders dashboard — Inkwell",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main id="main" className="min-h-svh bg-mist px-4 pb-24 pt-28">
      <AdminDashboard />
    </main>
  );
}
