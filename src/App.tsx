import { useState } from 'react';
import { Page, Station } from './types';
import Header from './components/Header';
import FareFinder from './components/FareFinder';
import DoubleArrowGeometry from './components/DoubleArrowGeometry';
import RailAlphabetTypewriter from './components/RailAlphabetTypewriter';
import AdvanceTracker from './components/AdvanceTracker';
import InteractiveTimeline from './components/InteractiveTimeline';
import DidYouKnow from './components/DidYouKnow';
import ClairePanel from './components/ClairePanel';
// @ts-expect-error - image asset
import ticketImg from './assets/images/ticket.png';
// @ts-expect-error - image asset
import heroImg from './assets/images/british_rail_history_hero_1780041941158.png';
import { 
  Train, ArrowRight, ArrowUpDown, Calendar, HelpCircle, ShieldCheck, 
  Clock, Info, Layout, Sliders, Type, Landmark, ExternalLink, Sparkles 
} from 'lucide-react';
import { TIMELINE_EVENTS, DESIGN_ELEMENTS } from './data/railData';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentTab, setTab] = useState<Page>('home');

  // Precision custom inline SVG representing the double arrow logo
  const doubleArrowLogo = (
    <svg viewBox="0 0 100 60" className="w-12 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="square">
      <path d="M 40 12 L 15 12 L 35 27 L 85 27" />
      <path d="M 60 48 L 85 48 L 65 33 L 15 33" />
      <path d="M 35 27 L 15 12 M 65 33 L 85 48" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
      
      {/* Global Brand Header with custom Double Arrow logo */}
      <Header currentTab={currentTab} setTab={setTab} />

      {/* Main Single Page Tab Router with Motion Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* ==================== 1. HOME & FARE FINDER TAB ==================== */}
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Home Hero Split - Preserves Legacy Index Layout */}
              <section id="hero-home" className="relative bg-[#002F6C] text-white py-16 lg:py-24 overflow-hidden">
                {/* Visual grid backdrop lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center max-lg:items-center max-lg:text-center">
                    
                    {/* Left text column */}
                    <div className="max-lg:contents lg:col-span-7 lg:space-y-4">
                      
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-tight max-lg:order-2 max-lg:max-w-xl">
                        Travel Smarter on <span className="text-[#a8081b]">UK Rail</span>
                      </h1>
                      
                      <p className="text-lg text-slate-200 font-normal leading-relaxed max-w-2xl max-lg:order-3">
                        Looking for cheap fares, mastering split-ticketing, and exploring the glorious design history of British railways? Welcome to your independent modern guide.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 pt-1 max-lg:order-5 max-lg:w-full max-lg:justify-center">
                        <a 
                          href="#fare-finder-section"
                          className="px-6 py-3 bg-[#a8081b] hover:bg-opacity-95 text-white rounded-xl font-bold text-center text-sm shadow-md transition-all cursor-pointer"
                        >
                          Find Cheapest Fares Now
                        </a>
                        <button 
                          onClick={() => setTab('guide')}
                          className="px-6 py-3 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-100 rounded-xl font-bold text-center text-sm transition-all"
                        >
                          Smart Split-Ticket Tips
                        </button>
                      </div>
                    </div>

                    {/* Right Interactive Ticket graphic - Authentic image asset from original site, cleaned up */}
                    <div className="lg:col-span-5 flex justify-center max-lg:order-4 max-lg:w-full">
                      <div className="relative transform hover:rotate-1 hover:scale-105 transition-all duration-300 max-w-sm w-full group">
                        
                        <div className="relative overflow-hidden rounded-xl shadow-2xl shadow-black/50 bg-white">
                          <img 
                            src={ticketImg} 
                            alt="Prinstine clean-edged vintage British Rail ticket asset" 
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03] bg-white"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* CHEAPEST FARE FINDER REACT INTERACTIVE MODULE */}
              <section className="py-12 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <FareFinder />
                </div>
              </section>

              {/* STEP CARDS - How it Works section */}
              <section className="py-12 bg-white border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-rail-blue tracking-tight">
                      How to Secure the Cheapest Fares
                    </h2>
                    <p className="text-sm text-slate-500 font-sans mt-2">
                      Slicing ticket pricing on the UK National Rail network is simple when using split-tickets. Follow these guidelines:
                    </p>
                  </div>

                  {/* 12-column layout carrying steps and Claire's panel side-by-side */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8">
                    
                    {/* Left Column: 4 Step Cards */}
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-5 hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-mono font-black text-[#a8081b] bg-red-100/80 px-2 py-1 rounded">01</span>
                          <h4 className="font-display font-bold text-slate-800 text-sm mt-4">Destination Search</h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                            Enter your starting and target stations. Autocomplete will filter actual UK transit stations instantly.
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-5 hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-mono font-black text-[#a8081b] bg-red-100/80 px-2 py-1 rounded">02</span>
                          <h4 className="font-display font-bold text-slate-800 text-sm mt-4">Splitting Algorithmic Points</h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                            The ticket model calculates splitting stations (e.g. York). Keep seat reservations on the same carriages!
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-5 hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-mono font-black text-[#a8081b] bg-red-100/80 px-2 py-1 rounded">03</span>
                          <h4 className="font-display font-bold text-slate-800 text-sm mt-4">Enforce Railcard Codes</h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                            Applying digital Railcards (Two Together, Student 16-25, Senior) auto-slashes another 34% off the price.
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-5 hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-mono font-black text-[#a8081b] bg-red-100/80 px-2 py-1 rounded">04</span>
                          <h4 className="font-display font-bold text-slate-800 text-sm mt-4">Secure Real Purchase</h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                            Clicking booking routes you to official, secure Trainline windows containing your parameters.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Claire Panel */}
                    <div className="lg:col-span-4">
                      <ClairePanel compact={true} />
                    </div>

                  </div>
                </div>
              </section>

              {/* ADVERTISEMENT PLACEHOLDER (Clean, Non-obtrusive) */}
              <div className="max-w-4xl mx-auto my-6 px-4">
                <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-center relative">
                  <div className="text-[9px] font-mono text-slate-400 absolute top-2 left-1/2 transform -translate-x-1/2 uppercase tracking-widest">
                    Advertisement
                  </div>
                  <div className="text-xs font-medium text-slate-500 pt-3">
                    Looking for accommodations? Plan hotel stays simultaneously to save more bundle travel values.
                  </div>
                </div>
              </div>

              {/* THREE COLUMN INFO GRID */}
              <section className="py-12 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="text-xl mb-3">🏛️</div>
                        <h4 className="font-display font-bold text-slate-800">Historic Graphic Legacy</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          Discover Gerry Barney's mathematical grid logo design and Jock Kinneir's legendary Rail Alphabet typesetting rules.
                        </p>
                      </div>
                      <button 
                        onClick={() => setTab('history')}
                        className="text-xs font-bold text-[#a8081b] hover:text-rail-blue transition mt-5 flex items-center space-x-1 cursor-pointer"
                      >
                        Explore Design Archives ➔
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="text-xl mb-3">🎫</div>
                        <h4 className="font-display font-bold text-slate-800">Split Ticket Mastery</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          Learn how breaking up rail trips into sequential segments keeps you in the same train and cuts off 40%+ costs.
                        </p>
                      </div>
                      <button 
                        onClick={() => setTab('guide')}
                        className="text-xs font-bold text-[#a8081b] hover:text-rail-blue transition mt-5 flex items-center space-x-1 cursor-pointer"
                      >
                        Read Travel Strategies ➔
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="text-xl mb-3">📅</div>
                        <h4 className="font-display font-bold text-slate-800">The 12-Week Release Slate</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          Train companies release their cheapest advance inventory 12 weeks ahead. Track release dates using our reminder tools.
                        </p>
                      </div>
                      <button 
                        onClick={() => setTab('guide')}
                        className="text-xs font-bold text-[#a8081b] hover:text-rail-blue transition mt-5 flex items-center space-x-1 cursor-pointer"
                      >
                        Release Calendar Tools ➔
                      </button>
                    </div>

                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {/* ==================== 2. HISTORY & DESIGN TAB ==================== */}
          {currentTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* History Hero Split - EXACTLY preserves index hero split styling as requested */}
              <section id="hero-history" className="relative bg-[#002F6C] text-white py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left text column */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      <h1 className="text-3xl sm:text-5xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                        The Design Legacy of <span className="text-[#a8081b]">British Rail</span>
                      </h1>
                      
                      <p className="text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
                        Explore how a bold 1960s identity project transformed Britain's public railway system into an enduring icon of graphic design history.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <a 
                          href="#exhibit"
                          className="px-6 py-3 bg-[#a8081b] hover:bg-opacity-95 text-white rounded-xl font-bold text-center text-sm shadow-md transition-all cursor-pointer"
                        >
                          Explore Interactive Exhibit
                        </a>
                        <button 
                          onClick={() => setTab('home')}
                          className="px-6 py-3 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-100 rounded-xl font-bold text-center text-sm transition-all"
                        >
                          Back to Travel Portal
                        </button>
                      </div>
                    </div>

                    {/* Right Image column - Drops in appropriate, attractive Hero image generated */}
                    <div className="lg:col-span-5 flex justify-center">
                      <div className="relative rounded-2xl overflow-hidden border-4 border-white/15 shadow-2xl shadow-slate-950/50 aspect-[16/9] w-full max-w-md">
                        <img 
                          src={heroImg} 
                          alt="Iconic InterCity 125 train in its classic yellow and blue modernization era livery traveling through the British countryside" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Elegant vintage caption banner */}
                        <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 px-4 py-2 text-[11px] font-mono text-slate-300 flex justify-between border-t border-slate-800">
                          <span>INTERCITY 125 HST SPEED TUNING</span>
                          <span>EST. 1976</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* CORPORATE DESIGN IDENTITY ELEMENTS GRID - From legacy history page */}
              <section id="exhibit" className="py-12 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-rail-blue tracking-tight">
                      Icons of Corporate Identity (1965)
                    </h2>
                    <p className="text-sm text-slate-500 font-sans mt-2">
                      Designed to unify thousand of platforms and locomotives under a singular public service graphic standard:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {DESIGN_ELEMENTS.map((elem) => (
                      <div key={elem.id} className="bg-slate-50 rounded-xl border border-slate-200/50 p-5 flex flex-col justify-between hover:shadow-md transition">
                        <div>
                          <div className="flex justify-between items-baseline border-b border-slate-200 pb-2 mb-3">
                            <span className="text-xs font-mono font-bold text-slate-400">ELEMENT {elem.number}</span>
                            <span className="text-xs font-bold text-[#a8081b]">ACTIVE ERA</span>
                          </div>
                          <h4 className="font-display font-bold text-slate-800 text-sm mt-1">{elem.title}</h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{elem.description}</p>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-4 italic font-sans font-medium">Design Research Unit archive</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* MODULE 1: INTERACTIVE TIMELINE */}
              <section className="py-12 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <InteractiveTimeline />
                </div>
              </section>

              {/* MODULE 2: INTERACTIVE GERRY BARNEY MATHEMATICAL GEOMETRY DESIGN SLIDERS */}
              <section className="py-12 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <DoubleArrowGeometry />
                </div>
              </section>

              {/* MODULE 3: INTERACTIVE RAIL ALPHABET TYPOGRAPHY SIGN GENERATOR */}
              <section className="py-12 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <RailAlphabetTypewriter />
                </div>
              </section>

              {/* MODULE 4: DID YOU KNOW SECTION */}
              <section className="py-12 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <DidYouKnow />
                </div>
              </section>

            </motion.div>
          )}

          {/* ==================== 3. SMART TRAVEL GUIDE TAB ==================== */}
          {currentTab === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Travel Guide Hero Split - EXACTLY preserves index hero split styling as requested */}
              <section id="hero-guide" className="relative bg-[#002F6C] text-white py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left text column */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="inline-flex items-center space-x-2 bg-rose-950/40 border border-[#a8081b]/50 px-3 py-1 rounded-full text-xs text-red-200">
                        <Clock className="w-3.5 h-3.5 text-[#a8081b]" />
                        <span className="font-mono tracking-wide">Advance Fare Hacks</span>
                      </div>
                      
                      <h1 className="text-4xl sm:text-5xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                        Smart Travel Guide & <span className="text-[#a8081b]">Fare Secrets</span>
                      </h1>
                      
                      <p className="text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
                        Are you systematically overpaying for normal train tickets in the UK? Learn core strategies to book advance windows and maximize discounts.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <a 
                          href="https://www.thetrainline.com/trains/great-britain/split-tickets"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-[#a8081b] hover:bg-opacity-95 text-white rounded-xl font-bold text-center text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <span>Check Fares Live ↗</span>
                        </a>
                        <a 
                          href="#strategies-guide"
                          className="px-6 py-3 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-100 rounded-xl font-bold text-center text-sm transition-all text-center"
                        >
                          Read Core Strategies
                        </a>
                      </div>
                    </div>

                    {/* Right Dynamic visual column */}
                    <div className="lg:col-span-5 flex justify-center">
                      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full shadow-xl relative overflow-hidden text-slate-300">
                        <div className="flex items-center space-x-2 text-rose-500 mb-3 border-b border-slate-800 pb-2">
                          <ShieldCheck className="w-5 h-5" />
                          <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-200">GUARANTEED FARE REDUCTIONS</span>
                        </div>
                        <ul className="space-y-3.5 text-xs">
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                            <span><strong>Split ticketing:</strong> Legally divides journeys, saving ~43% without swapping carriages.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                            <span><strong>12-Week Release:</strong> Grab Tier 1 prices the moment they release on the matrix.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                            <span><strong>Off-Peak windows:</strong> Avoid Mon-Fri peak hours (06:30-09:30 & 15:30-18:30).</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* DYNAMIC 12-WEEK BOOKING WINDOW TRACKER REMINDER CALCULATOR */}
              <section className="py-12 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <AdvanceTracker />
                </div>
              </section>

              {/* DETAILED TRAVEL HACKS AND FARES SECTION */}
              <section id="strategies-guide" className="py-12 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-rail-blue tracking-tight">
                      UK National Rail Booking Cheatsheet
                    </h2>
                    <p className="text-sm text-slate-500 font-sans mt-2">
                      Master these four proven techniques to save hundreds of pounds in yearly travel.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto items-stretch">
                    
                    {/* Left Column: Tactics Grid */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative flex flex-col justify-between">
                        <div>
                          <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
                            TACTIC A
                          </div>
                          <h4 className="font-display font-bold text-slate-950 text-base mb-2">Mastering Split-Ticketing</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            Under UK National Rail conditions of carriage, split tickets are completely valid provided the train physically halts at every platform that names your split station. For example, if you are traveling on an LNER HST from London King's Cross to Edinburgh Waverley, buying 'London to York' + 'York to Edinburgh Waverley' tickets is legally valid as long as that specific train makes a scheduled stop at York station, even if you never stand up or change seats!
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative flex flex-col justify-between">
                        <div>
                          <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
                            TACTIC B
                          </div>
                          <h4 className="font-display font-bold text-slate-950 text-base mb-2">The Two Together Trick</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            If you travel with a spouse, sibling, or general peer, the <strong className="highlight-text">Two Together Railcard</strong> costs just £30 and is valid for a whole year. It instantly slices 34% off your total checkout standard prices on all joint travel after 09:30 AM weekdays, paying for itself on just one medium-range trip (such as London to York return).
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative flex flex-col justify-between">
                        <div>
                          <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
                            TACTIC C
                          </div>
                          <h4 className="font-display font-bold text-slate-950 text-base mb-2">Advance Tickets Block Releases</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            Unlike airline ticket price algorithms that move dynamically according to rapid user cookies and browsing queries, train ticket prices are distributed in strict static "Tariff Tiers". Tier 1 remains flat until all assigned inventory on that train has been depleted. Securing bookings at exactly the 12-week release window guarantees you standard tickets at the rock-bottom rate.
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative flex flex-col justify-between">
                        <div>
                          <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
                            TACTIC D
                          </div>
                          <h4 className="font-display font-bold text-slate-950 text-base mb-2">The Off-Peak & Super Off-Peak Windows</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            Peak commuter slots are heavily taxed. Adjusting your travel and booking only "Off-Peak" or "Super Off-Peak" classes bypasses these premium toll fees entirely. These slots usually start after 09:30 AM in towns/cities, and all day during weekends/public holidays.
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Claire Panel */}
                    <div className="lg:col-span-4">
                      <ClairePanel compact={true} />
                    </div>

                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="py-12 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8">
                    <h3 className="font-display font-bold text-xl text-rail-blue tracking-tight">Frequently Answered Fares FAQ</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <h5 className="font-bold text-xs font-sans text-slate-800">Do I have to change seats or get off when using Split Tickets?</h5>
                      <p className="text-xs text-slate-600 mt-2">No! As long as you remain on the exact same train specified by your segments, you just stay on your reserved seat. Your boarding tickets will simply segment covering the whole line length.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <h5 className="font-bold text-xs font-sans text-slate-800">What happens if a connecting train is delayed and I miss my connection?</h5>
                      <p className="text-xs text-slate-600 mt-2">Even if you use split tickets, the National Rail Conditions of Travel protect your complete journey. You are permitted to board the next available scheduled train service for no additional charge.</p>
                    </div>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Symmetrical Brand Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            <div>
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <div className="w-8 h-5 text-rail-red flex-shrink-0">
                  <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="square">
                    <path d="M 40 12 L 15 12 L 35 27 L 85 27" />
                    <path d="M 60 48 L 85 48 L 65 33 L 15 33" />
                    <path d="M 35 27 L 15 12 M 65 33 L 85 48" />
                  </svg>
                </div>
                <span className="font-display font-extrabold text-[#a8081b] uppercase tracking-wider text-sm">
                  BRITISH RAIL DESIGN ARCHIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 max-w-md">
                An independent historical archive and travel resource portal. Not affiliated with National Rail, Great British Railways, or the Department for Transport.
              </p>
            </div>

            <div className="text-right">
              <p className="text-[11px] font-sans">
                &copy; 1965-2026 BritishRail.co.uk. All rights reserved.
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Contact Webmaster: <span className="font-mono text-slate-400 text-xs">webmaster&#64;britishrail.co.uk</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
