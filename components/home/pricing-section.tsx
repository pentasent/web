'use client';

import { Check } from 'lucide-react';

export default function PricingSection() {
const plans = [
  {
    name: 'Free',
    price: 'Free',
    subtitle: 'Start your wellness journey',
    button: 'Get Started',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    featureBg: 'bg-green-50',
    link: '/signin',
    features: [
      'Join communities & chats',
      '3 beats categories (10+ each)',
      'Daily journal (1 per day)',
      'Task planner (5 tasks/day)',
      'Meditation & yoga access',
    ],
  },
  {
    name: 'Premium',
    price: '$9/mo',
    subtitle: 'Deeper focus & wellness',
    button: 'Upgrade to Premium',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-500',
    featureBg: 'bg-purple-50',
    link: '/signin',
    features: [
      'Everything in Free',
      '10+ beats categories',
      '5 journals per day',
      '10 tasks/day + tracking',
      'Premium yoga & 5 sounds',
    ],
  },
  {
    name: 'Premium+',
    price: '$15/mo',
    subtitle: 'Advanced growth tools',
    button: 'Go Premium+',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    featureBg: 'bg-amber-50',
    link: '/signin',
    features: [
      'Everything in Premium',
      'Full beats library (50+ each)',
      'Unlimited journaling',
      'Unlimited tasks & habits',
      '7 meditation sounds + yoga',
    ],
  },
]

  return (
    <section className="bg-[#f5f3f4] py-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-20" id='pricing'>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#3c2a34] leading-tight">
            Choose the plan that meets<br />
            you where you are
          </h2>

          <p className="mt-6 text-gray-600 text-base md:text-lg">
            Whether you&apos;re just getting started or ready to go deeper,
            Pentasent offers flexible plans to support your wellness journey
            at your own pace, on your own terms.
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden"
            >
              {/* TOP SECTION */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-full ${plan.iconBg} flex items-center justify-center`}>
                    <Check className={`w-5 h-5 ${plan.iconColor}`} />
                  </div>
                  <span className="text-lg font-medium text-gray-800">
                    {plan.name}
                  </span>
                </div>

                <h3 className="text-4xl font-semibold text-[#3c2a34] mb-2">
                  {plan.price}
                </h3>

                <p className="text-gray-500 text-sm mb-8">
                  {plan.subtitle}
                </p>
                <a href={plan.link}>
                <button className="w-full py-3 rounded-full bg-[#4b2a3f] text-white font-medium hover:opacity-90 transition">
                  {plan.button}
                </button>
                </a>
              </div>

              {/* FEATURE SECTION */}
              <div className={`${plan.featureBg} p-8 flex-1`}>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                      <div className={`w-6 h-6 rounded-full ${plan.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className={`w-4 h-4 ${plan.iconColor}`} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}