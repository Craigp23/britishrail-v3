import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Cookie, X, ArrowRight } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
  consentTrigger?: number;
  onClose?: () => void;
}

export default function CookieBanner({ onOpenPrivacy, consentTrigger, onClose }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user already made a selection
    const storedConsent = localStorage.getItem('br_cookie_consent');
    if (!storedConsent) {
      // Trigger with a subtle delay for optimal UX on first load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [consentTrigger]);

  const handleAcceptAll = () => {
    localStorage.setItem('br_cookie_consent', 'accepted');
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleDeclineAll = () => {
    localStorage.setItem('br_cookie_consent', 'declined');
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-white border border-slate-200/90 shadow-2xl rounded-2xl overflow-hidden p-5 flex flex-col space-y-4"
        >
          {/* Accent flag */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#012169]" />

          {/* Icon & Title */}
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-[#012169]/10 text-rail-blue rounded-xl shrink-0 mt-0.5">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Cookie Consent (UK & EEA)
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed mt-1.5">
                We use essential cookies to power split-ticket searches. With your permission, we and Google also use cookies to serve personalized ads based on your interests. Learn more in our{' '}
                <button
                  onClick={onOpenPrivacy}
                  className="text-rail-blue font-semibold underline hover:text-opacity-80 transition cursor-pointer inline-block"
                >
                  Privacy & Cookies Policy
                </button>
                .
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={handleDeclineAll}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition duration-150 active:scale-98 cursor-pointer text-center"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-[#012169] hover:bg-opacity-95 text-white rounded-xl font-bold text-xs shadow-sm transition duration-150 active:scale-98 cursor-pointer text-center"
            >
              <span>Accept Cookies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
