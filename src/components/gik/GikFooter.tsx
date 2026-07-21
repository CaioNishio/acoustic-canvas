import { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";

const columns = [
  {
    title: "Explorar",
    links: [
      { label: "Produtos", to: "/produtos" },
      { label: "Soluções", to: "/solucoes" },
      { label: "Projetos", to: "/projetos" },
    ],
  },
  {
    title: "Ferramentas & Educação",
    links: [
      { label: "Calculadora Acústica", to: "/calculadora" },
      { label: "Artigos", to: "/projetos" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Contato", to: "/contato" },
      { label: "Perguntas Frequentes", to: "/contato" },
    ],
  },
];

const socials = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/sonar_acusticos" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

const GikFooter = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <footer className="bg-[#0B0E11] bg-gradient-to-b from-[#193139] to-[#0B0E11] py-[72px] text-[#FDFEFE] font-['Lexend']">
      <div className="mx-auto max-w-[1440px] px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-5 font-['Lexend_Giga'] text-sm font-semibold uppercase tracking-wide">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#FDFEFE]/70 transition-colors hover:text-[#FDFEFE]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-5 font-['Lexend_Giga'] text-sm font-semibold uppercase tracking-wide">
              Newsletter
            </h4>
            <p className="mb-4 text-sm text-[#FDFEFE]/70">
              Fique por dentro das novidades e lançamentos da Sonar.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Seu e-mail"
                aria-label="Seu e-mail"
                className="w-full rounded-lg border border-[#FDFEFE]/20 bg-[#FDFEFE]/5 px-4 py-2.5 text-sm text-[#FDFEFE] placeholder:text-[#FDFEFE]/40 focus:border-[#FDFEFE]/50 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-[#FDFEFE] px-5 py-2.5 text-sm font-semibold text-[#0B0E11] transition-opacity hover:opacity-85"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-[#FDFEFE]/10 pt-8 md:flex-row">
          <p className="text-[13px] text-[#FDFEFE]/60">
            © 2026 Sonar Acústicos. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-[#FDFEFE]/60 transition-colors hover:text-[#FDFEFE]"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GikFooter;
