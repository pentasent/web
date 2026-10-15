import Link from 'next/link';
import { ArrowRight, Building2, HeartPulse, HelpCircle, Sparkles, Stethoscope } from 'lucide-react';

export default function HelpPage() {
  const offerings = [
    {
      title: 'My Health',
      icon: HeartPulse,
      description: 'Personal health tracking, calculators (BMI, BMR), wellness goals, and supportive health communities.',
    },
    {
      title: 'Healthcare',
      icon: Stethoscope,
      description: 'Professional networking and discovery for doctors, therapists, practitioners, and clinical specialists.',
    },
    {
      title: 'Organizations',
      icon: Building2,
      description: 'Connecting hospitals, medical clinics, diagnostic centers, and healthtech enterprises.',
    },
    {
      title: 'Innovation',
      icon: Sparkles,
      description: 'Discovering next-generation health products, medtech breakthroughs, clinical research, and digital health AI.',
    },
  ];

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 sm:px-8 sm:pt-36 lg:px-[3.8vw]">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6b185f]">
          <HelpCircle size={16} />
          <span>Knowledge & Help Center</span>
        </div>

        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[#1c171a] tracking-tight">
          Welcome to Pentasent
        </h1>

        <p className="mt-3 text-base sm:text-lg text-[#665e64] max-w-2xl leading-relaxed">
          Pentasent is a unified healthcare ecosystem built to bring together people, organizations,
          innovation, and personal health under one connected platform.
        </p>

        {/* The 4 Offerings Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {offerings.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-[#ebe4dc] bg-white p-6 shadow-xs hover:border-[#4a0139]/40 transition-colors"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5eeea] text-[#4a0139] mb-4">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-[#1c171a]">{item.title}</h3>
                <p className="mt-1.5 text-sm text-[#665e64] leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Contact / Help CTA */}
        <div className="mt-12 rounded-2xl bg-[#f8f5f2] border border-[#e8ded6] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-[#1c171a]">Need direct assistance or want to collaborate?</h4>
            <p className="text-sm text-[#665e64] mt-0.5">Our support and sales teams are available to assist you.</p>
          </div>
          <Link
            href="/company/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4a0139] text-white text-sm font-semibold hover:bg-[#38012b] transition-colors shrink-0 cursor-pointer"
          >
            <span>Contact Us</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
