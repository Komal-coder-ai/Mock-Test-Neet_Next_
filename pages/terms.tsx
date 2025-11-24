import { ShieldCheck, ScrollText } from 'lucide-react';
import Head from 'next/head';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
      <Head>
        <title>Terms & Conditions | HPBOSE Mock Test</title>
      </Head>
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <ScrollText size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
        </div>
        <div className="space-y-6 text-gray-700 text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the HPBOSE Mock Test platform, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the service.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">2. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and truthful information during registration and profile updates.</li>
              <li>Do not share your account credentials with others.</li>
              <li>Use the platform for educational purposes only.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">3. Privacy & Security</h2>
            <p>
              Your personal data and contact details are encrypted and securely stored. We do not share your information with third parties except as required by law.
            </p>
            <div className="flex items-center gap-2 mt-2 text-green-700">
              <ShieldCheck size={18} />
              <span>Bank-level encryption for sensitive data</span>
            </div>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">4. Intellectual Property</h2>
            <p>
              All content, questions, and analytics on this platform are the property of HPBOSE and may not be copied or redistributed without permission.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">5. Limitation of Liability</h2>
            <p>
              HPBOSE is not responsible for any loss or damages resulting from the use of this platform. The service is provided "as is" without warranties of any kind.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">6. Changes to Terms</h2>
            <p>
              We may update these Terms & Conditions at any time. Continued use of the platform constitutes acceptance of the revised terms.
            </p>
          </section>
        </div>
        <div className="mt-8 text-xs text-gray-500 text-center">
          &copy; {new Date().getFullYear()} HPBOSE Mock Test. All rights reserved.
        </div>
      </div>
    </div>
  );
}
