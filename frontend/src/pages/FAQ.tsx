import { useState } from 'react';
import { ChevronDown, Radio } from 'lucide-react';

const FAQS = [
  {
    q: 'Does the recipient need an app to read my keychain?',
    a: 'No, absolutely not! The recipient does not need to download or install any app. iPhone and Android phones natively read the NFC chip in the background and pop up a notification banner instantly.',
  },
  {
    q: 'Does the keychain need to be charged or have a battery?',
    a: 'No batteries required! Smart Choice keychains utilize passive NFC induction. The chip draws a minute electrical pulse directly from the smartphone’s NFC antenna when tapped.',
  },
  {
    q: 'Can I change the link on my keychain in the future?',
    a: 'Yes! The embedded NTAG215 chip is rewritable. You can reprogram your keychain at any time using free mobile apps like "NFC Tools" (available on both the iOS App Store and Google Play Store).',
  },
  {
    q: 'Are Smart Choice keychains waterproof and durable?',
    a: 'Yes. The chip is hermetically encased in high-density 3D PLA structural material. It is fully water-resistant, drop-tested, and built for daily pocket carry with heavy keys.',
  },
  {
    q: 'How long does shipping take across India?',
    a: 'We encode, test, and dispatch orders within 24-48 business hours. Delivery takes approximately 2 to 4 business days to major metros and 3 to 6 days to rest of India.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day replacement guarantee on any manufacturing or chip defect. If your chip ever fails to read, we replace it free of charge.',
  },
];

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white text-brand-navy py-12 md:py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">Knowledge Base</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Everything you need to know about Smart Choice NFC technology and order fulfillment.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 rounded-2xl overflow-hidden transition-all bg-white"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-brand-navy hover:text-brand-teal transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 transition-transform ${
                    openIdx === idx ? 'rotate-180 text-brand-teal' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FAQ;
