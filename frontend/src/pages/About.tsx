import { Link } from 'react-router-dom';
import { Radio, Sparkles, Heart, Shield, ArrowRight, Zap, CheckCircle2, Award, Clock } from 'lucide-react';

export const About = () => {
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
            <span>OUR MISSION &amp; CRAFT</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-[#0A142F] tracking-tight leading-tight">
            Connecting Physical Presence<br />
            <span style={{
              background: 'linear-gradient(90deg, #0084ff 0%, #00d2ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              With Digital Identity.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-[#475569] max-w-2xl mx-auto font-medium leading-relaxed">
            Smart Choice was founded on a simple realization: in an era of endless digital screens, meaningful human connection happens in the physical world.
          </p>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Keychains Tapped', val: '10,000+', icon: <Radio className="w-4 h-4 text-[#0099ff]" /> },
            { label: 'Customer Rating', val: '4.9 ★', icon: <Award className="w-4 h-4 text-amber-500" /> },
            { label: 'Signal Reliability', val: '99.9%', icon: <Zap className="w-4 h-4 text-emerald-500" /> },
            { label: 'Express Dispatch', val: '24 Hours', icon: <Clock className="w-4 h-4 text-violet-500" /> },
          ].map((st, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 text-center space-y-1">
              <div className="flex justify-center mb-1">{st.icon}</div>
              <p className="text-xl sm:text-2xl font-black text-[#0A142F]">{st.val}</p>
              <p className="text-[10.5px] font-bold text-[#64748B] uppercase tracking-wider">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story & Philosophy Content ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#0099ff]">
              THE PROBLEM WE SOLVE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A142F] leading-tight">
              Crafted in India, Engineered for Everyday Carry.
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-medium">
              Paper business cards end up crumpled in the trash. Exchanging social handles by shouting and spelling them out in noisy cafes is awkward and prone to typos.
            </p>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-medium">
              Smart Choice keychains combine tactile 3D diamond design with cutting-edge passive NFC technology into a pocket-sized accessory that stays on your everyday keys.
            </p>
          </div>

          <div className="glass-card rounded-[32px] p-8 space-y-6 shadow-xl border border-white/90">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #00d2ff, #0099ff)' }}>
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#0A142F]">The Smart Choice Promise</h3>
            <ul className="space-y-3.5 text-xs text-[#475569] font-medium">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Zero Battery &amp; Zero Maintenance:</strong> Powered entirely by receiver phone's radio field</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Zero Subscription Fees Forever:</strong> Buy once, share indefinitely</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>100% Water-Resistant Structural Casing:</strong> Sealed PLA enclosure protect chips</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Rewritable at Any Time:</strong> Update your destination link whenever you want</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Founder Card */}
        <div className="glass-card rounded-[32px] p-8 sm:p-10 border border-neutral-200/80 shadow-lg flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0b1f3a] to-[#1e3a66] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            NK
          </div>
          <div className="space-y-1.5 flex-1">
            <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#0099ff]">Founder &amp; Creator</span>
            <h3 className="text-xl font-black text-[#0A142F]">Nirmal kumar N</h3>
            <p className="text-xs text-[#475569] leading-relaxed font-medium">
              Leading product development, precision 3D printing architecture, and customer experience at Smart Choice. Dedicated to delivering Apple-grade digital identity accessories across India.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold">
              <a href="mailto:nirmalkumar00727@gmail.com" className="text-[#0099ff] hover:underline">
                nirmalkumar00727@gmail.com
              </a>
              <span className="text-neutral-300">•</span>
              <a href="https://wa.me/919342626096" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                +91 93426 26096 (WhatsApp &amp; Phone)
              </a>
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-neutral-200/60">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold text-white shadow-lg transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(90deg, #00d2ff, #0099ff)',
              boxShadow: '0 8px 24px rgba(0, 150, 255, 0.35)'
            }}
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
export default About;

