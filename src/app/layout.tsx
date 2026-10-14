import type { Metadata } from "next";
import { Caveat, Hanken_Grotesk, Newsreader } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inkwell Slate — Paper, but it remembers",
  description:
    "Inkwell Slate is a paper-thin e-ink notebook. Write by hand, search it like text, and never see a notification.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${newsreader.variable} ${caveat.variable} antialiased`}
    >
      <body className="font-sans">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
