"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

const LOADING_QUOTES: string[] = [
  "Stillness is where clarity begins.",
  "Take a breath. Your mind will thank you.",
  "Growth starts with a single mindful moment.",
  "Peace comes when the mind slows down.",
  "A calm mind sees the world clearly.",
  "Balance your thoughts, balance your life.",
  "Every pause is a chance to reset.",
]

interface OrbitProps {
  radius: number
  count: number
  size: number
  opacity: number
  duration: number
  reverse?: boolean
}

function Orbit({
  radius,
  count,
  size,
  opacity,
  duration,
  reverse = false
}: OrbitProps) {
  const dots = Array.from({ length: count })

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {dots.map((_, i) => {
        const angle = (360 / count) * i
        return (
          <div
            key={i}
            className="absolute rounded-full bg-[#3c2a34]"
            style={{
              width: size,
              height: size,
              opacity,
              transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
            }}
          />
        )
      })}
    </motion.div>
  )
}

export const GlobalLayout = () => {
  const [quote, setQuote] = useState<string | null>(null)

  useEffect(() => {
    setQuote(
      LOADING_QUOTES[Math.floor(Math.random() * LOADING_QUOTES.length)]
    )
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-warm-50">
    {/* <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f6f1ed]"> */}

      <div className="flex flex-col items-center">

        <div className="relative w-[220px] h-[220px] flex items-center justify-center">

          {/* orbit layers */}
          <Orbit radius={40} count={6} size={6} opacity={0.9} duration={6} />
          <Orbit radius={70} count={10} size={5} opacity={0.6} duration={10} reverse />
          <Orbit radius={100} count={14} size={4} opacity={0.35} duration={16} />

          {/* center logo */}
          <Image
            src="/images/penta_logo.svg"
            alt="Pentasent"
            width={64}
            height={64}
            priority
            className="z-10 rounded-full"
          />

        </div>

        <div className="h-14 flex items-center mt-12">
          {quote && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="text-[#6b4c3b] italic text-sm max-w-xs text-center"
            >
              “{quote}”
            </motion.p>
          )}
        </div>

      </div>
    </div>
  )
}

// "use client"

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// const LOADING_QUOTES = [
//   "Stillness is where clarity begins.",
//   "Take a breath. Your mind will thank you.",
//   "Growth starts with a single mindful moment.",
//   "Peace comes when the mind slows down.",
//   "A calm mind sees the world clearly.",
//   "Balance your thoughts, balance your life.",
//   "Every pause is a chance to reset.",
// ];

// export const GlobalLayout = () => {
//     const [quote, setQuote] = useState<string | null>(null);

//     useEffect(() => {
//         setQuote(
//             LOADING_QUOTES[Math.floor(Math.random() * LOADING_QUOTES.length)]
//         );
//     }, []);

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-[#fffbf7] overflow-hidden w-full">

//             <div className="relative flex flex-col items-center text-center px-6">

//                 {/* ambient glow */}
//                 <div className="absolute w-72 h-72 bg-[#3c2a34]/10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />

//                 {/* breathing logo */}
//                 <motion.img
//                     src="/images/penta_logo.svg"
//                     alt="Pentasent"
//                     fetchPriority="high"
//                     className="w-20 h-20 relative z-10 rounded"
//                     initial={{ opacity: 0 }}
//                     animate={{
//                         opacity: 1,
//                         scale: [1, 1.08, 1]
//                     }}
//                     transition={{
//                         opacity: { duration: 0.4 },
//                         scale: {
//                             duration: 2,
//                             repeat: Infinity,
//                             ease: "easeInOut"
//                         }
//                     }}
//                 />

//                 {/* quote */}
//                 {quote && (
//                     <motion.p
//                         initial={{ opacity: 0, y: 8 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6 }}
//                         className="mt-6 text-warm-600 text-sm italic max-w-xs leading-relaxed"
//                     >
//                         “{quote}”
//                     </motion.p>
//                 )}

//             </div>

//         </div>
//     );
// };
