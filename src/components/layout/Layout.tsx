import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export default function Layout({ children }: {children: ReactNode;}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-[7.25rem] xl:pt-[7.75rem]">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>);

}