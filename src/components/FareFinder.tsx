import { useState, useEffect } from 'react';
import { STATIONS, calculateFare } from '../data/railData';
import { FareCalculation, Station } from '../types';
import { Search, ArrowUpDown, Calendar, HelpCircle, CheckCircle, Sparkles, ExternalLink, Flame, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FareFinder() {
  const [origin, setOrigin] = useState('KGX');
  const [destination, setDestination] = useState('EDB');
  const [railcard, setRailcard] = useState('none');
  const [travelDate, setTravelDate] = useState(() => {
    // default to tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [travelTime, setTravelTime] = useState('09:00');
  
  // Search suggestion state
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  
  const [fareResult, setFareResult] = useState<FareCalculation | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Load initial fare details
  useEffect(() => {
    handleCalculate();
  }, []);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    
    // update search boxes too
    const oName = STATIONS.find(s => s.code === destination)?.name || '';
    const dName = STATIONS.find(s => s.code === origin)?.name || '';
    setOriginSearch(oName);
    setDestSearch(dName);
  };

  const currentOrigin = STATIONS.find(s => s.code === origin);
  const currentDest = STATIONS.find(s => s.code === destination);

  // sync search text with selected codes
  useEffect(() => {
    if (currentOrigin && !originSearch) setOriginSearch(currentOrigin.name);
  }, [origin]);

  useEffect(() => {
    if (currentDest && !destSearch) setDestSearch(currentDest.name);
  }, [destination]);

  const handleCalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      const result = calculateFare(origin, destination, railcard, travelDate, travelTime);
      setFareResult(result);
      setCalculating(false);
    }, 450);
  };

  // Filter stations for suggestions
  const originSuggestions = STATIONS.filter(s => 
    s.name.toLowerCase().includes(originSearch.toLowerCase()) ||
    s.code.toLowerCase().includes(originSearch.toLowerCase())
  );

  const destSuggestions = STATIONS.filter(s => 
    s.name.toLowerCase().includes(destSearch.toLowerCase()) ||
    s.code.toLowerCase().includes(destSearch.toLowerCase())
  );

  return (
    <div id="fare-finder-section" className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-8 max-w-4xl mx-auto my-6">
      
      {/* Title */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-rail-blue/10 rounded-lg text-rail-blue">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-rail-blue tracking-tight">
            Cheapest Fare Finder & Ticket Splitter
          </h2>
          <p className="text-sm text-slate-500 font-sans">
            Instantly compare standard bookings against smart split fares for guaranteed UK discounts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
        
        {/* Origin dropdown / autocomplete */}
        <div className="md:col-span-5 relative">
          <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
            Departing From
          </label>
          <div className="relative">
            <input
              type="text"
              value={originSearch}
              onChange={(e) => {
                setOriginSearch(e.target.value);
                setShowOriginDropdown(true);
              }}
              onFocus={() => setShowOriginDropdown(true)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rail-blue focus:bg-white outline-none transition-all"
              placeholder="Start typing station..."
            />
            {currentOrigin && (
              <span className="absolute right-3 top-3 px-2 py-0.5 bg-slate-200 text-[11px] font-mono rounded font-bold text-slate-600">
                {currentOrigin.code}
              </span>
            )}
          </div>
          
          {/* Autocomplete suggestions */}
          {showOriginDropdown && (
            <div className="absolute z-30 w-full bg-white mt-1 border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
              <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-rose-100">
                British Rail Stations
              </div>
              {originSuggestions.map(station => (
                <button
                  key={station.code}
                  onClick={() => {
                    setOrigin(station.code);
                    setOriginSearch(station.name);
                    setShowOriginDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 text-slate-700 flex justify-between items-center transition"
                >
                  <span>{station.name}</span>
                  <span className="font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{station.code}</span>
                </button>
              ))}
              {originSuggestions.length === 0 && (
                <div className="p-3 text-xs text-slate-400 text-center">No stations match query</div>
              )}
            </div>
          )}
        </div>

        {/* Swap button */}
        <div className="md:col-span-1 flex justify-center pb-1">
          <button
            onClick={handleSwap}
            type="button"
            className="p-3 hover:bg-slate-100 rounded-full border border-slate-200 text-rail-blue transition shadow-sm active:scale-95"
            title="Swap stations"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination dropdown */}
        <div className="md:col-span-6 relative">
          <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
            Destination Station
          </label>
          <div className="relative">
            <input
              type="text"
              value={destSearch}
              onChange={(e) => {
                setDestSearch(e.target.value);
                setShowDestDropdown(true);
              }}
              onFocus={() => setShowDestDropdown(true)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rail-blue focus:bg-white outline-none transition-all"
              placeholder="Search destination..."
            />
            {currentDest && (
              <span className="absolute right-3 top-3 px-2 py-0.5 bg-slate-200 text-[11px] font-mono rounded font-bold text-slate-600">
                {currentDest.code}
              </span>
            )}
          </div>

          {/* Autocomplete suggestions */}
          {showDestDropdown && (
            <div className="absolute z-20 w-full bg-white mt-1 border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
              <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-rose-100">
                British Rail Stations
              </div>
              {destSuggestions.map(station => (
                <button
                  key={station.code}
                  onClick={() => {
                    setDestination(station.code);
                    setDestSearch(station.name);
                    setShowDestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 text-slate-700 flex justify-between items-center transition"
                >
                  <span>{station.name}</span>
                  <span className="font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{station.code}</span>
                </button>
              ))}
              {destSuggestions.length === 0 && (
                <div className="p-3 text-xs text-slate-400 text-center">No stations match query</div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Date, Time, Railcard row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
            Travel Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-rail-blue outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
            Time Preference
          </label>
          <input
            type="time"
            value={travelTime}
            onChange={(e) => setTravelTime(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-rail-blue outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
            Railcard (Saves 34%)
          </label>
          <select
            value={railcard}
            onChange={(e) => setRailcard(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-rail-blue outline-none text-slate-700"
          >
            <option value="none">No Railcard (Full Fare)</option>
            <option value="16-25">16-25 Railcard</option>
            <option value="26-30">26-30 Railcard</option>
            <option value="two-together">Two Together Railcard</option>
            <option value="senior">Senior Railcard</option>
            <option value="disabled">Disabled Persons Railcard</option>
          </select>
        </div>
      </div>

      {/* Calculate Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleCalculate}
          className="flex-1 bg-rail-blue text-white hover:bg-opacity-95 rounded-xl font-sans font-semibold text-sm py-3 px-5 shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-rail-blue flex items-center justify-center space-x-2 cursor-pointer"
        >
          {calculating ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Analyze Splitting & Fares</span>
            </>
          )}
        </button>
      </div>

      {/* Close autocompletes on background click */}
      {(showOriginDropdown || showDestDropdown) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            setShowOriginDropdown(false);
            setShowDestDropdown(false);
          }}
        />
      )}

      {/* Results Panel */}
      <AnimatePresence mode="wait">
        {fareResult && !calculating && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-8 border-t border-slate-150 pt-6"
          >
            {/* Split Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              
              {/* Card 1: Standard Fare */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 text-[9px] font-mono px-2 py-0.5 rounded-bl">
                  DIRECT ROUTE
                </div>
                <div>
                  <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">Standard Single Fare</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Purchased as a single ticket across the entire network journey.</p>
                </div>
                
                <div className="my-5">
                  <span className="text-3xl font-display font-bold text-slate-800">
                    £{fareResult.standardPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono ml-1">one-way</span>
                </div>

                <div className="text-xs text-slate-500 bg-white/60 p-2.5 rounded-lg border border-slate-100 flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                  <span>1 separate booking required.</span>
                </div>
              </div>

              {/* Card 2: Split Fare (Saves Money) */}
              <div className="bg-emerald-50/50 rounded-xl border border-emerald-200/80 p-5 flex flex-col justify-between relative overflow-hidden ring-2 ring-emerald-500/20">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-mono font-bold px-3 py-0.5 rounded-bl flex items-center space-x-1">
                  <Flame className="w-3 h-3 text-amber-200" />
                  <span>SAVE {fareResult.savingsPercent}%</span>
                </div>
                
                <div>
                  <h4 className="text-xs font-mono text-emerald-800 uppercase tracking-widest font-bold flex items-center space-x-1">
                    <span>Smart Splitting Ticket</span>
                  </h4>
                  <p className="text-xs text-emerald-700/80 mt-0.5">Splitting fares at intermediate platforms. No train transfers necessary!</p>
                </div>

                <div className="my-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-display font-bold text-emerald-700">
                    £{fareResult.splitPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-emerald-600/70 font-mono">one-way</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold ml-auto font-mono">
                    Save £{(fareResult.standardPrice - fareResult.splitPrice).toFixed(2)}!
                  </span>
                </div>

                <div className="text-xs text-emerald-800 bg-white/95 p-3 rounded-lg border border-emerald-100 flex flex-col space-y-1">
                  <div className="font-semibold text-emerald-900 border-b border-slate-100 pb-1 mb-1 flex justify-between">
                    <span>Split Leg details:</span>
                    <span className="text-[10px] text-emerald-600">Travel same train!</span>
                  </div>
                  {fareResult.splitSegments.map((seg, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] text-slate-600 font-mono">
                      <span>{seg.from} ➔ {seg.to}</span>
                      <span className="font-semibold text-slate-800">£{seg.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Retro Orange Cardboard Train Ticket Design Mockup */}
            <div className="mt-8">
              <div className="text-center mb-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center justify-center space-x-1">
                  <span>Your Souvenir Boarding Voucher</span>
                </span>
              </div>

              {/* Classic UK Cardboard Train Ticket Render */}
              <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-4 font-mono text-amber-900 shadow-sm relative overflow-hidden">
                
                {/* Magnetic Stripe representation on top */}
                <div className="absolute top-0 left-0 w-full h-3 bg-neutral-800" />
                
                {/* Ticket Body details */}
                <div className="pt-3">
                  
                  {/* Top line header */}
                  <div className="flex justify-between items-center text-[10px] font-bold border-b border-amber-300/60 pb-1 mb-2">
                    <span>M* National Rail</span>
                    <span>CLASS: STANDARD</span>
                    <span>TICKET No: BR-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>

                  {/* Journey routing */}
                  <div className="grid grid-cols-2 gap-2 my-2.5">
                    <div>
                      <span className="text-[9px] text-amber-800 block">FROM: (ORIGIN)</span>
                      <span className="text-sm font-bold tracking-tight uppercase">{fareResult.origin.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-amber-800 block">TO: (DESTINATION)</span>
                      <span className="text-sm font-bold tracking-tight uppercase">{fareResult.destination.name}</span>
                    </div>
                  </div>

                  {/* Route conditions */}
                  <div className="grid grid-cols-3 gap-1 my-2 bg-amber-50/60 p-2 rounded border border-amber-300/30 text-[10px]">
                    <div>
                      <span className="text-[8px] text-amber-800 block uppercase">Validity</span>
                      <span className="font-semibold">ON DATE SHOWN</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-amber-800 block uppercase font-mono">Travel Date</span>
                      <span className="font-semibold">{fareResult.date}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-amber-800 block uppercase font-mono">Departure</span>
                      <span className="font-semibold">~ {fareResult.time}</span>
                    </div>
                  </div>

                  {/* Bottom Ticket footer */}
                  <div className="flex justify-between items-end mt-3 pt-1 border-t border-amber-300/60 text-[9px]">
                    <div className="flex items-center space-x-2">
                      <div className="text-[12px] font-bold uppercase tracking-wider text-rose-600 font-sans border border-rose-400 px-1 rounded-sm rotate-[-2deg]">
                        SPLIT SAVER
                      </div>
                      <span className="text-[8px] text-amber-700/80">Railcard: {fareResult.railcard !== 'none' ? fareResult.railcard.toUpperCase() : 'NONE'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-amber-800 uppercase block font-mono">Combined Price</span>
                      <span className="text-sm font-bold">£{fareResult.splitPrice.toFixed(2)}</span>
                    </div>
                  </div>

                </div>

                {/* Vertical subtle punch card cutout icon right edge */}
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-white border border-slate-300 rounded-full" />
                <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-white border border-slate-300 rounded-full" />
              </div>
            </div>

            {/* Booking Portal Action link */}
            <div className="mt-6 flex justify-center">
              <a
                href={`https://www.thetrainline.com/book/results?origin=${fareResult.origin.code}&destination=${fareResult.destination.code}&outwardDate=${fareResult.date}T${fareResult.time}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-rail-red text-white hover:bg-opacity-95 font-sans font-bold text-sm py-2.5 px-6 rounded-xl transition duration-150 shadow-md transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Navigate to Secure Booking on Trainline</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
