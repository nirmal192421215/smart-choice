export const Privacy = () => {
  return (
    <div className="min-h-screen bg-white text-brand-navy py-12 md:py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-6 text-xs text-neutral-600 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-brand-navy mb-4">Privacy Policy</h1>
        <p>Last updated: October 2026</p>

        <h2 className="text-base font-bold text-brand-navy mt-6">1. Information We Collect</h2>
        <p>
          We collect standard delivery information (name, address, phone number, email) and the destination URL or social handle you provide to encode your NFC keychain.
        </p>

        <h2 className="text-base font-bold text-brand-navy mt-6">2. Zero Analytics or Data Interception on Taps</h2>
        <p>
          Your Smart Choice keychain writes standard NDEF records directly to the physical chip. When someone taps your keychain, their phone connects directly to your target link (e.g. instagram.com/yourhandle) without passing through any third-party intermediary server. Your link data is 100% yours.
        </p>

        <h2 className="text-base font-bold text-brand-navy mt-6">3. Payment Security</h2>
        <p>
          We do not store your credit card or UPI details on our servers. All transactions are securely handled by RBI-regulated payment gateways (Razorpay) with 256-bit encryption.
        </p>
      </div>
    </div>
  );
};
export default Privacy;
