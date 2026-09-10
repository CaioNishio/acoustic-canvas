import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5511967484000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#1DA851] text-[#052e16] px-6 py-5 rounded-full shadow-2xl shadow-black/20 transition-all duration-300 hover:scale-105 group"
    >
      <WhatsAppIcon size={36} />
      <span className="hidden sm:inline text-lg font-semibold tracking-wide font-display">WhatsApp</span>
    </a>
  );
}
