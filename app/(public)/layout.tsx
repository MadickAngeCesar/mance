import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
