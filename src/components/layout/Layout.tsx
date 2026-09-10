import { ReactNode } from "react";
import SonarSiteHeader from "./SonarSiteHeader";
import Footer from "./Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export default function Layout({ children, hideHeader = false, hideWhatsApp = false }: {children: ReactNode; hideHeader?: boolean; hideWhatsApp?: boolean;}) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <SonarSiteHeader />}
      <main className={`flex-1 ${hideHeader ? "" : ""}`}>{children}</main>
      <Footer />
      {!hideWhatsApp && <WhatsAppButton />}
    </div>);

}
