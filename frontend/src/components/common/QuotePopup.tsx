import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Send, Radio, MapPin, IndianRupee, MessageSquare, User, Phone, CheckCircle2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { enquiriesApi, type EnquiryPayload } from '../../services/api';

interface QuotePopupProps {
  open: boolean;
  onClose: () => void;
}

const BUDGETS = [
  'Under ₹500',
  '₹500 – ₹1,000',
  '₹1,000 – ₹2,500',
  '₹2,500 – ₹5,000',
  '₹5,000+',
  'Not sure yet',
];

/**
 * Official Smart Choice "Get a Free Quote" popup.
 * Perfectly styled to match the main website:
 * Navy brand panel on the left with official logo & 3D keychains constellation.
 * Clean, high-converting form on the right:
 * Name, Phone Number, City, Budget, and optional Message.
 */
export const QuotePopup: React.FC<QuotePopupProps> = ({ open, onClose }) => {
  const [form, setForm] = useState<EnquiryPayload>({
    name: '',
    phone: '',
    city: '',
    budget: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const update = (field: keyof EnquiryPayload) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error('Please enter your name');
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10) return toast.error('Please enter a valid 10-digit mobile number');

    setSubmitting(true);
    try {
      await enquiriesApi.create({
        name: form.name.trim(),
        phone: digits.slice(-10),
        city: form.city?.trim() || undefined,
        budget: form.budget || undefined,
        message: form.message?.trim() || undefined,
      });
      setSent(true);
      toast.success('Inquiry received! We will WhatsApp you shortly.');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || 'Could not send enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSent(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-5 animate-fade-in"
      onClick={handleClose}
    >
      {/* ── Modal Card ── */}
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-neutral-100 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 z-30 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid md:grid-cols-5">
          {/* ══════ Official Brand Panel (Left) ══════ */}
          <div
            className="hidden md:flex md:col-span-2 flex-col justify-between p-6 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(165deg, #0B1F3A 0%, #0d2a4f 55%, #081628 100%)' }}
          >
            {/* Subtle Ambient Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#24B8A6]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-12 w-52 h-52 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/images/smart_choice_logo_transparent.png"
                  alt="Smart Choice"
                  className="h-8 object-contain drop-shadow"
                />
              </div>

              {/* Tag */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#24B8A6]/20 border border-[#24B8A6]/30 text-[#24B8A6] text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <Radio className="w-3 h-3 text-[#24B8A6]" />
                SMART NFC KEYCHAINS
              </div>

              {/* Headline */}
              <h3 className="text-xl font-black leading-tight text-white mb-2">
                Design Your Custom<br />
                <span className="text-[#24B8A6]">NFC Keychain.</span>
              </h3>

              {/* Real Keychains Image Showcase */}
              <div className="my-2.5 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center justify-center group overflow-hidden">
                <img
                  src="/images/hero_constellation_merged.png"
                  alt="Smart Choice NFC Keychains"
                  className="w-full max-h-28 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Highlights */}
              <div className="space-y-1.5 text-[11px] text-white/85">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#24B8A6] shrink-0" />
                  <span>Instant 1-Tap Connect • No Apps</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Free Shipping on Orders ₹499+</span>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="relative z-10 pt-4 border-t border-white/10 text-[10.5px] text-white/70 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#24B8A6] shrink-0" />
              <span>Free 3D Design Preview on WhatsApp</span>
            </div>
          </div>

          {/* ══════ Clean Form Panel (Right) ══════ */}
          <div className="md:col-span-3 p-6 sm:p-7 flex flex-col justify-center bg-white">
            {sent ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-[#0B1F3A] mb-1.5">Quote Request Received!</h3>
                <p className="text-xs text-neutral-600 max-w-sm mb-5 leading-relaxed">
                  Thanks <span className="font-bold text-[#0B1F3A]">{form.name.split(' ')[0] || 'there'}</span> — our team has received your enquiry and will message your WhatsApp at <span className="font-bold text-[#0B1F3A]">+91 {form.phone}</span> shortly!
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#24B8A6] hover:bg-[#1A9488] shadow-md transition-all hover:scale-105"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-lg font-black text-[#0B1F3A]">Get a Free Quote</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#1A9488] border border-teal-200">
                      QUICK REPLY
                    </span>
                  </div>
                  <p className="text-[11.5px] text-neutral-500">Fill your details below to receive a custom quote &amp; 3D preview.</p>
                </div>

                {/* 1. Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-[#24B8A6]" />
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Enter your name"
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#0B1F3A] placeholder:text-neutral-400 focus:outline-none focus:border-[#24B8A6] focus:ring-2 focus:ring-[#24B8A6]/20 transition-all"
                  />
                </div>

                {/* 2. Mobile Number */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#24B8A6]" />
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-neutral-300 focus-within:border-[#24B8A6] focus-within:ring-2 focus-within:ring-[#24B8A6]/20 transition-all">
                    <span className="inline-flex items-center px-3.5 bg-neutral-100 text-sm font-semibold text-neutral-700 border-r border-neutral-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={update('phone')}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      className="w-full px-3.5 py-2.5 text-sm text-[#0B1F3A] placeholder:text-neutral-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. City & 4. Budget */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#24B8A6]" />
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={update('city')}
                      placeholder="e.g. Chennai"
                      maxLength={100}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#0B1F3A] placeholder:text-neutral-400 focus:outline-none focus:border-[#24B8A6] focus:ring-2 focus:ring-[#24B8A6]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1.5">
                      <IndianRupee className="w-3 h-3 text-[#24B8A6]" />
                      Budget
                    </label>
                    <select
                      value={form.budget}
                      onChange={update('budget')}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#0B1F3A] bg-white focus:outline-none focus:border-[#24B8A6] focus:ring-2 focus:ring-[#24B8A6]/20 transition-all"
                    >
                      <option value="" className="text-neutral-400">Select budget</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Message (optional) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3 text-[#24B8A6]" />
                    Message <span className="text-neutral-400 text-[10px] lowercase font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Tell us what custom design, logo, or NFC link you need..."
                    maxLength={2000}
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-[#0B1F3A] placeholder:text-neutral-400 resize-none focus:outline-none focus:border-[#24B8A6] focus:ring-2 focus:ring-[#24B8A6]/20 transition-all"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 bg-[#24B8A6] hover:bg-[#1A9488] shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    'Submitting…'
                  ) : (
                    <>
                      <span>Get Free Quote on WhatsApp</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePopup;
