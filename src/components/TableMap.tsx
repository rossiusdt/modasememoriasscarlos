import { MapPin, X } from 'lucide-react';

// Row 0 = fileira A (frente, mais próxima do palco)
// Row 4 = fileira E (fundo)

export const SOLD_TABLES = [2, 4, 8, 12, 14, 19, 23];

export const DIAMANTE_TABLES = [1, 2, 3, 4, 5];   // row 0
export const OURO_TABLES     = [6, 7, 8, 9, 10];  // row 1
export const PRATA_TABLES    = [11, 12, 13, 14, 15]; // row 2
// row 3-4 = bronze
export const BRONZE_TABLES   = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

export const DIAMANTE_PRICE = 597.90;
export const OURO_PRICE     = 397.90;
export const PRATA_PRICE    = 297.90;
export const BRONZE_PRICE   = 197.90;

// kept for TicketSelector default display
export const STANDARD_PRICE = BRONZE_PRICE;
export const PREMIUM_PRICE  = DIAMANTE_PRICE;
// kept for legacy strikethrough display
export const PREMIUM_PRICE_ORIGINAL  = 679.00;
export const STANDARD_PRICE_ORIGINAL = 497.79;

// legacy alias used by TicketSelector
export const PREMIUM_TABLES = DIAMANTE_TABLES;

export type TableTier = 'diamante' | 'ouro' | 'prata' | 'bronze';

export function getTableTier(tableNum: number): TableTier {
  if (DIAMANTE_TABLES.includes(tableNum)) return 'diamante';
  if (OURO_TABLES.includes(tableNum))     return 'ouro';
  if (PRATA_TABLES.includes(tableNum))    return 'prata';
  return 'bronze';
}

export function getTierPrice(tier: TableTier): number {
  switch (tier) {
    case 'diamante': return DIAMANTE_PRICE;
    case 'ouro':     return OURO_PRICE;
    case 'prata':    return PRATA_PRICE;
    case 'bronze':   return BRONZE_PRICE;
  }
}

interface TableMapProps {
  selectedTable: number | null;
  onSelect: (table: number) => void;
}

const COLS = 5;
const ROWS = 5;

function tableNumber(row: number, col: number) {
  return row * COLS + col + 1;
}

function rowLabel(row: number) {
  const labels = ['E', 'D', 'C', 'B', 'A'];
  return labels[row];
}

const TIER_STYLES: Record<TableTier, { idle: string; badge: string; label: string; dot: string }> = {
  diamante: {
    idle:  'bg-sky-100 border-sky-400 hover:bg-sky-200 text-sky-900',
    badge: 'text-sky-800',
    label: 'Diamante',
    dot:   'bg-sky-200 border border-sky-400',
  },
  ouro: {
    idle:  'bg-amber-200 border-amber-400 hover:bg-amber-300 text-amber-900',
    badge: 'text-amber-700',
    label: 'Ouro',
    dot:   'bg-amber-200 border border-amber-400',
  },
  prata: {
    idle:  'bg-slate-200 border-slate-400 hover:bg-slate-300 text-slate-800',
    badge: 'text-slate-600',
    label: 'Prata',
    dot:   'bg-slate-200 border border-slate-400',
  },
  bronze: {
    idle:  'bg-orange-100 border-orange-300 hover:bg-orange-200 text-orange-900',
    badge: 'text-orange-700',
    label: 'Bronze',
    dot:   'bg-orange-100 border border-orange-300',
  },
};

const TIER_PRICE_LABEL: Record<TableTier, string> = {
  diamante: `R$ ${DIAMANTE_PRICE.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  ouro:     `R$ ${OURO_PRICE.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  prata:    `R$ ${PRATA_PRICE.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  bronze:   `R$ ${BRONZE_PRICE.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
};

export default function TableMap({ selectedTable, onSelect }: TableMapProps) {
  const tiers: TableTier[] = ['diamante', 'ouro', 'prata', 'bronze'];

  return (
    <div className="mt-4 border border-amber-200 rounded-xl overflow-hidden bg-[#fdf8f0]">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[#5c3d20]" />
          <p className="text-sm font-semibold text-[#3b2a1a]">Escolha sua mesa</p>
        </div>

        {/* Stage */}
        <div className="flex justify-center mb-4">
          <div className="relative bg-gradient-to-b from-[#3b2a1a] to-[#5c3d20] text-[#f5e9d0] text-xs font-bold tracking-widest uppercase px-10 py-2.5 rounded-lg shadow-md w-full max-w-[220px] text-center">
            <span className="opacity-90">Palco</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#5c3d20] rotate-45" />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-3">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-px h-3 bg-gray-300" />
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-300" />
          </div>
        </div>

        {/* Table grid */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {Array.from({ length: ROWS }, (_, row) =>
            Array.from({ length: COLS }, (_, col) => {
              const num = tableNumber(row, col);
              const isSelected = selectedTable === num;
              const isSold = SOLD_TABLES.includes(num);
              const tier = getTableTier(num);
              const styles = TIER_STYLES[tier];

              if (isSold) {
                return (
                  <div
                    key={num}
                    title={`Mesa ${num} — Esgotada`}
                    className="relative aspect-square rounded-lg border-2 border-red-300 bg-red-100 flex flex-col items-center justify-center cursor-not-allowed"
                  >
                    <X className="w-3.5 h-3.5 text-red-400 absolute top-1 right-1" />
                    <span className="text-xs font-bold text-red-400 leading-none">{num}</span>
                    <span className="text-[9px] mt-0.5 font-normal text-red-300">{rowLabel(row)}</span>
                  </div>
                );
              }

              return (
                <button
                  key={num}
                  onClick={() => onSelect(num)}
                  title={`Mesa ${num} — ${styles.label} — ${TIER_PRICE_LABEL[tier]}`}
                  className={`
                    relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center
                    transition-all duration-150 text-xs font-bold shadow-sm
                    ${isSelected
                      ? 'bg-[#5c3d20] border-[#3b2a1a] text-[#f5e9d0] scale-105 shadow-md ring-2 ring-[#d4a855] ring-offset-1'
                      : styles.idle
                    }
                  `}
                >
                  <span className="leading-none">{num}</span>
                  <span className={`text-[9px] mt-0.5 font-normal ${isSelected ? 'text-[#f5e9d0]/70' : styles.badge}`}>
                    {rowLabel(row)}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-amber-100">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] text-gray-600">
            {tiers.map(tier => (
              <span key={tier} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded flex-shrink-0 ${TIER_STYLES[tier].dot}`} />
                <span className="font-semibold">{TIER_STYLES[tier].label}</span>
                <span className="text-gray-400">— {TIER_PRICE_LABEL[tier]}</span>
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded flex-shrink-0 bg-red-100 border border-red-300" />
              <span className="text-gray-400">Esgotada</span>
            </span>
          </div>
          {selectedTable && (
            <div className="mt-2 flex justify-end">
              <span className="text-xs font-semibold text-[#5c3d20] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Mesa {selectedTable} — {TIER_STYLES[getTableTier(selectedTable)].label}
              </span>
            </div>
          )}
        </div>
      </div>

      {!selectedTable && (
        <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100">
          <p className="text-xs text-amber-700 text-center font-medium">
            Selecione uma mesa para continuar
          </p>
        </div>
      )}
    </div>
  );
}
