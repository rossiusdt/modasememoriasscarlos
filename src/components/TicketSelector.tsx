import { useState } from 'react';
import { Plus, Minus, BadgeCheck } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import TableMap, { SOLD_TABLES, getTableTier, getTierPrice, BRONZE_PRICE } from './TableMap';
import type { TableTier } from './TableMap';
import { track } from '../lib/analytics';

interface TicketOption {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  label: string;
  note?: string;
}

const ticketOptions: TicketOption[] = [
  {
    id: 'mesa',
    name: 'MESA (4 A 8 PESSOAS)',
    price: BRONZE_PRICE,
    originalPrice: 497.79,
    label: '',
    note: 'Mesa para 4 a 8 pessoas. Open Bar incluso.',
  },
  {
    id: 'area-premium',
    name: 'AREA PREMIUM',
    price: 97.90,
    originalPrice: 137.79,
    label: 'R$ 97,90',
  },
];

const TIER_BADGE: Record<TableTier, { label: string; className: string }> = {
  diamante: { label: 'Diamante', className: 'text-sky-800 bg-sky-100 border-sky-300' },
  ouro:     { label: 'Ouro',     className: 'text-amber-800 bg-amber-100 border-amber-300' },
  prata:    { label: 'Prata',    className: 'text-slate-700 bg-slate-100 border-slate-300' },
  bronze:   { label: 'Bronze',   className: 'text-orange-800 bg-orange-100 border-orange-300' },
};

const initialQuantities = Object.fromEntries(ticketOptions.map(t => [t.id, 0]));

export default function TicketSelector() {
  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const hasMesa = quantities['mesa'] > 0;

  const updateQuantity = (id: string, delta: number) => {
    const ticket = ticketOptions.find(t => t.id === id);
    setQuantities(prev => {
      const next = Math.max(0, prev[id] + delta);
      if (delta > 0 && next > prev[id]) {
        track('ticket_add', { ticket_id: id, ticket_name: ticket?.name, price: ticket?.price });
      } else if (delta < 0 && next < prev[id]) {
        track('ticket_remove', { ticket_id: id, ticket_name: ticket?.name });
        if (id === 'mesa' && next === 0) setSelectedTable(null);
      }
      return { ...prev, [id]: next };
    });
  };

  const totalTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const canCheckout = totalTickets > 0 && (!hasMesa || selectedTable !== null);

  const currentTier = selectedTable ? getTableTier(selectedTable) : null;
  const mesaUnitPrice = selectedTable
    ? Math.round(getTierPrice(getTableTier(selectedTable)) * 100)
    : Math.round(BRONZE_PRICE * 100);

  const selectedSummary = [
    ...ticketOptions
      .filter(t => quantities[t.id] > 0)
      .map(t => `${quantities[t.id]}x ${t.name}${t.id === 'mesa' && currentTier ? ` (${TIER_BADGE[currentTier].label})` : ''}`),
    hasMesa && selectedTable ? `Mesa ${selectedTable}` : null,
  ]
    .filter(Boolean)
    .join(' + ');

  const totalAmount = ticketOptions.reduce((sum, t) => {
    const unitPrice = t.id === 'mesa' ? mesaUnitPrice : Math.round(t.price * 100);
    return sum + unitPrice * quantities[t.id];
  }, 0);

  const pixItems = ticketOptions
    .filter(t => quantities[t.id] > 0)
    .map(t => ({
      title: t.id === 'mesa' && selectedTable
        ? `${t.name} — Mesa ${selectedTable}${currentTier ? ` (${TIER_BADGE[currentTier].label})` : ''}`
        : t.name,
      unitPrice: t.id === 'mesa' ? mesaUnitPrice : Math.round(t.price * 100),
      quantity: quantities[t.id],
    }));

  const checkoutButtonLabel = () => {
    if (totalTickets === 0) return 'Selecione um Ingresso';
    if (hasMesa && !selectedTable) return 'Escolha sua mesa';
    return 'Finalizar Compra';
  };

  const mesaDisplayPrice = selectedTable
    ? `R$ ${getTierPrice(getTableTier(selectedTable)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    : 'a partir de R$ 297,90';

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
        <p className="text-gray-700 font-medium mb-6">Escolha uma opção</p>

        <div className="space-y-3 mb-6">
          {ticketOptions.map((ticket) => (
            <div key={ticket.id}>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="mb-3">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{ticket.name}</h3>

                  {ticket.id === 'mesa' ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-xs text-gray-400 line-through font-medium">
                          {selectedTable ? 'preço anterior' : 'a partir de R$ 497,79'}
                        </p>
                        <p className="text-lg font-bold text-gray-900 transition-all duration-300">
                          {mesaDisplayPrice}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-sm">
                        50% OFF
                      </span>
                      {currentTier && !SOLD_TABLES.includes(selectedTable!) && (
                        <span className={`text-xs font-semibold border px-1.5 py-0.5 rounded-full ${TIER_BADGE[currentTier].className}`}>
                          {TIER_BADGE[currentTier].label}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-xs text-gray-400 line-through font-medium">
                          R$ {ticket.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-lg font-bold text-gray-900">{ticket.label}</p>
                      </div>
                      <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-sm">
                        50% OFF
                      </span>
                    </div>
                  )}

                  {ticket.note && (
                    <p className="text-xs text-gray-500 mt-1">{ticket.note}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(ticket.id, -1)}
                    disabled={quantities[ticket.id] === 0}
                    className="w-9 h-9 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="w-10 text-center font-semibold text-gray-900">{quantities[ticket.id]}</span>
                  <button
                    onClick={() => updateQuantity(ticket.id, 1)}
                    className="w-9 h-9 rounded-md bg-[#5c3d20] hover:bg-[#3b2a1a] text-[#f5e9d0] flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {ticket.id === 'mesa' && hasMesa && (
                <TableMap
                  selectedTable={selectedTable}
                  onSelect={setSelectedTable}
                />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (!canCheckout) return;
            setModalOpen(true);
            track('checkout_open', { summary: selectedSummary, total: totalAmount, table: selectedTable });
          }}
          disabled={!canCheckout}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-colors"
        >
          {checkoutButtonLabel()}
        </button>

        {/* Selo de reembolso */}
        <div className="mt-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <BadgeCheck className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-green-800 leading-tight">Reembolso garantido</p>
            <p className="text-xs text-green-700 mt-0.5 leading-snug">
              Em caso de desistência, seu dinheiro será devolvido integralmente.
            </p>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedSummary={selectedSummary}
        items={pixItems}
        totalAmount={totalAmount}
      />
    </>
  );
}
