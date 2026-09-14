import { Instagram, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import logo from "@/assets/logo-sonar.png";

const products = ["Absorção Acústica", "Controle de Graves", "Difusão Sonora", "Soluções Especiais", "Tratamento Aéreo"];
const spaces = [["Estúdio", "estudios"], ["Templo", "igrejas"], ["Auditório", "auditorios"], ["Corporativo", "corporativo"], ["Residencial", "residencial"]];

export default function Footer() {
  return <footer className="relative order-last overflow-hidden bg-[#010d20] text-white">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-12 h-40 opacity-40 [background-image:radial-gradient(ellipse_at_50%_100%,rgba(20,126,235,.55),transparent_58%)]" />
    <div className="relative mx-auto grid max-w-[1280px] gap-10 px-6 pb-16 pt-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.05fr_1fr_1fr_1.35fr] lg:gap-12 lg:pb-20 lg:pt-20">
      <div>
        <img src={logo} alt="Sonar Acústicos" className="h-24 w-auto object-contain object-left" loading="lazy" decoding="async" />
        <p className="mt-4 max-w-[24ch] text-sm leading-6 text-white/72" style={{ fontFamily: "system-ui, sans-serif" }}>Soluções profissionais em tratamento acústico para todos os tipos de ambientes.</p>
        <div className="mt-6 flex gap-3"><a href="https://www.instagram.com/sonar_acusticos" target="_blank" rel="noreferrer" aria-label="Instagram da Sonar Acústicos" className="grid size-11 place-items-center rounded-full border border-white/35 transition-colors hover:border-[#d5a14d] hover:text-[#d5a14d]"><Instagram size={20}/></a><a href="https://wa.me/5511967484000" target="_blank" rel="noreferrer" aria-label="WhatsApp da Sonar Acústicos" className="grid size-11 place-items-center rounded-full border border-white/35 transition-colors hover:border-[#d5a14d] hover:text-[#d5a14d]"><WhatsAppIcon size={20}/></a></div>
      </div>
      <FooterColumn title="PRODUTOS">{products.map(label => <Link key={label} to="/produtos" className="border-b border-white/10 py-2.5 transition-colors hover:text-[#d5a14d]">{label}</Link>)}</FooterColumn>
      <FooterColumn title="ESPAÇOS">{spaces.map(([label, slug]) => <Link key={slug} to={`/solucoes/${slug}`} className="border-b border-white/10 py-2.5 transition-colors hover:text-[#d5a14d]">{label}</Link>)}</FooterColumn>
      <FooterColumn title="CONTATO"><a href="mailto:contato@sonaracusticos.com.br" className="flex min-h-11 items-center gap-3 transition-colors hover:text-[#d5a14d]"><Mail size={21}/>contato@sonaracusticos.com.br</a><a href="https://wa.me/5511967484000" target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-3 transition-colors hover:text-[#d5a14d]"><WhatsAppIcon size={21}/>(11) 96748-4000</a><a href="https://www.instagram.com/sonar_acusticos" target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-3 transition-colors hover:text-[#d5a14d]"><Instagram size={21}/>@sonar_acusticos</a><p className="flex min-h-11 items-center gap-3"><MapPin size={21}/>São Paulo, SP</p></FooterColumn>
    </div>
    <div className="relative border-t border-white/15 px-6 py-5 text-center text-[11px] tracking-[.12em] text-white/55">© {new Date().getFullYear()} SONAR ACÚSTICOS. TODOS OS DIREITOS RESERVADOS. <span className="whitespace-nowrap">CNPJ 50.208.185/0001-00</span></div>
  </footer>;
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="flex flex-col text-sm text-white/72"><h2 className="mb-4 text-base tracking-[.18em] text-white">{title}</h2><span className="mb-2 h-0.5 w-12 bg-[#d5a14d]" aria-hidden="true"/>{children}</div>;
}
