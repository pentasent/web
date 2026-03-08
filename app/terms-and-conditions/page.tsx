"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="bg-pink-50 text-gray-700">

      {/* ================= HERO ================= */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#3c2a34] leading-tight mb-6">
            Terms & Conditions
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            These Terms & Conditions govern your access to and use of the
            Pentasent platform, including our mobile applications, AI tools,
            wellness features, biometric integrations, and community services.
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Effective Date: January 1, 2026
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10 space-y-16">

          <PolicySection
            title="1. Acceptance of Terms"
            content={`By accessing or using Pentasent, you agree to be bound by these Terms & Conditions and our Privacy Policy.

If you do not agree, you must discontinue use of the platform immediately.`}
          />

          <PolicySection
            title="2. Description of Services"
            content={`Pentasent provides digital wellness tools, including:

• Habit tracking and journaling
• AI-generated wellness insights
• Guided rituals and educational resources
• Community features and events
• Biometric and wearable integrations
• Subscription-based premium features

Services may evolve over time as we enhance our platform.`}
          />

          <PolicySection
            title="3. Medical Disclaimer"
            content={`Pentasent is not a medical provider.

All content, AI outputs, and recommendations are provided for informational and educational purposes only and do not constitute medical advice, diagnosis, or treatment.

Always consult a qualified healthcare professional before making medical decisions.`}
          />

          <PolicySection
            title="4. Eligibility"
            content={`You must be at least 16 years old (or the minimum age required in your jurisdiction) to use our services.

By using Pentasent, you represent that you meet this requirement.`}
          />

          <PolicySection
            title="5. User Accounts"
            content={`You are responsible for maintaining the confidentiality of your account credentials.

You agree to provide accurate information and to update it as necessary.

We reserve the right to suspend or terminate accounts that violate these Terms.`}
          />

          <PolicySection
            title="6. Subscriptions & Payments"
            content={`Certain features require a paid subscription.

• Subscription fees are billed in advance.
• Plans may auto-renew unless canceled.
• You may cancel through your account settings.
• Refunds are provided only where required by law.

Pricing and features may change with notice.`}
          />

          <PolicySection
            title="7. Acceptable Use"
            content={`You agree not to:

• Use the platform for unlawful purposes
• Post harmful, abusive, or misleading content
• Attempt to access unauthorized systems
• Reverse engineer or exploit the platform
• Interfere with community safety

Violations may result in suspension or termination.`}
          />

          <PolicySection
            title="8. Community Guidelines"
            content={`Our community is built on respect and support.

Users must engage respectfully and avoid harassment, misinformation, or inappropriate content.

We reserve the right to moderate and remove content at our discretion.`}
          />

          <PolicySection
            title="9. Intellectual Property"
            content={`All content, branding, software, design elements, and AI systems are the intellectual property of Pentasent or its licensors.

You may not reproduce, distribute, or create derivative works without prior written permission.`}
          />

          <PolicySection
            title="10. AI & Automated Features"
            content={`AI-generated outputs are provided “as is” and may contain inaccuracies.

You are responsible for evaluating the suitability of AI recommendations before acting upon them.`}
          />

          <PolicySection
            title="11. Third-Party Integrations"
            content={`Our platform may integrate with third-party services such as wearable devices or payment providers.

We are not responsible for the practices or content of third-party services.`}
          />

          <PolicySection
            title="12. Limitation of Liability"
            content={`To the fullest extent permitted by law, Pentasent shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.

Our total liability shall not exceed the amount you paid to us in the preceding 12 months.`}
          />

          <PolicySection
            title="13. Indemnification"
            content={`You agree to indemnify and hold Pentasent harmless from claims, liabilities, damages, and expenses arising from your misuse of the platform or violation of these Terms.`}
          />

          <PolicySection
            title="14. Termination"
            content={`We may suspend or terminate your access at any time for violation of these Terms or misuse of services.

Upon termination, your right to use the platform ceases immediately.`}
          />

          <PolicySection
            title="15. Governing Law"
            content={`These Terms are governed by the laws of the applicable jurisdiction where Pentasent operates.

Any disputes shall be resolved in the competent courts of that jurisdiction.`}
          />

          <PolicySection
            title="16. Changes to These Terms"
            content={`We may update these Terms periodically.

Material changes will be communicated through the platform or via email.`}
          />

          <PolicySection
            title="17. Contact Information"
            content={`For questions regarding these Terms & Conditions:

Pentasent Legal Department  
Email: hello@pentasent.com  
Address: Tower-A, Sector-15, Village Silokhera Gurugram, Haryana, 122002`}
          />

        </div>
      </section>
    </div>
  );
}

/* ================= SECTION COMPONENT ================= */

function PolicySection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <h2 className="text-2xl md:text-3xl font-semibold text-[#3c2a34]">
        {title}
      </h2>
      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </motion.div>
  );
}