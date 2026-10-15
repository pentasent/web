"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ClockTime() {
    const getCurrentTime = () => {
        return new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const [time, setTime] = useState(getCurrentTime());
    const [location, setLocation] = useState({ city: "💖 ", country: "From India" });
    const [showLocation, setShowLocation] = useState(true); // Default to true

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(getCurrentTime());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                    .then(response => response.json())
                    .then(data => {
                        const city = data.address.state_district || data.address.county || "💖";
                        const country = ", " + data.address.country || "From India";

                        setShowLocation(false); // Temporarily hide for animation
                        setTimeout(() => {
                            setLocation({ city, country });
                            setShowLocation(true); // Show with animation
                        }, 300);
                    })
                    .catch(error => console.error("Error fetching location:", error));
            },
            (error) => {
                // console.error("Geolocation error:", error ? error : "");
                // If permission is denied, update location
                if (error.code === error.PERMISSION_DENIED) {
                    // setLocation({ city: "💖", country: " Location Blocked" });
                }
                setShowLocation(true); // Ensure "💖 From India" is visible if geolocation fails
            }
        );
    }, []);

    return (
        <div className="text-right">
            <motion.p
                className="text-sm text-gray-300"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: showLocation ? 1 : 0, y: showLocation ? 0 : -5 }}
                transition={{ duration: 0.5 }}
            >
                {location.city}{location.country}
            </motion.p>
            <p className="text-[13px] font-bold text-gray-300">{time}</p>
        </div>
    );
}

