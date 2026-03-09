"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-pink-50 text-gray-700">

      {/* ================= HERO ================= */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#3c2a34] leading-tight mb-6">
            Privacy Policy
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            We are committed to protecting your privacy with the highest
            standards of care. This policy explains how Pentasent collects,
            uses, protects, and processes your information across our wellness
            platform, AI tools, community features, and health integrations.
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Effective Date: March 1, 2026
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10 space-y-16">

          <PolicySection
            title="1. Who We Are"
            content={`Pentasent is a global health and wellness technology company offering digital tools for habit tracking, journaling, guided rituals, AI-powered insights, biometric integrations, and supportive community engagement.

We design our services to empower individuals with clarity, confidence, and evidence-informed guidance throughout their wellness journey.`}
          />

          <PolicySection
            title="2. Information We Collect"
            content={`To provide personalized and secure services, we may collect:

• Account Information – Name, email address, login credentials.
• Profile Data – Wellness goals, preferences, age range.
• Health & Wellness Data – Mood logs, sleep tracking, symptom entries, nutrition inputs, journal content.
• Biometric Integrations – Wearable device data, glucose readings, or other connected metrics.
• AI Interactions – Inputs and outputs from AI-powered tools.
• Community Content – Posts, comments, participation data.
• Usage & Device Data – IP address, device type, browser type, session data.
• Payment Information – Securely processed by third-party providers.

You control what information you choose to share within the platform.`}
          />

          <PolicySection
            title="3. How We Use Your Information"
            content={`We use collected information to:

• Deliver personalized wellness insights
• Generate AI-driven guidance
• Improve platform performance and features
• Facilitate community engagement
• Provide customer support
• Process subscriptions and payments
• Maintain platform security and prevent misuse
• Comply with legal obligations

We do not sell personal health or biometric data.`}
          />

          <PolicySection
            title="4. AI & Automated Processing"
            content={`Our platform includes AI-powered features that analyze user-provided inputs to generate insights and suggestions.

AI systems operate within controlled environments and are designed to support—not replace—professional medical advice. Users maintain control over what data is submitted for AI processing.`}
          />

          <PolicySection
            title="5. Health & Biometric Data"
            content={`If you connect third-party devices or health services, we may process related biometric information solely to provide enhanced personalization and insights.

You may disconnect integrations at any time through your account settings.`}
          />

          <PolicySection
            title="6. Data Sharing"
            content={`We may share limited information with trusted service providers including:

• Cloud hosting infrastructure
• Payment processors
• Analytics providers
• Legal authorities where required by law

All partners are contractually required to safeguard your information.`}
          />

          <PolicySection
            title="7. Data Security"
            content={`We implement administrative, technical, and physical safeguards including encryption, secure cloud environments, restricted access controls, and regular security assessments.

While no system can guarantee absolute security, we continuously enhance our protections.`}
          />

          <PolicySection
            title="8. Data Retention"
            content={`We retain personal data only as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements.

You may request account deletion at any time.`}
          />

          <PolicySection
            title="9. Your Rights"
            content={`Depending on your jurisdiction, you may have the right to:

• Access your personal information
• Correct inaccuracies
• Request deletion
• Restrict or object to processing
• Withdraw consent
• Request data portability

To exercise these rights, contact us at hello@pentasent.com.`}
          />

          <PolicySection
            title="10. Cookies & Tracking"
            content={`We use cookies and related technologies to improve user experience, analyze usage patterns, and optimize performance.

You may manage cookie preferences through your browser settings.`}
          />

          <PolicySection
            title="11. Children’s Privacy"
            content={`Our services are not intended for individuals under 16 years of age (or the minimum age required by applicable law). We do not knowingly collect personal information from minors.`}
          />

          <PolicySection
            title="12. International Data Transfers"
            content={`Your information may be processed in jurisdictions outside your country of residence. Where applicable, we implement appropriate safeguards for international data transfers.`}
          />

          <PolicySection
            title="13. Updates to This Policy"
            content={`We may update this Privacy Policy periodically. Material changes will be communicated through platform notifications or email.`}
          />

          <PolicySection
            title="14. Contact Us"
            content={`For questions regarding this Privacy Policy:

Pentasent Privacy Office  
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