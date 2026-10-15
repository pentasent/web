"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Button } from "@/components/ui/button";

export function InstallPrompt() {
  const { isInstallable, showPrompt, handleInstallClick } = useInstallPrompt();
  const [delayedShow, setDelayedShow] = useState(false);

  useEffect(() => {
    if (isInstallable && showPrompt) {
      const timer = setTimeout(() => setDelayedShow(true), 10000); // 3s delay
      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [isInstallable, showPrompt]);

  // if (!delayedShow) return null;
  if (!isInstallable || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-60"
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <Download className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Install App</h3>
            <p className="text-sm text-primary-text dark:text-gray-300 mb-4">
              Install our app for a better experience, offline access, and quick access to all features.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="default"
                onClick={() => handleInstallClick(false)}
                className="flex-1 p-5"
              >
                Install Now
              </Button>
              <Button
                variant="outline"
                onClick={() => handleInstallClick(true)}
                className="flex-1 p-5"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}











// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { Download } from "lucide-react";
// import { useInstallPrompt } from "@/hooks/useInstallPrompt";
// import { Button } from "@/components/ui/button";

// export function InstallPrompt() {
//   const { isInstallable, showPrompt, handleInstallClick } = useInstallPrompt();

//   if (!isInstallable || !showPrompt) return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 50 }} 
//         className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50"
//       >
        
//         <div className="flex items-start gap-4">
//           <div className="flex-shrink-0">
//             <Download className="w-6 h-6 text-primary" />
//           </div>
//           <div className="flex-1">
//             <h3 className="font-semibold text-lg mb-1">Install App</h3>
//             <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
//               Install our app for a better experience, offline access, and quick access to all features.
//             </p>
//             <div className="flex gap-2">
//               <Button
//                 variant="default"
//                 onClick={() => handleInstallClick(false)}
//                 className="flex-1"
//               >
//                 Install Now
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => handleInstallClick(true)}
//                 className="flex-1"
//               >
//                 Maybe Later
//               </Button>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }