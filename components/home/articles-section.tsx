'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function ArticlesSection() {
  const categories = ['Sleep', 'Meditation', 'Mind', 'Yoga'];

  const articles = [
    {
      category: 'Mind',
      title: 'Why Your Mind Won’t Stop Thinking at Night (And 7 Ways to Fix It)',
      description:
        'Your brain has a hard time switching off at night. Here’s how to quiet the noise and drift off peacefully.',
      image:
        '/images/articles/1.svg',
    },
    {
      category: 'Meditation',
      title: 'The 4-7-8 Breathing Technique: The Fastest Way to Calm Your Mind',
      description:
        'A simple breathing exercise that can help you fall asleep in under 60 seconds.',
      image:
        '/images/articles/2.svg',
    },
    {
      category: 'Sleep',
      title: 'How to Fall Asleep in 5 Minutes: Science-Backed Methods That Work',
      description:
        'Tried everything? These science-backed techniques can help you fall asleep faster than you ever thought possible.',
      image:
        '/images/articles/4.svg',
    },
  ];

  return (
    <section className="bg-[#fff1f6] py-20" id='articles'>
      <div className="max-w-6xl mx-auto px-6">

        {/* ===== Heading ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#3c2a34] leading-tight max-w-3xl mx-auto">
            Answers for the questions<br />
            no one told you to expect
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base">
            Recommended by health experts and loved by humans seeking clarity,
            comfort, and connection during a transformative chapter of life.
          </p>
        </motion.div>

        {/* ===== Category Pills ===== */}
        <div className="flex justify-center gap-3 flex-wrap mb-14">
          {categories.map((cat, index) => (
            <a href='/articles' key={cat}>
            <button
              className={`px-5 py-2 rounded-full text-sm transition
                ${
                  index === 0
                    ? 'bg-[#3e2f7d] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
            >
              {cat}
            </button>
            </a>
          ))}
        </div>

        {/* ===== Article Cards ===== */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 relative">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden mb-5">
                <Image 
                  src={article.image}
                  alt={article.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  width={500}
                  height={500}
                  />
              </div>

                {/* Category Tag */}
                <span className=" bg-[#3e2f7d] text-white text-xs px-3 py-1 rounded-full">
                  {article.category}
                </span>

              {/* Text */}
              <h3 className="text-xl mt-4 font-light text-[#2e2626] leading-snug mb-3">
                {article.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {article.description}
              </p>
            </motion.div>
          ))}
          
              {/* ===== Bottom Fade Overlay ===== */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#fff1f6] to-transparent pointer-events-none"></div>
    
        </div>

                {/* ===== Center Button ===== */}
        <div className="flex justify-center -mt-8 relative">

          <a href='/articles'>
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