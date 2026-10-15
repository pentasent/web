import { FaqItem } from '@/components/ui/FaqSection';

export const CERTIFICATE_FAQS: FaqItem[] = [
  {
    id: 'tamper-evident',
    question: 'How does tamper-evident credential verification work?',
    answer:
      'Every official credential issued by Pentasent contains a unique verification code and cryptographic fingerprint linked directly to our immutable registry. This allows institutions and employers to verify authenticity in real time without risk of forgery or alteration.',
  },
  {
    id: 'issuer-snapshots',
    question: 'What are direct issuer snapshots and authorized records?',
    answer:
      'Our registry preserves an immutable historical snapshot of the issuance state, including the employee role title, department, completion date, and verified signatory authorizations as they existed at the exact moment of credential granting.',
  },
  {
    id: 'portable-proof',
    question: 'How can recipients share public and portable proof?',
    answer:
      'Recipients and prospective employers can share the public verification URL, download authentic high-resolution PNG credential cards, or generate print-ready vector PDFs anytime for third-party verification.',
  },
  {
    id: 'not-found',
    question: 'What should I do if a Certificate ID is not found in the registry?',
    answer:
      'Please ensure you entered the complete ID (e.g., PEN-CERT-6M2Q9H) without typos. If the document was issued recently or under an institutional partnership, please allow up to 24 hours for registry synchronization or contact hr@pentasent.com.',
  },
  {
    id: 'employer-inquiries',
    question: 'Can employers perform bulk background verifications?',
    answer:
      'Yes. For institutional hiring partners and credential background checks requiring bulk registry verification, please reach out directly to credentials@pentasent.com or your enterprise account representative.',
  },
  {
    id: 'expiration',
    question: 'Do Pentasent employee certificates and experience credentials expire?',
    answer:
      'Completion credentials and employment experience certifications are permanent historical records that do not expire. Specialized clinical or technical compliance certifications may carry specified renewal dates reflected directly on the certificate.',
  },
];
