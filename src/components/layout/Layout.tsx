import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export default function Layout({ children }: {children: ReactNode;}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-28">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>);

}