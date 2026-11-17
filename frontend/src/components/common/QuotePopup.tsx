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
 * Next-Gen Futuristic "Get a Free Quote" popup for Smart Choice.
 * Cyber-glassmorphism theme with neon teal & cyan glow, simplified to:
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
      toast.success('Inquiry transmitted! We will reach out on WhatsApp shortly.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not send enquiry. Please try again.');
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-5 animate-fade-in"
      onClick={handleClose}
    >
      {/* ── Outer glowing wrapper ── */}
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-cyan-400/60 via-teal-500/30 to-blue-600/50 shadow-[0_0_50px_rgba(0,210,255,0.25)] animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner Card Container */}
        <div className="relative w-full rounded-[23px] bg-[#070D18] overflow-hidden">
          {/* Ambient Cyber Glow Orbs */}
          <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-cyan-500/20 blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-teal-400/15 blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-3.5 top-3.5 z-30 w-8 h-8 rounded-full bg-white/10 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid md:grid-cols-5 relative z-10">
            {/* ══════ Futuristic Brand Panel (Left) ══════ */}
            <div className="hidden md:flex md:col-span-2 flex-col justify-between p-7 text-white border-r border-white/10 bg-gradient-to-b from-[#0B1528] to-[#060C16]">
              <div>
                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-extrabold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                  </span>
                  SMART CHOICE NFC
                </div>

                {/* Main Headline */}
                <h3 className="text-2xl font-black leading-tight tracking-tight mb-3">
                  Design Your<br />
                  <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                    Futuristic NFC
                  </span><br />
                  Keychain.
                </h3>

                <p className="text-xs text-slate-300/80 leading-relaxed font-normal mb-6">
                  Get a bespoke 3D design consultation &amp; instant price quote delivered directly to your WhatsApp.
                </p>

                {/* Cyber Feature Highlights */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-200 bg-white/[0.03] border border-white/5 px-3 py-2 rounded-xl">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Instant 1-Tap Phone Connectivity</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-200 bg-white/[0.03] border border-white/5 px-3 py-2 rounded-xl">
                    <Zap className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Zero Battery &amp; Zero Apps Required</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-200 bg-white/[0.03] border border-white/5 px-3 py-2 rounded-xl">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Free Shipping on Orders ₹499+</span>
                  </div>
                </div>
              </div>

              {/* Bottom Guarantee */}
              <div className="pt-6 border-t border-white/10 text-[10.5px] text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>100% Privacy Guarantee • No Spam</span>
              </div>
            </div>

            {/* ══════ Form Panel (Right) ══════ */}
            <div className="md:col-span-3 p-6 sm:p-7 flex flex-col justify-center">
              {sent ? (
                <div className="py-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-teal-500/20 border border-cyan-400/40 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,210,255,0.3)]">
                    <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-1.5">Quote Request Transmitted!</h3>
                  <p className="text-xs text-slate-300 max-w-sm mb-6 leading-relaxed">
                    Thanks <span className="text-cyan-300 font-semibold">{form.name.split(' ')[0] || 'there'}</span> — we have received your request and will reach out to you on WhatsApp at <span className="text-cyan-300 font-semibold">+91 {form.phone}</span> shortly!
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-full text-xs font-bold text-[#070D18] bg-gradient-to-r from-cyan-300 to-teal-300 hover:from-cyan-200 hover:to-teal-200 shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all hover:scale-105"
                  >
                    Continue to Store
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                        Get a Free Quote
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          INSTANT
                        </span>
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400">Fill details below — we will message your WhatsApp with a design preview.</p>
                  </div>

                  {/* 1. Name */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-1 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-cyan-400" />
                      Name <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={update('name')}
                      placeholder="Enter your name"
                      maxLength={100}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C1628]/90 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_15px_rgba(0,210,255,0.2)] transition-all"
                    />
                  </div>

                  {/* 2. Phone Number */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-cyan-400" />
                      Mobile Number <span className="text-pink-400">*</span>
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-700/80 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 focus-within:shadow-[0_0_15px_rgba(0,210,255,0.2)] transition-all">
                      <span className="inline-flex items-center px-3.5 bg-[#091120] text-sm font-semibold text-cyan-300 border-r border-slate-700/80">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={form.phone}
                        onChange={update('phone')}
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                        className="w-full px-3.5 py-2.5 bg-[#0C1628]/90 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 3. City & 4. Budget in 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        City
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={update('city')}
                        placeholder="e.g. Chennai"
                        maxLength={100}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C1628]/90 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_15px_rgba(0,210,255,0.2)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-1 flex items-center gap-1.5">
                        <IndianRupee className="w-3 h-3 text-cyan-400" />
                        Budget
                      </label>
                      <select
                        value={form.budget}
                        onChange={update('budget')}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#0C1628]/90 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_15px_rgba(0,210,255,0.2)] transition-all"
                      >
                        <option value="" className="bg-[#0C1628] text-slate-400">Select budget</option>
                        {BUDGETS.map((b) => (
                          <option key={b} value={b} className="bg-[#0C1628] text-white">{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 5. Message (optional) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-cyan-400" />
                      Message <span className="text-slate-500 text-[10px] lowercase font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Tell us what custom design or NFC link you want (optional)..."
                      maxLength={2000}
                      rows={2}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C1628]/90 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 resize-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_15px_rgba(0,210,255,0.2)] transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl font-black text-sm text-[#070D18] flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 hover:from-cyan-300 hover:via-teal-200 hover:to-sky-300 shadow-[0_0_25px_rgba(0,210,255,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? (
                      'Transmitting…'
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
    </div>
  );
};

export default QuotePopup;
