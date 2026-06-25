import { useState, useEffect } from 'react';
import { Calendar, Bell, ShieldAlert, BadgeInfo, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

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
    const details = encodeURIComponent('Your 12-week advance window has opened! Navigate to BritishRail.co.uk to find cheap split train tickets and secure up to 60% savings on standard UK rail fares.');
    const location = encodeURIComponent('BritishRail.co.uk portal');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${eventTimeStart}/${eventTimeEnd}&details=${details}&location=${location}&sf=true&output=xml`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-8 max-w-xl mx-auto">
      
      {/* Header */}
      <div className="flex items-start space-x-3 mb-6">
        <div className="p-2.5 bg-rail-red/10 text-rail-red rounded-lg">
          <Calendar className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-rail-blue tracking-tight">
            12-Week Ticket Release Calculator
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Advance tickets go on sale roughly 84 days early. Plan when to buy to lock in the lowest fares.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        
        {/* Date Selector input */}
        <div>
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
