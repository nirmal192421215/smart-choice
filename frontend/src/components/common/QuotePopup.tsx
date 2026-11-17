import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Send } from 'lucide-react';
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

const SERVICES = [
  'NFC Keychains (personal)',
  'NFC Keychains (bulk / corporate)',
  'Custom 3D printing',
  'Brand collaboration',
  'Something else',
];

/**
 * "Get a Free Quote" popup.
 * Split panel: navy brand side + form side, matching the site theme.
 */
export const QuotePopup: React.FC<QuotePopupProps> = ({ open, onClose }) => {
  const [form, setForm] = useState<EnquiryPayload>({
    name: '',
    phone: '',
    email: '',
    city: '',
    budget: '',
    service: SERVICES[0],
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

    // Light client-side checks; the backend validates again.
    if (!form.name.trim()) return toast.error('Please enter your name');
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10) return toast.error('Please enter a valid 10-digit mobile number');

    setSubmitting(true);
    try {
      await enquiriesApi.create({
        name: form.name.trim(),
        phone: digits.slice(-10),
        email: form.email?.trim() || undefined,
        city: form.city?.trim() || undefined,
        budget: form.budget || undefined,
        service: form.service || undefined,
        message: form.message?.trim() || undefined,
      });
      setSent(true);
      toast.success('Thanks! We will call you back shortly.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not send your enquiry. Please try again.');
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid md:grid-cols-5">
          {/* ── Brand panel ── */}
          <div
            className="hidden md:flex md:col-span-2 flex-col justify-between p-6 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #0B1F3A 0%, #10294a 60%, #0d3560 100%)' }}
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#24B8A6]/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-12 w-52 h-52 rounded-full bg-sky-400/20 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#24B8A6] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-black tracking-wide">SMART CHOICE</span>
              </div>

              <h3 className="text-2xl font-black leading-tight mb-3">
                Get a free<br />
                <span className="text-[#24B8A6]">quote &amp; design</span><br />
                consultation.
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Tell us what you need — custom NFC keychains, bulk corporate orders or a bespoke
                3D-printed piece. We reply within 2 hours.
              </p>
            </div>

            <div className="relative z-10 space-y-2 text-[11px] text-white/75 mt-8">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#24B8A6]" /> 100% privacy — no spam, ever
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#24B8A6]" /> Free shipping on orders ₹499+
              </p>
            </div>
          </div>

          {/* ── Form panel ── */}
          <div className="md:col-span-3 p-6 sm:p-8">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-14 h-14 rounded-full bg-[#24B8A6]/15 flex items-center justify-center mb-4">
                  <Send className="w-6 h-6 text-[#24B8A6]" />
                </div>
                <h3 className="text-xl font-black text-[#0B1F3A] mb-2">Enquiry sent!</h3>
                <p className="text-sm text-neutral-500 max-w-xs mb-6">
                  Thanks {form.name.split(' ')[0] || 'there'} — we've received your details and
                  will reach out on WhatsApp shortly.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(90deg, #24B8A6, #1a9488)' }}
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <h3 className="text-lg font-black text-[#0B1F3A]">Get a free quote</h3>
                  <p className="text-[11px] text-neutral-500">Fields marked * are required.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-neutral-600 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Enter your name"
                    maxLength={200}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-[#0B1F3A] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#24B8A6]/40 focus:border-[#24B8A6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-neutral-600 mb-1">
                    Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-neutral-200 bg-neutral-50 text-sm text-neutral-600">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={update('phone')}
                      placeholder="Enter mobile number"
                      maxLength={10}
                      className="w-full px-3.5 py-2.5 rounded-r-xl border border-neutral-200 text-sm text-[#0B1F3A] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#24B8A6]/40 focus:border-[#24B8A6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-neutral-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="Enter your email (optional)"
                    maxLength={254}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-[#0B1F3A] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#24B8A6]/40 focus:border-[#24B8A6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-neutral-600 mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={update('city')}
                      placeholder="e.g. Chennai"
                      maxLength={100}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-[#0B1F3A] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#24B8A6]/40 focus:border-[#24B8A6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-neutral-600 mb-1">
                      Budget
                    </label>
                    <select
                      value={form.budget}
                      onChange={update('budget')}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm text-[#0B1F3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#24B8A6]/40 focus:border-[#24B8A6]"
                    >
                      <option value="">Select budget</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-neutral-600 mb-1">
                    What do you need?
                  </label>
                  <select
                    value={form.service}
                    onChange={update('service')}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm text-[#0B1F3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#24B8A6]/40 focus:border-[#24B8A6]"
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-neutral-600 mb-1">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Tell us a little about what you need (optional)"
                    maxLength={2000}
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-[#0B1F3A] placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#24B8A6]/40 focus:border-[#24B8A6]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-full font-black text-sm text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(90deg, #24B8A6, #1a9488)',
                    boxShadow: '0 8px 20px rgba(36, 184, 166, 0.35)',
                  }}
                >
                  {submitting ? 'Sending…' : 'Get Free Quote'}
                  {!submitting && <Send className="w-4 h-4" />}
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
