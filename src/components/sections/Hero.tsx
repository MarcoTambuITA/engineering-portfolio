"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// ===== SOCIAL ICONS =====

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

// ===== TYPEWRITER HOOK =====

const PHRASES = [
  "Electrical Engineering Student",
  "Hardware & Embedded Systems",
  "RF & Power Electronics",
];

function useTypewriter(phrases: string[], typingSpeed = 80, deletingSpeed = 40, pauseMs = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing
      setDisplayText(currentPhrase.substring(0, displayText.length + 1));

      if (displayText.length === currentPhrase.length) {
        // Pause then start deleting
        setTimeout(() => setIsDeleting(true), pauseMs);
        return;
      }
    } else {
      // Deleting
      setDisplayText(currentPhrase.substring(0, displayText.length - 1));

      if (displayText.length === 0) {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }
  }, [displayText, isDeleting, phraseIndex, phrases, pauseMs]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return displayText;
}

// ===== HERO COMPONENT =====

export default function Hero() {
  const typedText = useTypewriter(PHRASES);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/50 to-navy-900" />

      {/* Floating accent orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-electric-500/5 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-electric-600/3 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center section-container"
      >
        <motion.p
          variants={childVariants}
          className="text-electric-400 font-mono text-sm md:text-base mb-4 tracking-wider"
        >
          Hello, I&apos;m
        </motion.p>

        <motion.h1
          variants={childVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6"
        >
          Marco Tamburini
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          variants={childVariants}
          className="h-10 md:h-12 flex items-center justify-center mb-4"
        >
          <span className="text-xl md:text-2xl text-gray-300 font-light">
            {typedText}
          </span>
          <span className="ml-0.5 w-0.5 h-6 md:h-7 bg-electric-400 animate-typewriter-blink" />
        </motion.div>

        <motion.p
          variants={childVariants}
          className="text-gray-500 text-base md:text-lg mb-10"
        >
          University of South Florida · Class of 2029
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={childVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 bg-electric-500 hover:bg-electric-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-electric-500/25"
          >
            View My Work
          </a>
          {/* TODO: Replace # with /resume.pdf when ready */}
          <a
            href="#"
            className="px-8 py-3.5 border border-navy-500 hover:border-electric-500/50 text-gray-300 hover:text-white font-semibold rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            Download Resume
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={childVariants}
          className="flex items-center justify-center gap-6"
        >
          <a
            href="https://github.com/MarcoTambuITA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-electric-400 transition-colors duration-200"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/marco-tamburini31/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-electric-400 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="mailto:marcotamburini@usf.edu"
            className="text-gray-500 hover:text-electric-400 transition-colors duration-200"
            aria-label="Email"
          >
            <EmailIcon />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-9 border-2 border-gray-600 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-gray-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
