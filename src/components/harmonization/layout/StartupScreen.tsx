import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface StartupScreenProps {
  onComplete: () => void;
}



export function StartupScreen({ onComplete }: StartupScreenProps) {
  const [currentStage, setCurrentStage] = useState<'logo' | 'title' | 'keywords' | 'complete'>('logo');
  const [showParticles, setShowParticles] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState(0);

  const keywords = ['Data Integration', 'Data Standardization', 'Data Mapping'];
  
  // Generate distinct random positions for each keyword (well-separated locations)
  const keywordPositions = [
    { top: '15%', left: '10%', rotate: -12 },
    { top: '50%', left: '70%', rotate: 15 },
    { top: '75%', left: '20%', rotate: -8 }
  ];



  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowParticles(true);
      setCurrentStage('title');
    }, 1200);

    const timer2 = setTimeout(() => {
      setCurrentStage('keywords');
    }, 2800);

    const timer3 = setTimeout(() => {
      setCurrentStage('complete');
    }, 5300); // Extended to ensure 3rd keyword gets full time (2.8s + 2.5s = 5.3s)

    const timer4 = setTimeout(() => {
      // Complete startup after animation
      onComplete();
    }, 7800); // Extended for logo shine + 2s wait (5.3s + 2.5s = 7.8s)

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  // Cycle through keywords when in keywords stage - extended by 500ms each
  useEffect(() => {
    if (currentStage === 'keywords') {
      const keywordTimer = setInterval(() => {
        setCurrentKeyword((prev) => (prev + 1) % keywords.length);
      }, 700); // Increased from 500ms to 700ms (200ms more per keyword)

      return () => clearInterval(keywordTimer);
    }
  }, [currentStage, keywords.length]);

  // Particle component for animated background
  const Particle = ({ index }: { index: number }) => {
    const randomDelay = Math.random() * 2;
    const randomDuration = 3 + Math.random() * 2;
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomSize = 2 + Math.random() * 4;

    return (
      <motion.div
        className="absolute bg-[#007fd4] rounded-full opacity-30"
        style={{
          width: randomSize,
          height: randomSize,
          left: `${randomX}%`,
          top: `${randomY}%`,
        }}
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: randomDuration,
          delay: randomDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1e1e1e] via-[#252526] to-[#1e1e1e] z-50 flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#007fd4]/10 via-transparent to-[#4CAF50]/10"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(0, 127, 212, 0.1) 0%, transparent 50%, rgba(76, 175, 80, 0.1) 100%)',
            'linear-gradient(225deg, rgba(76, 175, 80, 0.1) 0%, transparent 50%, rgba(0, 127, 212, 0.1) 100%)',
            'linear-gradient(45deg, rgba(0, 127, 212, 0.1) 0%, transparent 50%, rgba(76, 175, 80, 0.1) 100%)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particle background */}
      {showParticles && (
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, index) => (
            <Particle key={index} index={index} />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          {currentStage === 'logo' && (
            <motion.div
              key="logo"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              {/* Animated logo with pulse effect */}
              <motion.div
                className="relative inline-block"
                animate={{ 
                  rotateY: [0, 180, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotateY: { duration: 2, ease: "easeInOut" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Pulsing ring background */}
                <motion.div
                  className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#007fd4]/30 to-[#4CAF50]/30 pulse-ring"
                />
                
                <motion.div 
                  className="relative w-24 h-24 bg-gradient-to-br from-[#007fd4] to-[#4CAF50] rounded-full flex items-center justify-center shadow-2xl glow-animation"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(0, 127, 212, 0.3), 0 0 40px rgba(0, 127, 212, 0.2), 0 0 60px rgba(0, 127, 212, 0.1)",
                      "0 0 30px rgba(76, 175, 80, 0.3), 0 0 50px rgba(76, 175, 80, 0.2), 0 0 70px rgba(76, 175, 80, 0.1)",
                      "0 0 20px rgba(0, 127, 212, 0.3), 0 0 40px rgba(0, 127, 212, 0.2), 0 0 60px rgba(0, 127, 212, 0.1)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.svg 
                    className="w-12 h-12 text-white" 
                    viewBox="0 0 18 18"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.path 
                      d="M12 13.5L16.5 9L12 4.5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    <motion.path 
                      d="M6 4.5L1.5 9L6 13.5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </motion.svg>
                </motion.div>
                
                {/* Orbiting elements */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute w-3 h-3 bg-[#007fd4] rounded-full -top-1 left-1/2 transform -translate-x-1/2" />
                  <div className="absolute w-2 h-2 bg-[#4CAF50] rounded-full top-1/2 -right-1 transform -translate-y-1/2" />
                  <div className="absolute w-2 h-2 bg-[#ff9800] rounded-full -bottom-1 left-1/2 transform -translate-x-1/2" />
                  <div className="absolute w-3 h-3 bg-[#9c27b0] rounded-full top-1/2 -left-1 transform -translate-y-1/2" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {currentStage === 'title' && (
            <motion.div
              key="title"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              {/* Logo (smaller version) with floating animation */}
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-[#007fd4] to-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl float-animation"
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(0, 127, 212, 0.4)",
                    "0 0 25px rgba(76, 175, 80, 0.4)",
                    "0 0 15px rgba(0, 127, 212, 0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.svg 
                  className="w-8 h-8 text-white" 
                  viewBox="0 0 18 18"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M12 13.5L16.5 9L12 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M6 4.5L1.5 9L6 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </motion.svg>
              </motion.div>

              {/* Title with typewriter effect */}
              <motion.h1
                className="text-4xl font-light text-[#cccccc] mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0 }}
              >
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="inline-block overflow-hidden whitespace-nowrap"
                >
                  Harmonizer
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg text-[#a0a0a0] mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.7 }}
              >
                Data Harmonization Platform
              </motion.p>

              {/* Loading dots */}
              <motion.div 
                className="flex items-center justify-center space-x-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-3 h-3 bg-[#007fd4] rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {currentStage === 'keywords' && (
            <div className="fixed inset-0 w-full h-full overflow-hidden">
              <motion.div
                key="keywords-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full h-full relative"
              >
              {/* Background logo (centered, small) */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#007fd4] to-[#4CAF50] rounded-full flex items-center justify-center shadow-lg opacity-30"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(0, 127, 212, 0.2)",
                    "0 0 20px rgba(76, 175, 80, 0.2)",
                    "0 0 10px rgba(0, 127, 212, 0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 18 18">
                  <path d="M12 13.5L16.5 9L12 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M6 4.5L1.5 9L6 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </motion.div>

              {/* Randomly positioned cycling keywords - fixed positioning */}
              <motion.div
                key={`keyword-${currentKeyword}`} // More specific key
                className="absolute pointer-events-none"
                style={{
                  position: 'absolute',
                  top: keywordPositions[currentKeyword].top,
                  left: keywordPositions[currentKeyword].left,
                  transformOrigin: 'center center',
                  zIndex: 20,
                }}
                initial={{ 
                  opacity: 0, 
                  scale: 0.2,
                  rotate: keywordPositions[currentKeyword].rotate - 30,
                  y: 80,
                  x: currentKeyword === 0 ? -50 : currentKeyword === 1 ? 50 : -30
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: keywordPositions[currentKeyword].rotate,
                  y: 0,
                  x: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.2,
                  rotate: keywordPositions[currentKeyword].rotate + 30,
                  y: -80,
                  x: currentKeyword === 0 ? 50 : currentKeyword === 1 ? -50 : 30
                }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 80,
                  damping: 12
                }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Floating sparkles around the keyword */}
                  {Array.from({ length: 8 }).map((_, index) => {
                    const angle = (index * 45) * (Math.PI / 180);
                    const radius = 120 + Math.random() * 60;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    return (
                      <motion.div
                        key={index}
                        className="absolute w-2 h-2 bg-gradient-to-r from-[#007fd4] to-[#4CAF50] rounded-full"
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 0.8, 0],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    );
                  })}
                  {/* Keyword text with responsive sizing and glow effect */}
                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-gradient-to-r from-[#007fd4] via-[#4CAF50] to-[#007fd4] bg-clip-text whitespace-nowrap select-none"
                    style={{
                      backgroundSize: '200% 100%',
                      textShadow: '0 0 30px rgba(0, 127, 212, 0.3)',
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {keywords[currentKeyword]}
                  </motion.h2>
                  
                  {/* Enhanced glow behind text */}
                  <motion.div
                    className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-bold text-[#007fd4] opacity-20 blur-md select-none -z-10"
                    animate={{
                      opacity: [0.1, 0.4, 0.1],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {keywords[currentKeyword]}
                  </motion.div>
                  
                  {/* Additional outer glow */}
                  <motion.div
                    className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-bold text-[#4CAF50] opacity-10 blur-lg select-none -z-20"
                    animate={{
                      opacity: [0.05, 0.2, 0.05],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {keywords[currentKeyword]}
                  </motion.div>
                </motion.div>
              </motion.div>

              </motion.div>

              {/* Progress indicator - positioned at bottom center */}
              <motion.div 
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {keywords.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentKeyword ? 'bg-[#007fd4]' : 'bg-[#808080]'
                    }`}
                    animate={{
                      scale: index === currentKeyword ? [1, 1.4, 1] : 1,
                      boxShadow: index === currentKeyword 
                        ? ['0 0 0px rgba(0, 127, 212, 0)', '0 0 15px rgba(0, 127, 212, 0.6)', '0 0 0px rgba(0, 127, 212, 0)']
                        : '0 0 0px rgba(0, 127, 212, 0)',
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>

              {/* Small title indicator at top */}
              <motion.div
                className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-light text-[#cccccc] opacity-70">Harmonizer</h3>
              </motion.div>

            </div>
          )}

          {currentStage === 'complete' && (
            <motion.div
              key="complete"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center flex flex-col items-center justify-center min-h-[60vh] relative"
            >
              {/* Enhanced Harmonizer logo with mega shine effect */}
              <motion.div
                className="relative inline-block mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                }}
                transition={{ 
                  scale: { duration: 0.6, ease: "easeOut" },
                  rotate: { duration: 0.6, ease: "easeOut" }
                }}
              >
                {/* Massive shine ring - outermost */}
                <motion.div
                  className="absolute inset-0 w-32 h-32 -m-6 rounded-full bg-gradient-to-r from-[#007fd4] via-[#4CAF50] to-[#007fd4] opacity-20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 3, 4],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 0.8,
                    ease: "easeOut" 
                  }}
                />
                
                {/* Medium shine ring */}
                <motion.div
                  className="absolute inset-0 w-32 h-32 -m-6 rounded-full bg-gradient-to-r from-[#4CAF50] via-[#007fd4] to-[#4CAF50] opacity-30"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 2, 2.5],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 1.0,
                    ease: "easeOut" 
                  }}
                />

                {/* Inner shine ring */}
                <motion.div
                  className="absolute inset-0 w-32 h-32 -m-6 rounded-full bg-gradient-to-r from-[#007fd4] to-[#4CAF50] opacity-40"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 1.8],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{ 
                    duration: 1.0, 
                    delay: 1.2,
                    ease: "easeOut" 
                  }}
                />

                {/* Main logo with enhanced shine */}
                <motion.div 
                  className="relative w-20 h-20 bg-gradient-to-br from-[#007fd4] to-[#4CAF50] rounded-full flex items-center justify-center shadow-2xl z-10"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(0, 127, 212, 0.3), 0 0 40px rgba(0, 127, 212, 0.2), 0 0 60px rgba(0, 127, 212, 0.1)",
                      "0 0 60px rgba(0, 127, 212, 0.8), 0 0 100px rgba(76, 175, 80, 0.6), 0 0 140px rgba(0, 127, 212, 0.4)",
                      "0 0 30px rgba(76, 175, 80, 0.6), 0 0 50px rgba(76, 175, 80, 0.4), 0 0 70px rgba(76, 175, 80, 0.2)",
                      "0 0 20px rgba(0, 127, 212, 0.3), 0 0 40px rgba(0, 127, 212, 0.2), 0 0 60px rgba(0, 127, 212, 0.1)",
                    ],
                    scale: [1, 1.05, 1.1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 2.0, 
                    delay: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  {/* Rotating inner elements */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute w-2 h-2 bg-white rounded-full -top-1 left-1/2 transform -translate-x-1/2 opacity-80" />
                    <div className="absolute w-1 h-1 bg-white rounded-full top-1/2 -right-1 transform -translate-y-1/2 opacity-60" />
                    <div className="absolute w-1 h-1 bg-white rounded-full -bottom-1 left-1/2 transform -translate-x-1/2 opacity-60" />
                    <div className="absolute w-2 h-2 bg-white rounded-full top-1/2 -left-1 transform -translate-y-1/2 opacity-80" />
                  </motion.div>

                  <motion.svg 
                    className="w-10 h-10 text-white z-20" 
                    viewBox="0 0 18 18"
                    animate={{ 
                      rotate: [0, 10, -10, 5, 0],
                      scale: [1, 1.1, 1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 2.0, 
                      delay: 0.8,
                      ease: "easeInOut" 
                    }}
                  >
                    <motion.path 
                      d="M12 13.5L16.5 9L12 4.5" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 1.0 }}
                    />
                    <motion.path 
                      d="M6 4.5L1.5 9L6 13.5" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                    />
                  </motion.svg>
                </motion.div>

                {/* Sparkle effects around logo */}
                {Array.from({ length: 12 }).map((_, index) => {
                  const angle = (index * 30) * (Math.PI / 180);
                  const radius = 60 + Math.random() * 40;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <motion.div
                      key={index}
                      className="absolute w-3 h-3 bg-gradient-to-r from-[#007fd4] to-[#4CAF50] rounded-full"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 1.0 + index * 0.1,
                        ease: "easeOut",
                      }}
                    />
                  );
                })}
              </motion.div>

              <motion.h1
                className="text-3xl font-light text-[#cccccc] mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <motion.span
                  className="bg-gradient-to-r from-[#007fd4] via-[#4CAF50] to-[#007fd4] bg-clip-text text-transparent"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Harmonizer
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-base text-[#a0a0a0] mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
              >
                Ready to transform your data
              </motion.p>

              {/* Loading indicator - contained within main content area */}
              <motion.div 
                className="flex items-center justify-center space-x-2 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
              >
                {[0, 1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-[#007fd4] rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>


            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#1e1e1e]/40 pointer-events-none" />
    </div>
  );
}