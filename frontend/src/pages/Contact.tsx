import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, Radio, Clock, ShieldCheck } from 'lucide-react';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitted(true);
    toast.success('Your message has been sent to our customer care team!');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A142F]">
      {/* ── Hero Banner ── */}
      <section className="page-pastel-hero relative border-b border-white/80 py-16 md:py-24 px-6 overflow-hidden text-center">
        {/* Ambient glow orbs */}
        <div className="absolute top-[-70px] left-[20%] w-[380px] h-[380px] rounded-full bg-sky-300/30 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[20%] w-[400px] h-[400px] rounded-full bg-amber-200/35 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10.5px] font-bold tracking-[0.18em] uppercase text-white shadow-sm"
            style={{ background: 'linear-gradient(90deg, #00d2ff, #0099ff)' }}>
            <Radio className="w-3 h-3 text-white" />
            <span>DIRECT CUSTOMER CARE</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-[#0A142F] tracking-tight leading-tight">
            Get in Touch With Us<br />
            <span style={{
              background: 'linear-gradient(90deg, #0084ff 0%, #00d2ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              We're Here to Help.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#475569] max-w-2xl mx-auto font-medium leading-relaxed">
            Have questions about keychain NFC encoding, order tracking, custom business branding, or bulk orders? Connect directly with our team.
          </p>
        </div>
      </section>

      {/* ── Main Contact Container ── */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Direct Channels */}
          <div className="md:col-span-5 space-y-6">
            <div className="glass-card rounded-[32px] p-7 sm:p-8 space-y-6">
              <div>
                <h3 className="font-black text-lg text-[#0A142F]">Direct Support Channels</h3>
                <p className="text-xs text-[#64748B] mt-1 font-medium">Fastest response times during working hours.</p>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Founder & Brand Card */}
                <div className="p-4 rounded-2xl border border-blue-200/80 bg-blue-50/60 flex items-center gap-3.5 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#0b1f3a] text-white flex items-center justify-center shrink-0 shadow-sm font-black text-sm">
                    NK
                  </div>
                  <div>
                    <strong className="block font-black text-[13px] text-[#0A142F]">Nirmal kumar N</strong>
                    <span className="text-[11px] text-[#64748B] font-medium">Smart Choice Founder &amp; Support Head</span>
                  </div>
                </div>

                <a
                  href="https://wa.me/919342626096"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 hover:bg-emerald-100/80 flex items-center gap-3.5 text-emerald-900 transition-all hover:scale-[1.02] shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block font-black text-[13px]">Phone &amp; WhatsApp Support</strong>
                    <span className="text-[11px] text-emerald-700 font-medium">+91 93426 26096 (Direct / WhatsApp)</span>
                  </div>
                </a>

                <a
                  href="mailto:nirmalkumar00727@gmail.com"
                  className="p-4 rounded-2xl border border-neutral-200/70 bg-white/80 hover:bg-white flex items-center gap-3.5 shadow-xs transition-all hover:scale-[1.02]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0099ff] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block font-black text-[13px] text-[#0A142F]">Email Support</strong>
                    <span className="text-[11px] text-[#64748B] font-medium">nirmalkumar00727@gmail.com</span>
                  </div>
                </a>

                <div className="p-4 rounded-2xl border border-neutral-200/70 bg-white/80 flex items-center gap-3.5 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block font-black text-[13px] text-[#0A142F]">Fulfillment Hub</strong>
                    <span className="text-[11px] text-[#64748B] font-medium">Smart Choice Hub, Tamil Nadu &amp; Bengaluru, India</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200/60 space-y-2 text-[11px] text-[#64748B]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#0099ff]" />
                  <span>Monday - Saturday: 10:00 AM - 7:00 PM IST</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Guaranteed response within 2-4 business hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 glass-card rounded-[32px] p-8 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#0A142F]">Message Received!</h3>
                <p className="text-xs sm:text-sm text-[#475569] max-w-sm mx-auto font-medium">
                  Thank you for reaching out. A support specialist will review your request and respond via email within 2-4 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 rounded-full text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(90deg, #00d2ff, #0099ff)' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div>
                  <label className="block font-bold text-[#0A142F] mb-1.5 text-xs">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/30 focus:border-[#0099ff] text-xs font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0A142F] mb-1.5 text-xs">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/30 focus:border-[#0099ff] text-xs font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0A142F] mb-1.5 text-xs">How Can We Help?</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your inquiry, order question, custom NFC link requirement, or corporate bulk order..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-neutral-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/30 focus:border-[#0099ff] text-xs font-medium resize-none shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full font-bold text-white text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(90deg, #00d2ff, #0099ff)',
                    boxShadow: '0 8px 24px rgba(0, 150, 255, 0.35)'
                  }}
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Contact;

