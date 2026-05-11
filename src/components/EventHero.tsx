import { Calendar, MapPin, Share2, ShieldCheck } from 'lucide-react';

export default function EventHero() {
  return (
    <div className="bg-gradient-to-br from-[#3b2a1a] via-[#5c3d20] to-[#3b2a1a] text-[#f5e9d0]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg text-[#f5e9d0]">
              Modas e Memórias convida Almir Sater e Sérgio Reis
            </h1>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-1 flex-shrink-0 text-[#d4a855]" />
                <div>
                  <p className="font-semibold text-[#f5e9d0]">18 de setembro de 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-[#d4a855]" />
                <div>
                  <p className="font-semibold text-[#f5e9d0]">Evento presencial em <span className="text-[#d4a855]">Oásis Eventos, São Carlos/SP</span></p>
                </div>
              </div>
            </div>

            {/* Selo oficial */}
            <div className="inline-flex items-center gap-2.5 bg-white/10 border border-[#d4a855]/60 backdrop-blur-sm rounded-2xl px-4 py-2.5">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4a855] to-[#b8922e] flex items-center justify-center shadow">
                  <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#3b2a1a]" />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-semibold text-[#d4a855] uppercase tracking-widest">Oficial</p>
                <p className="text-xs font-bold text-[#f5e9d0]">Única página de vendas</p>
              </div>
            </div>

          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/bannermoda.png"
                alt="Modas e Memórias convida Almir Sater e Sérgio Reis"
                className="w-full h-full object-cover"
              />
            </div>

            <button className="absolute top-4 right-4 bg-[#f5e9d0] text-[#5c3d20] px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:bg-[#e8d5b0] transition-colors">
              <Share2 className="w-4 h-4" />
              COMPARTILHAR
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
