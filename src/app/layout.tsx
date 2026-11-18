import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PawTrail from "@/components/PawTrail";
import { readContent } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    default: "Woof Woof Woof Club — Dog walking, training & boarding in Chester",
    template: "%s | Woof Woof Woof Club",
  },
  description:
    "Five-star licensed dog care in Chester. Enriched walks, training, boarding, daycare and pet sitting — your dog's new favourite humans.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f59e0b",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { contact } = await readContent();
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <PawTrail />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer {...contact} />
      </body>
    </html>
  );
}
