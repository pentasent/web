'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Brain,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Users,
  BookOpen,
  CheckSquare,
  Flower2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

const tabs = [
  { id: 'communities', label: 'Communities', icon: Users },
  { id: 'journaling', label: 'Journaling', icon: BookOpen },
  { id: 'taskmanagement', label: 'Task Management', icon: CheckSquare },
  { id: 'meditation', label: 'Meditation', icon: Brain },
  { id: 'musicbeats', label: 'Music & Beats', icon: Headphones },
  { id: 'yogaguide', label: 'Yoga Guide', icon: Activity },
];

const content = {
  communities: {
    badge: 'Communities',
    badgeColor: 'bg-[#e78886]',
    title: 'Meaningful connection, designed for growth.',
    icon: Users,
    link: '/app/community',
    linktext: "Learn More",
    description:
      'Curated wellness communities where conversations stay intentional. Share progress, ask questions, and evolve alongside others walking a similar path.',
    features: [
      { icon: Users, text: 'Interest-based private communities.' },
      { icon: CheckCircle2, text: 'Post reflections and engage in threads.' },
      { icon: CheckCircle2, text: 'Focused, distraction-free discussions.' },
    ],
    image: '/images/community_1.png',
    cards: [
      { label: 'Active Members', value: '2,400+', color: 'from-[#e78886] to-[#f4a09e]', icon: '👥' },
      { label: 'Daily Posts', value: '120+', color: 'from-[#f4a09e] to-[#e78886]', icon: '💬' },
      { label: 'Support Threads', value: '85 Open', color: 'from-[#e78886] to-[#d97774]', icon: '🌸' },
    ],
  },

  journaling: {
    badge: 'Journaling',
    badgeColor: 'bg-[#95936e]',
    title: 'Clarity begins with reflection.',
    icon: BookOpen,
    link: '/app/journal',
    linktext: "Learn More",
    description:
      'Structured journaling to track mood, energy, and personal insights. Identify patterns and build intentional awareness over time.',
    features: [
      { icon: BookOpen, text: 'Guided reflection prompts.' },
      { icon: CheckCircle2, text: 'Mood and energy tracking.' },
      { icon: CheckCircle2, text: 'Build daily reflection streaks.' },
    ],
    image: '/images/journal_1.png',
    cards: [
      { label: 'Today’s Entry', value: 'Completed', color: 'from-[#95936e] to-[#c7a1f1]', icon: '📖' },
      { label: 'Mood', value: 'Calm', color: 'from-[#c7a1f1] to-[#b493e0]', icon: '🌿' },
      { label: 'Streak', value: '14 Days', color: 'from-[#b493e0] to-[#95936e]', icon: '🔥' },
    ],
  },

  taskmanagement: {
    badge: 'Task Management',
    badgeColor: 'bg-[#78bfa0]',
    title: 'Calm productivity, without burnout.',
    icon: CheckSquare,
    link: '/app/tasks',
    linktext: "Learn More",
    description:
      'Plan tasks, manage habits, and align your day with intention. Stay structured while protecting your energy.',
    features: [
      { icon: CheckSquare, text: 'Structured daily task lists.' },
      { icon: CheckCircle2, text: 'Habit tracking with insights.' },
      { icon: CheckCircle2, text: 'Completion analytics and progress view.' },
    ],
    image: '/images/task_1.png',
    cards: [
      { label: 'Tasks Completed', value: '5 / 7', color: 'from-[#78bfa0] to-[#9bd3bb]', icon: '✅' },
      { label: 'Habits', value: '3 / 4', color: 'from-[#9bd3bb] to-[#63a98b]', icon: '📊' },
      { label: 'Focus Time', value: '2h 20m', color: 'from-[#63a98b] to-[#78bfa0]', icon: '⏳' },
    ],
  },

  meditation: {
    badge: 'Meditation',
    badgeColor: 'bg-[#e28ab2]',
    title: 'Pause. Breathe. Reset your nervous system.',
    icon: Brain,
    link: '/app/meditation',
    linktext: "Learn More",
    description:
      'Guided meditation sessions crafted to reduce stress, strengthen emotional balance, and create sustainable calm.',
    features: [
      { icon: Brain, text: 'Guided mindfulness sessions.' },
      { icon: CheckCircle2, text: 'Track meditation consistency.' },
      { icon: CheckCircle2, text: 'Short sessions for busy days.' },
    ],
    image: '/images/meditation_1.png',
    cards: [
      { label: 'Today’s Session', value: '12 min', color: 'from-[#e28ab2] to-[#f19fc5]', icon: '🧘‍♀️' },
      { label: 'Weekly Streak', value: '5 Days', color: 'from-[#f19fc5] to-[#d678a3]', icon: '📅' },
      { label: 'Calm Score', value: '82%', color: 'from-[#d678a3] to-[#e28ab2]', icon: '🧠' },
    ],
  },

  musicbeats: {
    badge: 'Music & Beats',
    badgeColor: 'bg-[#419ebe]',
    title: 'Shift your state with sound.',
    icon: Headphones,
    link: '/app/beats',
    linktext: "Learn More",
    description:
      'Curated focus beats and ambient soundscapes to elevate productivity, meditation, and relaxation.',
    features: [
      { icon: Headphones, text: 'Focus-enhancing audio sessions.' },
      { icon: CheckCircle2, text: 'Ambient and calming soundscapes.' },
      { icon: CheckCircle2, text: 'Mood-based playlists.' },
    ],
    image: '/images/music_2.png',
    cards: [
      { label: 'Now Playing', value: 'Deep Focus', color: 'from-[#419ebe] to-[#a8c8ef]', icon: '🎧' },
      { label: 'Session Time', value: '40 min', color: 'from-[#a8c8ef] to-[#7aa6d9]', icon: '⏱️' },
      { label: 'Mood', value: 'Focused', color: 'from-[#7aa6d9] to-[#419ebe]', icon: '🎶' },
    ],
  },

  yogaguide: {
    badge: 'Yoga Guide',
    badgeColor: 'bg-[#c7956e]',
    title: 'Move with awareness and strength.',
    icon: Activity,
    link: '/beta-release',
    linktext: "Learn More",
    description:
      'Structured yoga flows and breathwork designed to support flexibility, hormonal balance, and long-term vitality.',
    features: [
      { icon: Flower2, text: 'Guided asana sequences.' },
      { icon: CheckCircle2, text: 'Pranayama breathing sessions.' },
      { icon: CheckCircle2, text: 'Track practice consistency.' },
    ],
    image: '/images/yoga_1.png',
    cards: [
      { label: 'Today’s Flow', value: '25 min', color: 'from-[#c7956e] to-[#cea07e]', icon: '🧘' },
      { label: 'Breathwork', value: '10 min', color: 'from-[#cea07e] to-[#b6845f]', icon: '🌬️' },
      { label: 'Weekly Practice', value: '3 Sessions', color: 'from-[#b6845f] to-[#c7956e]', icon: '📆' },
    ],
  },
};

export default function FeatureSection() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeTab, setActiveTab] = useState('communities');

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section className="pt-20 lg:pt-28" id='features'>

      {/* HEADER */}

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-light text-[#3c2a34] mb-10"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Everything You Need in One App
          </h2>

          {/* TABS */}
          <div className="flex justify-center">
            <div className="flex gap-3 bg-gray-100 rounded-full overflow-x-auto custom-scrollbar p-3 md:p-4 whitespace-nowrap scroll-smooth mx-auto">
              <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      scrollToSection(tab.id);
                    }}
                    className={`flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap ${isActive
                      ? 'bg-[#f49fa2] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECTIONS */}
      <>

        {Object.entries(content).map(([key, section], index) => {
          const isReverse = index % 2 !== 0;
          const rawColor = section.badgeColor.replace('bg-[', '').replace(']', '');
          const MainIcon = section.icon;

          return (
            <section
              key={key}
              id={key}
              ref={(el) => (sectionRefs.current[key] = el)}
              className=""
            >
              {/* FULL WIDTH LIGHT BACKGROUND */}
              <div
                style={{ backgroundColor: `${rawColor}15` }}
                className="w-full"
              >
                {/* WHITE MAIN CARD */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20">

                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-white rounded-3xl p-10 md:p-14 lg:p-16 shadow-sm overflow-hidden"
                  >
                    {/* Soft Gradient Pile Background */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">

                      {/* First Big Pile */}
                      <div
                        className="absolute -top-20 -left-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 animate-float-slow"
                        style={{
                          background: `radial-gradient(circle at center, ${rawColor} 0%, transparent 70%)`,
                        }}
                      />

                      {/* Second Pile */}
                      <div
                        className="absolute bottom-[-300px] right-[-250px] w-[700px] h-[700px] rounded-full blur-3xl opacity-20 animate-float-reverse"
                        style={{
                          background: `radial-gradient(circle at center, ${rawColor} 0%, transparent 70%)`,
                        }}
                      />

                    </div>
                    <div
                      className={`grid lg:grid-cols-2 gap-16 items-center ${isReverse ? 'lg:[&>*:first-child]:order-2' : ''
                        }`}
                    >

                      {/* CONTENT */}
                      <div className="flex flex-col justify-center">
                        <div className='inline-flex items-center gap-4'>
                          <div
                            className={` ${section.badgeColor} text-white rounded-full px-2 py-2 text-sm font-medium mb-6 w-fit`}
                          >
                            <MainIcon
                              className="min-w-4 min-h-4 p-0.5"
                            />
                            {/* {section.badge} */}
                          </div>
                          <h4
                            className="text-xl md:text-2xl font-light text-gray-900 mb-6 leading-tight"
                            style={{ fontFamily: 'Georgia, serif' }}
                          >
                            {section.badge}
                          </h4>
                        </div>
                        <h3
                          className="text-3xl md:text-4xl font-light text-gray-900 mb-6 leading-tight"
                          style={{ fontFamily: 'Georgia, serif' }}
                        >
                          {section.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed mb-8">
                          {section.description}
                        </p>

                        <div className="space-y-4 mb-8">
                          {section.features.map((feature, i) => {
                            const Icon = feature.icon;

                            // Extract raw hex from badgeColor (bg-[#xxxxxx])
                            const rawColor = section.badgeColor.replace('bg-[', '').replace(']', '');

                            return (
                              <div key={i} className="flex items-start gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                                  style={{
                                    backgroundColor: `${rawColor}20`, // light tint
                                  }}
                                >
                                  <Icon
                                    className="w-4 h-4"
                                    style={{
                                      color: rawColor, // main section color
                                    }}
                                  />
                                </div>

                                <p className="text-gray-700 leading-relaxed">
                                  {feature.text}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        <Link href={section.link}>
                        <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium group w-fit border-2 border-gray-100 py-2.5 px-5 rounded-full">
                          {section.linktext}
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        </Link>
                      </div>

                      {/* IMAGE */}
                      <div>
                        <div className="relative w-full">
                          <div className="rounded-3xl overflow-hidden shadow-xl">
                            <Image
                              src={section.image}
                              alt={section.badge}
                              className="w-full h-[420px] md:h-[500px] object-cover"
                              width={600}
                              height={600}
                            />
                          </div>

                          {/* FLOATING COLORED CARDS (UNCHANGED) */}
                          <div className="absolute bottom-8 right-8 left-8 space-y-4">
                            {section.cards.map((card, i) => {
                              const intensity =
                                i === 0
                                  ? "from-white/40 via-white/20 to-white/10"
                                  : i === 1
                                    ? "from-white/30 via-white/15 to-white/5"
                                    : "from-white/25 via-white/10 to-transparent";

                              return (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: 20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.4, delay: i * 0.12 }}
                                  className={`
          relative
          bg-gradient-to-br ${card.color}
          ${intensity}
          backdrop-blur-xl
          rounded-full
          p-2
          shadow-2xl
          border border-white/30
          flex items-center justify-between
          overflow-hidden
          md:w-3/4
        `}
                                >
                                  {/* Soft Glow Overlay */}
                                  <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none" />

                                  <div className="relative flex items-center gap-3">
                                    {card.icon && (
                                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-lg shadow-md">
                                        {card.icon}
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-sm font-semibold text-gray-900">
                                        {card.label}
                                      </div>
                                      <div className="text-xs text-gray-800">
                                        {card.value}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>

                </div>
              </div>
            </section>
          );
        })}

      </>
    </section>
  );
}