import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  Sliders,
  Smartphone,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers,
  Heart
} from 'lucide-react';

export const HowItWorks = () => {
  const [activeSim, setActiveSim] = useState<'instagram' | 'spotify' | 'whatsapp'>('instagram');

  const simData = {
    instagram: {
      name: 'Instagram',
      color: '#E1306C',
      banner: 'Instagram Profile',
      url: 'instagram.com/@alex_creative',
      sub: 'Open profile in Instagram app',
      icon: '📸',
    },
    spotify: {
      name: 'Spotify',
      color: '#1DB954',
      banner: 'Top Hits Playlist',
      url: 'open.spotify.com/playlist/...',
      sub: 'Play now in Spotify',
      icon: '🎵',
    },
    whatsapp: {
      name: 'WhatsApp',
      color: '#25D366',
      banner: 'Direct Chat',
      url: 'wa.me/+919342626096',
      sub: 'Start direct WhatsApp chat',
      icon: '💬',
    },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A142F]">
      {/* ── Hero Banner ── */}
      <section className="page-pastel-hero relative border-b border-white/80 py-16 md:py-24 px-6 overflow-hidden text-center">
        {/* Ambient glow orbs */}
        <div className="absolute top-[-70px] left-[20%] w-[400px] h-[400px] rounded-full bg-sky-300/30 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[20%] w-[420px] h-[420px] rounded-full bg-amber-200/35 blur-[110px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10.5px] font-bold tracking-[0.18em] uppercase text-white shadow-sm"
            style={{ background: 'linear-gradient(90deg, #00d2ff, #0099ff)' }}>
            <Radio className="w-3 h-3 text-white" />
            <span>INSTANT NFC CONNECTION</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-[#0A142F] tracking-tight leading-tight">
            How Smart Choice Works<br />
            <span style={{
              background: 'linear-gradient(90deg, #0084ff 0%, #00d2ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              One Tap. Zero Apps. Instant Connect.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-[#475569] max-w-2xl mx-auto font-medium leading-relaxed">
            Near Field Communication (NFC) enables wireless data transfer between your Smart Choice keychain and any smartphone in a split second. Zero batteries. Zero charging. Forever free.
          </p>
        </div>
      </section>

      {/* ── 3 Simple Steps ── */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#0099ff]">
            SIMPLE 3-STEP WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0A142F] mt-1">
            From Customization to Instant Taps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="glass-card rounded-[32px] p-8 space-y-5 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-4 right-6 text-5xl font-black opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ background: 'linear-gradient(90deg, #0084ff, #00d2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              01
            </div>

            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #00d2ff, #0088ff)' }}>
              <Sliders className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-[#0A142F]">1. Choose &amp; Customize</h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-medium">
              Pick your favorite diamond keychain (Instagram, WhatsApp, Spotify, Portfolio, YouTube &amp; more) and enter your custom handle or web link during checkout.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#0099ff] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Rewritable anytime
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-[32px] p-8 space-y-5 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-4 right-6 text-5xl font-black opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ background: 'linear-gradient(90deg, #0084ff, #00d2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              02
            </div>

            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-[#0A142F]">2. We Encode &amp; Verify</h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-medium">
              Each keychain is precision 3D-printed with embedded NTAG215 microchip, digitally encoded with your destination URL, signal-tested, and quality checked.
            </p>
            <div className="pt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Signal tested &amp; verified
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-[32px] p-8 space-y-5 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-4 right-6 text-5xl font-black opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ background: 'linear-gradient(90deg, #0084ff, #00d2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              03
            </div>

            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
              <Zap className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-[#0A142F]">3. Tap to Connect</h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-medium">
              Touch the keychain to the top of an iPhone or center-back of an Android. A notification banner instantly pops up on their screen — ready to open in 1 click!
            </p>
            <div className="pt-2 text-[11px] font-bold text-violet-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Zero app required for recipient
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Tap Simulator Section ── */}
      <section className="py-14 bg-gradient-to-b from-[#FAFAFA] to-white border-y border-neutral-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-card rounded-[36px] p-8 sm:p-12 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Info */}
              <div className="lg:col-span-6 space-y-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider text-[#0099ff] bg-blue-50">
                  <Sparkles className="w-3.5 h-3.5" /> Interactive Demonstration
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0A142F]">
                  Try It Yourself: Choose a Keychain to Simulate Tap
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                  Click on an app below to see exactly what pops up on the other person's smartphone when you tap your Smart Choice keychain!
                </p>

                {/* Keychain Switcher Buttons */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {(['instagram', 'spotify', 'whatsapp'] as const).map((key) => {
                    const isCur = activeSim === key;
                    const d = simData[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveSim(key)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                          isCur
                            ? 'text-white shadow-md scale-105'
                            : 'bg-white text-neutral-700 border border-neutral-200/80 hover:bg-neutral-50'
                        }`}
                        style={isCur ? {
                          background: 'linear-gradient(90deg, #00d2ff, #0099ff)',
                          boxShadow: '0 4px 16px rgba(0, 150, 255, 0.35)'
                        } : {}}
                      >
                        <span>{d.icon}</span>
                        <span>{d.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Phone Simulation Mockup */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-[240px] rounded-[38px] p-3 shadow-2xl bg-neutral-900 border-4 border-neutral-700/60">
                  {/* Dynamic Island Notch */}
                  <div className="w-16 h-4 bg-black rounded-full mx-auto mb-4" />

                  {/* Simulated Screen */}
                  <div className="bg-gradient-to-b from-sky-900/40 to-slate-900 rounded-[28px] p-3.5 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
                    {/* Concentric NFC Rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                      <div className="w-32 h-32 rounded-full border border-cyan-400 animate-ping" />
                    </div>

                    {/* Notification Banner on Phone Screen */}
                    <div className="glass-card rounded-2xl p-3 shadow-lg border border-white/40 space-y-1.5 animate-slide-up-in">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: simData[activeSim].color }}>
                          {simData[activeSim].icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-[#0A142F] truncate">
                            NFC Tag Detected • {simData[activeSim].name}
                          </p>
                          <p className="text-[8.5px] text-[#64748B] truncate">
                            {simData[activeSim].sub}
                          </p>
                        </div>
                      </div>
                      <div className="pt-1 flex justify-end">
                        <span className="text-[9px] font-bold text-[#0099ff] bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          Tap to open <ExternalLink className="w-2 h-2" />
                        </span>
                      </div>
                    </div>

                    {/* Phone Screen Bottom Prompt */}
                    <div className="text-center py-4">
                      <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-cyan-400/20 text-cyan-300 animate-pulse">
                        <Radio className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-semibold text-white/80">
                        Keychain connected successfully!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Device Compatibility Matrix ── */}
      <section className="py-16 md:py-20 max-w-5xl mx-auto px-6 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#0099ff]">
            COMPATIBILITY GUARANTEE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0A142F] mt-1">
            Works on 98%+ Modern Smartphones
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] mt-2 font-medium">
            Compatible right out of the box. No special apps, downloads, or configurations needed by the receiver.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-card p-7 rounded-[32px] space-y-3.5 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0A142F]">Apple iOS Devices</h3>
                <span className="text-[10px] text-[#64748B] font-semibold">Native Background Tag Reading</span>
              </div>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed font-medium">
              iPhone XS, XR, 11, 12, 13, 14, 15, 16 and all future models. No app or NFC toggle needed. Background NFC is always permanently active in iOS.
            </p>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" /> Tap near the top camera edge
            </div>
          </div>

          <div className="glass-card p-7 rounded-[32px] space-y-3.5 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0099ff] text-white flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0A142F]">Android Devices</h3>
                <span className="text-[10px] text-[#64748B] font-semibold">Universal NFC Hardware</span>
              </div>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed font-medium">
              Samsung Galaxy, Google Pixel, OnePlus, Xiaomi, Oppo, Vivo, Motorola, and all smartphones equipped with standard NFC hardware.
            </p>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" /> Tap center back of smartphone
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold text-white shadow-lg transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(90deg, #00d2ff, #0099ff)',
              boxShadow: '0 8px 24px rgba(0, 150, 255, 0.35)'
            }}
          >
            <span>Browse All Keychains</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
export default HowItWorks;

