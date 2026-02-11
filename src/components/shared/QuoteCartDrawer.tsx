import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, Send, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import { formatPrice } from "@/data/productPrices";

export default function QuoteCartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, totalItems, subtotal } = useQuoteCart();
  const [cep, setCep] = useState("");
  const [freteMsg, setFreteMsg] = useState("");

  const handleCepLookup = () => {
    if (cep.replace(/\D/g, "").length !== 8) {
      setFreteMsg("Informe um CEP válido com 8 dígitos.");
      return;
    }
    // Placeholder — será conectado à Central do Frete quando a API key estiver disponível
    setFreteMsg("Cálculo de frete será ativado em breve. Solicite via WhatsApp para cotação imediata.");
  };

  const handleWhatsApp = () => {
    const lines = items.map(
      (item, i) =>
        `${i + 1}. ${item.name}${item.size ? ` (${item.size})` : ""}${item.color ? ` — Cor: ${item.color}` : ""} × ${item.quantity} = ${formatPrice(item.unitPrice * item.quantity)}`
    );
    const msg = [
      "🔊 *Orçamento Sonar Acústicos*",
      "",
      ...lines,
      "",
      `*Subtotal:* ${formatPrice(subtotal)}`,
      cep ? `*CEP:* ${cep}` : "",
      "",
      "Gostaria de receber o orçamento completo com frete e prazo. Obrigado!",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/5511967484000?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={closeCart}
          />
          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-[61] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="font-display text-lg font-bold text-foreground">Meu Orçamento</h2>
                {totalItems > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
                  <ShoppingBag size={48} className="opacity-30" />
                  <p className="text-sm">Seu orçamento está vazio.</p>
                  <p className="text-xs">Adicione produtos para montar seu pedido.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <div key={`${item.slug}-${item.size}-${item.color}-${i}`} className="flex gap-3 bg-card border border-border rounded-xl p-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {item.size && (
                            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-mono">
                              {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground flex items-center gap-1">
                              {item.colorHex && <span className="w-2.5 h-2.5 rounded-full inline-block border border-border" style={{ backgroundColor: item.colorHex }} />}
                              {item.color}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateQuantity(i, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center rounded-md border border-border hover:bg-muted disabled:opacity-30 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-bold w-8 text-center text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(i, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-primary">{formatPrice(item.unitPrice * item.quantity)}</span>
                        </div>
                      </div>
                      <button onClick={() => removeItem(i)} className="self-start p-1.5 hover:bg-destructive/10 rounded-md transition-colors">
                        <Trash2 size={14} className="text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-4 space-y-4">
                {/* CEP / Frete */}
                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
                    <Truck size={14} className="text-primary" /> Calcular Frete
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      placeholder="00000-000"
                      maxLength={9}
                      className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      onClick={handleCepLookup}
                      className="px-4 py-2 text-sm font-semibold bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      Calcular
                    </button>
                  </div>
                  {freteMsg && <p className="text-xs text-muted-foreground mt-1.5">{freteMsg}</p>}
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"})</span>
                  <span className="text-xl font-bold text-foreground">{formatPrice(subtotal)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="px-4 py-3 text-sm font-semibold border-2 border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#20bd5a] transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
                  >
                    <Send size={16} /> Enviar via WhatsApp
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
