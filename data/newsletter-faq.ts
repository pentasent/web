import { FaqItem } from '@/components/ui/FaqSection';

export const NEWSLETTER_FAQS: FaqItem[] = [
  {
    id: 'consent-control',
    question: 'How does instant consent control work?',
    answer:
      'Modify or revoke your newsletter opt-in at any time. Any changes you make directly in this portal or via one-click unsubscribe links in our emails take effect across our campaign systems immediately.',
  },
  {
    id: 'zero-spam',
    question: "What is Pentasent's data privacy and zero-spam policy?",
    answer:
      'We never sell your email or share list records with advertisers. You only receive genuine Pentasent healthcare insights, clinical technology updates, and research digests.',
  },
  {
    id: 'no-account',
    question: 'Do I need a Pentasent account to manage preferences?',
    answer:
      'No account required. Subscription preferences are self-service and independent of whether you have an authenticated Pentasent member account. Anyone can search by email to check status or opt out.',
  },
  {
    id: 'resubscribe',
    question: 'How do I resubscribe if I change my mind later?',
    answer:
      'You can reactivate your subscription at any time using the search lookup tool on this page or through the newsletter signup form in the footer of any Pentasent page. Your preferences are updated instantly.',
  },
  {
    id: 'frequency',
    question: 'What types of newsletter updates will I receive?',
    answer:
      'Our newsletter delivers curated clinical technology digests, regulatory and compliance updates, healthcare AI research summaries, and invitations to upcoming Pentasent product webinars.',
  },
  {
    id: 'delivery-speed',
    question: 'How quickly do subscription preference changes take effect?',
    answer:
      'All preference updates—including unsubscriptions and resubscriptions—are processed in real-time in our database and synchronized with our delivery infrastructure immediately with zero delay.',
  },
];
