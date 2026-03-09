"use client";

import { motion } from "framer-motion";

export default function ChildrenPolicyPage() {
  return (
    <div className="bg-pink-50 text-gray-700">

      {/* ================= HERO ================= */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#3c2a34] leading-tight mb-6">
            Children’s Privacy Policy
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Pentasent is committed to protecting the privacy and safety of
            children. This policy explains how we address data related to
            minors and outlines parental rights regarding personal information.
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
            title="1. Age Restrictions"
            content={`Pentasent is not intended for use by individuals under the age of 16 (or the minimum age required by applicable law in your jurisdiction).

We do not knowingly collect, store, or process personal information from children under this age threshold.`}
          />

          <PolicySection
            title="2. Compliance with Child Protection Laws"
            content={`We design our platform to comply with applicable child data protection laws, including:

• Children’s Online Privacy Protection Act (COPPA)
• General Data Protection Regulation (GDPR-K)
• Other applicable international child data protection regulations

If we become aware that we have inadvertently collected personal information from a child without proper consent, we will take immediate steps to delete such data.`}
          />

          <PolicySection
            title="3. Parental Rights"
            content={`If you are a parent or legal guardian and believe your child has provided personal information to Pentasent, you may:

• Request access to the information
• Request correction or deletion
• Withdraw consent for further processing

Please contact us at hello@pentasent.com to initiate a request.`}
          />

          <PolicySection
            title="4. Educational & Wellness Content"
            content={`While Pentasent offers educational wellness content, our platform is designed primarily for adults navigating health and lifestyle journeys.

We do not knowingly target children with marketing, AI features, community tools, or biometric integrations.`}
          />

          <PolicySection
            title="5. AI & Automated Features"
            content={`Our AI-powered tools are not designed for use by minors.

We do not intentionally process children's data through automated decision-making systems.`}
          />

          <PolicySection
            title="6. Community Safety"
            content={`Our community features are moderated to promote a respectful and supportive environment.

Accounts suspected of being operated by minors may be suspended pending verification.`}
          />

          <PolicySection
            title="7. Account Verification"
            content={`We may implement age verification mechanisms to prevent underage access.

Users are responsible for providing accurate age information when creating an account.`}
          />

          <PolicySection
            title="8. Data Deletion"
            content={`If we discover that we have collected personal information from a child without verified parental consent, we will delete that information promptly.

Parents may contact us to request deletion at any time.`}
          />

          <PolicySection
            title="9. Changes to This Policy"
            content={`We may update this Children’s Privacy Policy periodically to reflect legal, operational, or regulatory changes.

Material updates will be communicated appropriately.`}
          />

          <PolicySection
            title="10. Contact Us"
            content={`For questions or concerns regarding children’s privacy:

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