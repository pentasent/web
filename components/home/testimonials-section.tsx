'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Simran',
      role: '42 years old',
      image: '/images/users/user1.svg',
      text: "I feel held, informed, and finally… like I'm not the only one.",
      rating: 5
    },
    {
      name: 'Lena',
      role: '26 years old',
      image: '/images/users/user4.svg',
      text: "I used to feel like I was just guessing about my energy, my sleep, even what to eat. Now, I see patterns. I trust myself more. It's been a shift.",
      rating: 5
    },
    {
      name: 'Carla',
      role: '32 years old',
      image: '/images/users/user3.svg',
      text: "I thought I was just supposed to deal with it the mood swings, the fatigue. Pentasent helped me understand what was going on and take steps that actually helped.",
      rating: 5
    },
    {
      name: 'Jatin',
      role: '35 years old',
      image: '/images/users/user6.svg',
      text: "What I love most is how the app doesn't try to fix me. It simply gives me the tools to feel more aware, more at ease, and more in control.",
      rating: 5
    },
    {
      name: 'Elena',
      role: '24 years old',
      image: '/images/users/user5.svg',
      text: "Pentasent didn't just help me track symptoms. It gave me a sense of direction.",
      rating: 5
    },
    {
      name: 'Anita',
      role: '40 years old',
      image: '/images/users/user7.svg',
      text: "I didn't even realize how much I needed a space like this where I could track how I feel and not be judged for it. It's practical, but also really kind.",
      rating: 5
    }
  ];

  return (
    <section className="relative overflow-hidden bg-[#fff1f6] py-20 lg:py-28">

      {/* ===== Background Soft Blob SVG ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <svg
          viewBox="0 0 800 600"
          className="absolute left-[-200px] top-0 w-[800px] opacity-40"
          fill="none"
        >
          <circle cx="400" cy="300" r="300" fill="#f6d6da" />
        </svg>

        <svg
          viewBox="0 0 800 600"
          className="absolute right-[-250px] bottom-[-200px] w-[800px] opacity-40"
          fill="none"
        >
          <circle cx="400" cy="300" r="300" fill="#f3c9cf" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* ===== Header ===== */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#3d253b] leading-tight">
            Humans who&apos;ve found their<br />rhythm again
          </h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Recommended by health experts and loved by humans seeking clarity,
            comfort, and connection during a transformative chapter of life.
          </p>
        </div>

        {/* ===== Masonry Layout ===== */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 relative max-h-[850px] overflow-hidden">

          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="break-inside-avoid mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#f4a5a8] text-[#f4a5a8]" />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                &quot;{testimonial.text}&quot;
              </p>

              <div className="flex items-center gap-3">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* ===== Bottom Fade Overlay ===== */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#fff1f6] to-transparent pointer-events-none"></div>
        </div>

        {/* ===== Center Button ===== */}
        <div className="flex justify-center -mt-8 relative">
          <a href='/signin'>
          <button className="flex justify-center items-center gap-2 bg-white text-gray-700 hover:text-gray-900 font-medium group w-fit border-2 border-gray-200 py-2.5 px-5 rounded-full">
            Show all
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          </a>
        </div>

      </div>
    </section>
  );
}
