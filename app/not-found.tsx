"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    function ImageNumber({ image }: { image: string }) {
        return (
            <div
                className="text-[90px] sm:text-[120px] md:text-[200px] font-black leading-none"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                4
            </div>
        );
    }

    function ZeroImageMosaic() {
        const tiles = 16;

const images = [
  // 🧘 Meditation
  "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/4325466/pexels-photo-4325466.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/8436587/pexels-photo-8436587.jpeg?auto=compress&cs=tinysrgb&w=600",

  // 🧘‍♀️ Yoga
  "https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/8436546/pexels-photo-8436546.jpeg?auto=compress&cs=tinysrgb&w=600",

  // 🌿 Nature Calm
  "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/158607/cairn-fog-mystical-background-158607.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=600",

  // 🌸 Flowers
  "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1022923/pexels-photo-1022923.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=600",

  // 🕉 Spiritual / Divine Vibe
  "https://images.pexels.com/photos/2088170/pexels-photo-2088170.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/35600/road-sun-rays-path.jpg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=600",
];

        return (
            <div className="relative flex items-center justify-center 
                    w-[90px] h-[90px] 
                    sm:w-[130px] sm:h-[130px] 
                    md:w-[200px] md:h-[200px]">

                <motion.div
                    className="relative w-full h-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 70,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {images.slice(0, tiles).map((image, i) => {
                        const angle = (i / tiles) * 2 * Math.PI;

                        // radius as percentage of container
                        const radius = 35; // percent of width

                        return (
                            <motion.div
                                key={i}
                                className="absolute 
                         w-[18px] h-[18px] 
                         sm:w-[28px] sm:h-[28px] 
                         md:w-[44px] md:h-[44px]"
                                style={{
                                    left: `calc(50% + ${Math.cos(angle) * radius}%)`,
                                    top: `calc(50% + ${Math.sin(angle) * radius}%)`,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <motion.div
                                    className="w-full h-full overflow-hidden rounded-md md:rounded-xl shadow-md"
                                    animate={{ rotate: -360 }}
                                    transition={{
                                        duration: 70,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt="wellness"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white backdrop-blur supports-[backdrop-filter]:bg-background/90 flex items-center justify-center p-4">
            <div className="text-center">
                {/* Animated 404 Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    {/* <div className="text-[150px] md:text-[200px] font-bold text-[#4b2a3f] select-none">
                        404
                    </div> */}
                    <div className="flex items-center justify-center gap-6 select-none">
                        <ImageNumber image="/images/404/4_1.png" />
                        <ZeroImageMosaic />
                        <ImageNumber image="/images/404/4_2.png" />
                    </div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-4 mt-8"
                >
                    <h1 className="text-4xl font-bold text-[#3c2a34]">Page Not Found</h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Oops! The page you're looking for seems to have wandered off into the digital wilderness.
                    </p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-[#3d2f4d] text-white px-8 py-3.5 flex items-center justify-center gap-2 rounded-full text-[15px] font-medium hover:bg-[#2d1f3d] transition-all">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </button>
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto bg-white text-gray-700 px-8 py-3.5 flex items-center justify-center gap-2 rounded-full text-[15px] font-medium hover:bg-gray-50 transition-all border border-gray-200"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Reload the page
                    </button>
                </motion.div>

                {/* Animated Background Elements */}
                <div className="fixed inset-0 -z-10 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            suppressHydrationWarning
                            key={i}
                            className="absolute bg-[#4b2a3f]/5 rounded-full"
                            style={{
                                width: Math.random() * 100 + 50,
                                height: Math.random() * 100 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, Math.random() * 100 - 50],
                                x: [0, Math.random() * 100 - 50],
                                scale: [1, Math.random() + 0.5],
                            }}
                            transition={{
                                duration: Math.random() * 5 + 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}