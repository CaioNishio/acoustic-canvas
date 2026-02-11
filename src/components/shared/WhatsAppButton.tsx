import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5511967484000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#075E54] hover:bg-[#064D44] text-white px-5 py-4 rounded-full shadow-2xl shadow-black/20 transition-all duration-300 hover:scale-105 group"
    >
      <MessageCircle size={28} className="fill-white" />
      <span className="hidden sm:inline text-base font-semibold tracking-wide">WhatsApp</span>
    </a>
  );
}
