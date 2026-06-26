import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Info } from 'lucide-react';

interface LegalModalsProps {
  activeModal: 'about' | 'privacy' | null;
  onClose: () => void;
}

export default function LegalModals({ activeModal, onClose }: LegalModalsProps) {
  const [copied, setCopied] = React.useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = String.fromCharCode(50, 51, 104, 101, 97, 108, 105, 110, 103);
    const domain = String.fromCharCode(103, 109, 97, 105, 108, 46, 99, 111, 109);
    const email = `${user}@${domain}`;
    
    // Copy to clipboard for robust fallback
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});

    // Try opening mail client
    window.location.href = `mailto:${email}?subject=Enquiry%20via%20britishrail.co.uk`;
  };

  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[85vh] z-10"
          >
            {/* Symmetrical Heritage Accent Bar */}
            <div className="h-[6px] flex w-full shrink-0">
              <div className="bg-[#012169] flex-1 h-full" /> {/* Rail Blue */}
              <div className="bg-[#e5001c] flex-1 h-full" /> {/* Rail Red */}
              <div className="bg-[#005566] flex-1 h-full" /> {/* Heritage Teal */}
            </div>

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center space-x-2.5">
                {activeModal === 'about' ? (
                  <>
                    <Info className="w-5 h-5 text-rail-blue shrink-0" />
                    <h2 className="font-display font-extrabold text-slate-900 text-base tracking-wide uppercase">
                      About & Contact
                    </h2>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-rail-blue shrink-0" />
                    <h2 className="font-display font-extrabold text-slate-900 text-base tracking-wide uppercase">
                      Privacy & Cookies Policy
                    </h2>
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 overflow-y-auto font-sans text-sm text-slate-600 leading-relaxed space-y-5 select-text">
              {activeModal === 'about' ? (
                <>
                  {/* ABOUT PANEL */}
                  <div>
                    <p>
                      Welcome to <strong>britishrail.co.uk</strong>, an independent site celebrating the design heritage of British Railways (1948–1997), providing useful resources for rail enthusiasts, historians, modellers, and modern split-ticketing tools to maximise savings for contemporary travellers.
                    </p>
                    <p className="mt-2.5">
                      This site is intended as a tribute to the legendary corporate identity guidelines crafted by the Design Research Unit (DRU) in the mid 1960s; in particular Gerry Barney's iconic <strong>Double Arrow logo</strong> and Margaret Calvert & Jock Kinneir's <strong>Rail Alphabet</strong> typography - both modern classics.
                    </p>
                  </div>

                  <div>
                    <p className="mt-2.5">
                      We believe in affordable train travel for all - sustainable and accessible. By analysing rail routes, split points, and ticket structures on-the-fly, our <strong>Intelligent Fare Search</strong> helps split expensive through-fares into cheaper sequential journeys, saving travellers up to 43% on long-distance fares without changing trains.
                    </p>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-display font-bold text-slate-800 text-sm mb-2 uppercase tracking-wide">
                      Contact Us
                    </h3>
                    <p>
                      Have historical photos, travel stories, corrections, design feedback, or a collaboration enquiry? We would love to hear from you, and respond to all genuine queries.{' '}
                      Please feel free to{' '}
                      <button
                        onClick={handleContactClick}
                        className="text-rail-blue font-bold underline decoration-dotted underline-offset-2 hover:text-opacity-80 transition cursor-pointer inline-flex items-center"
                      >
                        {copied ? 'Contact Us (address copied to clipboard)' : 'Contact Us'}
                      </button>
                      .
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-4 border-t border-slate-100 italic">
                    Disclaimer: This site is a design heritage and travel information portal. The site is not affiliated with, endorsed by, or connected with National Rail, Network Rail, the Department for Transport, or any train operating company. All tickets, logos, trademarks, and design parameters remain the property of their respective owners.
                  </div>
                </>
              ) : (
                <>
                  {/* PRIVACY & COOKIES POLICY PANEL */}
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm mb-2 uppercase tracking-wide">
                      1. General Privacy Standards
                    </h3>
                    <p>
                      At <strong>britishrail.co.uk</strong>, protecting your personal data is a primary commitment. This policy outlines how we handle information in compliance with the UK General Data Protection Regulation (UK GDPR) and the UK Data Protection Act 2018.
                    </p>
                    <p className="mt-2">
                      When utilising our Intelligent Fare Search, your search origin, destination, date & time of travel, and railcard type are processed in real-time. We <strong>do not store, save, or share</strong> your travel inputs, search histories, or journey routes on our servers.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm mb-2 uppercase tracking-wide">
                      2. What are Cookies?
                    </h3>
                    <p>
                      Cookies are small text files placed on your device to ensure optimal performance, remember interface preferences, and support monetisation models. Non-essential cookies can easily be controlled or blocked via your web browser settings.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm mb-2 uppercase tracking-wide">
                      3. Cookie Types & Purposes
                    </h3>
                    <div className="space-y-3 mt-2">
                      <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg">
                        <div className="font-semibold text-xs text-slate-800 uppercase tracking-wide">A. Essential Cookies (Strictly Necessary)</div>
                        <div className="text-xs text-slate-500 mt-1">
                          Required for essential site operations, such as remembering your cookies consent preferences and split-ticketing form input. These do not track personal behaviour.
                        </div>
                      </div>
                      
                      <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg">
                        <div className="font-semibold text-xs text-slate-800 uppercase tracking-wide">B. Advertisement Cookies (Google AdSense)</div>
                        <div className="text-xs text-slate-500 mt-1 font-sans">
                          This site uses Google AdSense to serve advertisements. Google uses cookies to serve ads based on your previous visits to this site or other sites on the internet. 
                          Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to this site and/or other sites on the Internet.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm mb-2 uppercase tracking-wide">
                      4. Managing Your Ad Choices (Google AdSense)
                    </h3>
                    <p>
                      In compliance with Google's publisher policies and EEA/UK regulations:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-slate-500">
                      <li>Users can opt out of personalised advertising by visiting the <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-rail-blue underline font-semibold hover:text-opacity-80">Google Ads Settings page</a>.</li>
                      <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalised advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-rail-blue underline font-semibold hover:text-opacity-80">aboutads.info</a>.</li>
                      <li>For users inside the UK & EEA, a GDPR-compliant solution is provided. You can withdraw or adjust your consent choices at any time by clicking "Manage Cookies" in the page footer.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm mb-2 uppercase tracking-wide">
                      5. Third-Party Links & Safety
                    </h3>
                    <p>
                      Our search results may contain links to train operators (such as LNER, Avanti West Coast) or ticket booking systems. We do not have control over their cookies, data storage, or policies. Please review their policies individually upon landing.
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 pt-3 border-t border-slate-150">
                    Last Updated: June 25, 2026. For privacy concerns,{' '}
                    <button
                      onClick={handleContactClick}
                      className="text-rail-blue font-semibold underline decoration-dotted underline-offset-2 hover:text-opacity-80 transition cursor-pointer"
                    >
                      {copied ? 'Contact Us (address copied to clipboard)' : 'Contact Us'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs transition cursor-pointer active:scale-98 shadow-sm"
              >
                Close Window
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
