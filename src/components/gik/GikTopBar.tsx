import { Search, ChevronDown } from "lucide-react";

const GikTopBar = () => {
  return (
    <div className="h-12 bg-[#0B0E11] text-[#FDFEFE] font-['Lexend'] text-[13px]">
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-3 items-center px-12">
        <div className="hidden lg:block" />
        <p className="col-span-3 text-center lg:col-span-1 lg:col-start-2">
          Fabricado sob medida no Brasil — Frete para todo o país
        </p>
        <div className="hidden items-center justify-end gap-6 lg:flex">
          <button
            type="button"
            className="flex items-center gap-1 transition-opacity hover:opacity-70"
            aria-label="Selecionar moeda"
          >
            BRL R$
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="transition-opacity hover:opacity-70"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GikTopBar;
