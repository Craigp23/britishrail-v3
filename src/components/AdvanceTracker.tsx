import { useState, useEffect } from 'react';
import { Calendar, Bell, ShieldAlert, BadgeInfo, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

function StationClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // Tick every 50ms for extremely smooth sweeping second hand matching a synchronous AC motor
    const interval = setInterval(() => {
      setTime(new Date());
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const ms = time.getMilliseconds();
  const sec = time.getSeconds();
  const min = time.getMinutes();
  const hr = time.getHours();

  // Smooth continuous angle for the sweep second hand
  const secAngle = (sec * 6) + (ms * 0.006);
  
  // Minute hand moves in half-minute impulses (at 0s and 30s)
  const minStep = sec >= 30 ? 0.5 : 0;
  const minAngle = (min + minStep) * 6;
  
  // Hour hand moves in 5-minute impulses (every 5-minute mark)
  const impulseMinForHr = Math.floor(min / 5) * 5;
  const hrAngle = ((hr % 12) * 30) + (impulseMinForHr * 0.5);

  return (
    <svg 
      viewBox="2900 3650 14000 14000" 
      className="w-full h-full select-none"
      fillRule="evenodd" 
      strokeLinejoin="round"
    >
      {/* OUTER CIRCULAR BOUNDARY BEZEL */}
      <path 
        id="id4" 
        fill="none" 
        stroke="rgb(0,0,0)" 
        strokeWidth="150" 
        strokeLinejoin="miter" 
        d="M 16625,10625 C 16625,11810 16313,12974 15720,14000 15128,15026 14276,15878 13250,16470 12224,17063 11060,17375 9875,17375 8690,17375 7526,17063 6500,16470 5474,15878 4622,15026 4030,14000 3437,12974 3125,11810 3125,10625 3125,9440 3437,8277 4030,7250 4622,6224 5474,5372 6500,4780 7526,4187 8690,3875 9875,3875 11060,3875 12224,4187 13250,4780 14276,5372 15128,6224 15720,7250 16313,8277 16625,9440 16625,10625 Z" 
      />

      {/* DIAL TICKS */}
      <g stroke="#000000" strokeLinecap="butt">
        {/* All individual precise tick lines from your edited SVG */}
        <path id="id5" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 10549,4299 L 10500,4760" />
        <path id="id6" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 11205,4403 L 11109,4856" />
        <path id="id7" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 11847,4575 L 11704,5016" />
        <path id="id8" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 12468,4813 L 12279,5236" />
        <path id="id9" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 13060,5115 L 12266,6490" />
        <path id="id10" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 13617,5477 L 13345,5852" />
        <path id="id11" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 14134,5895 L 13824,6240" />
        <path id="id12" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 14604,6365 L 14259,6675" />
        <path id="id13" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 15022,6882 L 14647,7154" />
        <path id="id14" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 15384,7439 L 14009,8233" />
        <path id="id15" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 15686,8031 L 15263,8220" />
        <path id="id16" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 15924,8652 L 15483,8795" />
        <path id="id17" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 16096,9294 L 15643,9390" />
        <path id="id18" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 16200,9950 L 15739,9999" />
        <path id="id19" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 16234,10614 L 14647,10614" />
        <path id="id20" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 16200,11277 L 15739,11228" />
        <path id="id21" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 16096,11933 L 15643,11837" />
        <path id="id22" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 15924,12575 L 15483,12432" />
        <path id="id23" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 15686,13196 L 15263,13007" />
        <path id="id24" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 15384,13788 L 14009,12994" />
        <path id="id25" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 15022,14345 L 14647,14073" />
        <path id="id26" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 14604,14862 L 14259,14552" />
        <path id="id27" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 14134,15332 L 13824,14987" />
        <path id="id28" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 13617,15750 L 13345,15375" />
        <path id="id29" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 13060,16112 L 12266,14737" />
        <path id="id30" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 12468,16414 L 12279,15991" />
        <path id="id31" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 11847,16652 L 11704,16211" />
        <path id="id32" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 11205,16824 L 11109,16371" />
        <path id="id33" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 10549,16928 L 10500,16467" />
        <path id="id34" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 9886,16962 L 9886,15375" />
        <path id="id35" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 9222,16928 L 9271,16467" />
        <path id="id36" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 8566,16824 L 8662,16371" />
        <path id="id37" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 7924,16652 L 8067,16211" />
        <path id="id38" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 7303,16414 L 7492,15991" />
        <path id="id39" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 6711,16112 L 7505,14737" />
        <path id="id40" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 6154,15750 L 6426,15375" />
        <path id="id41" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 5637,15332 L 5947,14987" />
        <path id="id42" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 5167,14862 L 5512,14552" />
        <path id="id43" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 4749,14345 L 5124,14073" />
        <path id="id44" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 4387,13788 L 5762,12994" />
        <path id="id45" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 4085,13196 L 4508,13007" />
        <path id="id46" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 3847,12575 L 4288,12432" />
        <path id="id47" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 3675,11933 L 4128,11837" />
        <path id="id48" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 3571,11277 L 4032,11228" />
        <path id="id49" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 3537,10614 L 5124,10614" />
        <path id="id50" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 3571,9950 L 4032,9999" />
        <path id="id51" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 3675,9294 L 4128,9390" />
        <path id="id52" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 3847,8652 L 4288,8795" />
        <path id="id53" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 4085,8031 L 4508,8220" />
        <path id="id54" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 4387,7439 L 5762,8233" />
        <path id="id55" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 4749,6882 L 5124,7154" />
        <path id="id56" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 5167,6365 L 5512,6675" />
        <path id="id57" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 5637,5895 L 5947,6240" />
        <path id="id58" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 6154,5477 L 6426,5852" />
        <path id="id59" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 6711,5115 L 7505,6490" />
        <path id="id60" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 7303,4813 L 7492,5236" />
        <path id="id61" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 7924,4575 L 8067,5016" />
        <path id="id62" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 8566,4403 L 8662,4856" />
        <path id="id63" fill="none" stroke="rgb(0,0,0)" strokeWidth="106" strokeLinejoin="miter" d="M 9222,4299 L 9271,4760" />
        <path id="id67" fill="none" stroke="rgb(0,0,0)" strokeWidth="370" strokeLinejoin="miter" d="M 9886,5825 L 9886,4238" />
      </g>

      {/* HOUR HAND (id3) - Rotated dynamically around (9886, 10614) with precise base angle of 307.4 degrees */}
      <g transform={`rotate(${hrAngle - 307.4}, 9886, 10614)`}>
        <path fill="rgb(0,0,0)" stroke="none" d="M 10932,11861 L 11403,11205 6637,7955 6378,8119 6296,8447 9300,10652 10932,11861 Z" />
        <path fill="none" stroke="rgb(0,0,0)" strokeWidth="20" d="M 10932,11861 L 11403,11205 6637,7955 6378,8119 6296,8447 9300,10652 10932,11861 Z" />
      </g>

      {/* MINUTE HAND (id64) - Rotated dynamically around (9886, 10614) with precise base angle of 54.4 degrees */}
      <g transform={`rotate(${minAngle - 54.4}, 9886, 10614)`}>
        <path fill="rgb(0,0,0)" stroke="none" d="M 8382,11218 L 8860,11878 14623,7481 14563,7263 14369,7154 8382,11218 Z" />
        <path fill="none" stroke="rgb(0,0,0)" strokeWidth="20" d="M 8382,11218 L 8860,11878 14623,7481 14563,7263 14369,7154 8382,11218 Z" />
      </g>

      {/* STATIC CENTER PIN (id66) on top */}
      <path fill="rgb(0,0,0)" stroke="none" d="M 10255,10614 C 10255,10678 10239,10742 10206,10798 10174,10854 10126,10902 10070,10934 10014,10967 9950,10983 9886,10983 9821,10983 9757,10967 9701,10934 9645,10902 9597,10854 9565,10798 9532,10742 9516,10678 9516,10614 9516,10549 9533,10485 9565,10429 9598,10373 9645,10325 9701,10293 9757,10260 9821,10244 9886,10244 9950,10244 10014,10260 10070,10293 10126,10325 10173,10373 10206,10429 10238,10485 10255,10549 10255,10614 Z" />

      {/* SWEEP SECOND HAND ASSEMBLY (id68) - Rotated dynamically around (9886, 10614) with precise base angle of 167.6 degrees - Top Layer */}
      <g transform={`rotate(${secAngle - 167.6}, 9886, 10614)`}>
        {/* Second Hand Shaft & Arrow Profile */}
        <path fill="rgb(229,0,28)" stroke="none" d="M 9480,9140 L 9691,9079 11256,16850 11158,16866 9480,9140 Z" />
      </g>
    </svg>
  );
}

export default function AdvanceTracker() {
  const [travelDate, setTravelDate] = useState(() => {
    // default to 14 weeks from now
    const d = new Date();
    d.setDate(d.getDate() + 14 * 7);
    return d.toISOString().split('T')[0];
  });

  const [releaseDate, setReleaseDate] = useState<Date | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [releaseDayStr, setReleaseDayStr] = useState<string>('');

  useEffect(() => {
    if (!travelDate) return;

    const tDate = new Date(travelDate);
    // 12 weeks is exactly 84 days prior
    const rDate = new Date(tDate);
    rDate.setDate(rDate.getDate() - 84);
    setReleaseDate(rDate);

    // format release date
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setReleaseDayStr(rDate.toLocaleDateString('en-GB', options));

    // diff from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    rDate.setHours(0, 0, 0, 0);

    const diffTime = rDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysRemaining(diffDays);

  }, [travelDate]);

  // Generate dynamic Google Calendar reminder link parameters
  const getCalendarLink = () => {
    if (!releaseDate) return '#';
    
    const formattedReleaseDate = releaseDate.toISOString().replace(/-|:|\.\d\d\d/g, '').split('T')[0];
    const eventTimeStart = `${formattedReleaseDate}T090000Z`;
    const eventTimeEnd = `${formattedReleaseDate}T100000Z`;
    
    const title = encodeURIComponent('Book Cheap British Rail Advance Fares!');
    const details = encodeURIComponent('Your 12-week advance window has opened. Navigate to BritishRail.co.uk to find cheap split train tickets and secure up to 60% savings on standard UK rail fares.');
    const location = encodeURIComponent('BritishRail.co.uk portal');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${eventTimeStart}/${eventTimeEnd}&details=${details}&location=${location}&sf=true&output=xml`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-8 max-w-xl mx-auto">
      
      {/* Top Layout Section using clean CSS grid to keep elements aligned and highly responsive on both mobile and desktop */}
      <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_114px] gap-x-5 gap-y-4 items-start mb-6">
        
        {/* Header - Spans across the full width on mobile, resides in left column on desktop */}
        <div className="col-span-2 sm:col-span-1 sm:col-start-1 sm:row-start-1">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-rail-red/10 text-rail-red rounded-lg shrink-0">
              <Calendar className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-rail-blue tracking-tight">
                12-Week Ticket Release Calculator
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5 leading-relaxed">
                Advance tickets go on sale roughly 84 days early. Plan when to buy to lock in the lowest fares.
              </p>
            </div>
          </div>
        </div>

        {/* Date Selector input - Sits on left, on mobile portrait matches the RHS clock */}
        <div className="col-span-1 sm:col-span-1 sm:col-start-1 sm:row-start-2 self-end sm:self-start">
          <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
            Target Travel Date
          </label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-rail-blue outline-none text-slate-800 transition-all cursor-pointer"
          />
        </div>
        
        {/* Authentic British Rail Station Clock - RHS of Date Selector on mobile, RHS of everything on desktop */}
        <div className="col-span-1 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:row-span-2 justify-self-end self-end sm:self-center">
          <div className="w-20 h-20 sm:w-[114px] sm:h-[114px] shrink-0 flex items-center justify-center relative select-none bg-white rounded-full p-1 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
            <StationClock />
          </div>
        </div>
      </div>

      <div className="space-y-5">

        {/* Dynamic release info board */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
          
          <div className="flex justify-between items-baseline border-b border-slate-200/60 pb-2">
            <span className="text-xs text-slate-400 font-mono uppercase font-bold">Booking release Window</span>
            <span className="text-[10px] bg-rail-blue text-white px-2 py-0.5 rounded font-bold font-mono">12 WEEKS EARLY</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Approximate Release Date</span>
            <span className="text-sm font-display font-bold text-slate-850 block mt-0.5">{releaseDayStr}</span>
          </div>

          {/* Countdown Indicator */}
          <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-100">
            <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div>
              {daysRemaining > 0 ? (
                <>
                  <span className="text-xs text-slate-500 font-sans">Tickets release in </span>
                  <span className="text-sm font-mono font-bold text-rail-blue">{daysRemaining} days</span>
                </>
              ) : daysRemaining === 0 ? (
                <span className="text-xs font-bold text-emerald-600">Tickets go on sale TODAY!</span>
              ) : (
                <span className="text-xs text-slate-500">Tickets are already released and active for booking!</span>
              )}
            </div>
          </div>

        </div>

        {/* Call to action & alerts */}
        {daysRemaining > 0 && (
          <div className="pt-2">
            <a
              href={getCalendarLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 bg-rail-blue text-white hover:bg-opacity-95 font-sans font-bold text-xs py-3 rounded-xl transition-all shadow-sm transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>Add Alert To My Google Calendar</span>
            </a>
          </div>
        )}

        {/* Tip checklist */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <div className="flex items-start space-x-2 text-xs text-slate-600">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span><strong>Weekly releases:</strong> Train operators publish advance quotas on weekdays at 09:00 AM. Setting a reminder for this slot gets the absolute lowest price tiers.</span>
          </div>
          <div className="flex items-start space-x-2 text-xs text-slate-600">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span><strong>First Class Upgrades:</strong> During the initial 12-week window, First Class advance prices are sometimes as cheap as standard fares!</span>
          </div>
        </div>

      </div>

    </div>
  );
}
