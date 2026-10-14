import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lull One — Wake up to a sunrise",
  description:
    "Lull One is a sunrise alarm light. Thirty minutes of slowly rising light, then a soft chime. No phone needed.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrument.variable} antialiased`}>
      <body className="font-sans">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
