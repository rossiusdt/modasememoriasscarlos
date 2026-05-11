import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import TableMap, { PREMIUM_TABLES, PREMIUM_PRICE, STANDARD_PRICE } from './TableMap';
import { track } from '../lib/analytics';

interface TicketOption {
  id: string;
  name: string;
  price: number;
  label: string;
  note?: string;
}

const ticketOptions: TicketOption[] = [
  {
    id: 'mesa',
    name: 'MESA (4 A 6 PESSOAS)',
    price: STANDARD_PRICE,
    label: 'a partir de R$ 497,79',
    note: 'Mesa para 4 a 6 pessoas. Open Bar incluso. Mesas próximas ao palco por R$ 679,00.',
  },
  {
    id: 'open-bar-individual',
    name: 'OPEN BAR INDIVIDUAL',
    price: 137.79,
    label: 'R$ 137,79',
  },
];

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
        // reset table if removing all mesas
        if (id === 'mesa' && next === 0) setSelectedTable(null);
      }
      return { ...prev, [id]: next };
    });
  };

  const totalTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const canCheckout = totalTickets > 0 && (!hasMesa || selectedTable !== null);

  const selectedSummary = [
    ...ticketOptions
      .filter(t => quantities[t.id] > 0)
      .map(t => `${quantities[t.id]}x ${t.name} (${t.label})`),
    hasMesa && selectedTable ? `Mesa ${selectedTable}` : null,
  ]
    .filter(Boolean)
    .join(' + ');

  const mesaUnitPrice = selectedTable && PREMIUM_TABLES.includes(selectedTable)
    ? Math.round(PREMIUM_PRICE * 100)
    : Math.round(STANDARD_PRICE * 100);

  const totalAmount = ticketOptions.reduce((sum, t) => {
    const unitPrice = t.id === 'mesa' ? mesaUnitPrice : Math.round(t.price * 100);
    return sum + unitPrice * quantities[t.id];
  }, 0);

  const pixItems = ticketOptions
    .filter(t => quantities[t.id] > 0)
    .map(t => ({
      title: t.id === 'mesa' && selectedTable ? `${t.name} — Mesa ${selectedTable}` : t.name,
      unitPrice: t.id === 'mesa' ? mesaUnitPrice : Math.round(t.price * 100),
      quantity: quantities[t.id],
    }));

  const checkoutButtonLabel = () => {
    if (totalTickets === 0) return 'Selecione um Ingresso';
    if (hasMesa && !selectedTable) return 'Escolha sua mesa';
    return 'Finalizar Compra';
  };

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
                  <p className="text-lg font-bold text-gray-900">{ticket.label}</p>
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
