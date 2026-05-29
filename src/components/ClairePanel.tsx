import { ShieldCheck } from 'lucide-react';

interface ClairePanelProps {
  compact?: boolean;
}

export default function ClairePanel({ compact = false }: ClairePanelProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full justify-between">
      
      {/* Passenger Image Block */}
      <div className={`relative ${compact ? 'aspect-[16/9]' : 'aspect-[4/3]'} bg-slate-100 border-b border-rose-100`}>
        <img 
          src="/src/assets/images/satisfied_traveller_1780042943028.png" 
          alt="Satisfied British train passenger holding standard orange ticket smiling next to scenic countryside view" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Artistic Photo Overlay Tag */}
        <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-md">
          REAL SAVINGS PORTRAIT
        </div>
        
        {/* Dynamic Photo Caption caption text */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
          <p className="text-[10px] font-mono tracking-widest uppercase font-semibold text-amber-300">Passenger Case Study</p>
          <p className="text-[11px] font-sans italic font-medium mt-0.5 opacity-90">"I booked 12 weeks early and used split ticketing to save over £50!"</p>
        </div>
      </div>

      {/* Quote details */}
      <div className="p-5 flex-grow space-y-4">
        <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SAVINGS VERIFIED: 45% COST SLASH</span>
        </div>

        <div>
          <h5 className="font-display font-extrabold text-[#002F6C] text-sm uppercase tracking-tight">
            Claire from Cheltenham Spa
          </h5>
          <p className="text-xs text-slate-500 font-mono -mt-0.5">Frequent traveler on the Great Western route</p>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          "UK train travel holds a legendary design heritage, but the ticket pricing structure can easily accumulate to vast expenditures. By switching to the <strong>12-Week Release Slate</strong> and segmenting cross-platform routes through this portal, my commute is now completely affordable, all while keeping my exact seats!"
        </p>
      </div>

      {/* Call to travel action footer */}
      <div className="bg-slate-50 px-5 py-4 border-t border-slate-150 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold font-semibold">Standard Single Savings</span>
          <span className="text-sm font-display font-extrabold text-emerald-600">Avg. £42/trip Saved</span>
        </div>
        <a 
          href="#fare-finder-section"
          className="bg-[#002F6C] hover:bg-opacity-95 text-white font-sans font-semibold text-xs py-2 px-4 rounded-lg shadow-sm cursor-pointer transition"
        >
          Go to Ticket Splitter
        </a>
      </div>

    </div>
  );
}
