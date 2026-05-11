import { MapPin } from 'lucide-react';

interface TableMapProps {
  selectedTable: number | null;
  onSelect: (table: number) => void;
}

// Layout: 5 colunas x 5 linhas = 25 mesas
// Fileiras mais próximas do palco ficam na parte de baixo do grid (row index 4)
const COLS = 5;
const ROWS = 5;

function tableNumber(row: number, col: number) {
  return row * COLS + col + 1;
}

// Distância do palco: row 4 = mais próximo, row 0 = mais distante
function rowLabel(row: number) {
  const labels = ['E', 'D', 'C', 'B', 'A'];
  return labels[row];
}

export default function TableMap({ selectedTable, onSelect }: TableMapProps) {
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

        {/* Subtle arrow indicating direction */}
        <div className="flex justify-center mb-3">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-px h-3 bg-gray-300" />
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-300" />
          </div>
        </div>

        {/* Table grid — row 0 closest to stage */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {Array.from({ length: ROWS }, (_, row) =>
            Array.from({ length: COLS }, (_, col) => {
              const num = tableNumber(row, col);
              const isSelected = selectedTable === num;
              // Closer to stage = warmer color
              const proximityClass =
                row === 0
                  ? 'bg-amber-100 border-amber-300 hover:bg-amber-200'
                  : row === 1
                  ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                  : 'bg-white border-gray-200 hover:bg-gray-50';

              return (
                <button
                  key={num}
                  onClick={() => onSelect(num)}
                  title={`Mesa ${num} — Fileira ${rowLabel(row)}`}
                  className={`
                    relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center
                    transition-all duration-150 text-xs font-bold shadow-sm
                    ${isSelected
                      ? 'bg-[#5c3d20] border-[#3b2a1a] text-[#f5e9d0] scale-105 shadow-md ring-2 ring-[#d4a855] ring-offset-1'
                      : `${proximityClass} text-gray-700`
                    }
                  `}
                >
                  <span className="leading-none">{num}</span>
                  <span className={`text-[9px] mt-0.5 font-normal ${isSelected ? 'text-[#f5e9d0]/70' : 'text-gray-400'}`}>
                    {rowLabel(row)}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-amber-100">
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block" />
              Mais próximo do palco
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-white border border-gray-200 inline-block" />
              Mais distante
            </span>
          </div>
          {selectedTable && (
            <span className="text-xs font-semibold text-[#5c3d20] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Mesa {selectedTable}
            </span>
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
