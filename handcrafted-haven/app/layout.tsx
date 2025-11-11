import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Handcrafted Haven",
  description: "Discover and shop unique handmade creations from local artisans.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="grow container mx-auto px-4 py-8">
{children}</main>
        <Footer />
      </body>
    </html>
  );
}
