import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "./router.js";

// Hex colors for the Dr Tecno branding
const colors = {
  pink: "#ED4E9D",
  yellow: "#FFD028",
  green: "#37CE7F",
  cyan: "#17CBE0",
  bg: "#0B0C10" // Dark background matching oklch(0.10 0.01 240)
};

/**
 * A highly detailed cybernetic CPU & Tools SVG representing the Dr Tecno brand icons.
 * Features rotating gears, glowing circuits, and crossed micro-soldering tools.
 */
export const LogoIconSVG: React.FC<{ className?: string; size?: number; glow?: boolean }> = ({
  className = "",
  size = 120,
  glow = true
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`${className} ${glow ? "drop-shadow-[0_0_15px_rgba(23,203,224,0.6)]" : ""}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Brand Linear Gradients */}
        <linearGradient id="brand-grad-horizontal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.pink} />
          <stop offset="33%" stopColor={colors.yellow} />
          <stop offset="66%" stopColor={colors.green} />
          <stop offset="100%" stopColor={colors.cyan} />
        </linearGradient>

        <linearGradient id="pink-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.pink} />
          <stop offset="100%" stopColor={colors.cyan} />
        </linearGradient>

        <linearGradient id="yellow-green-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.yellow} />
          <stop offset="100%" stopColor={colors.green} />
        </linearGradient>

        {/* Glow Filters */}
        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Symmetrical Electronic Trace Circles (Orbiting Outer Ring) */}
      <motion.circle
        cx="100"
        cy="100"
        r="85"
        stroke="url(#brand-grad-horizontal)"
        strokeWidth="1.5"
        strokeDasharray="8 6 12 4"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      <motion.circle
        cx="100"
        cy="100"
        r="75"
        stroke={colors.cyan}
        strokeWidth="1"
        strokeDasharray="4 8 2 4"
        opacity="0.6"
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Outer circuit connection nodes (4 primary corners) */}
      <circle cx="100" cy="15" r="4" fill={colors.pink} />
      <circle cx="100" cy="185" r="4" fill={colors.green} />
      <circle cx="15" cy="100" r="4" fill={colors.cyan} />
      <circle cx="185" cy="100" r="4" fill={colors.yellow} />

      {/* Crossed Micro-soldering Tools / Brand symbols */}
      {/* Tool 1: Stylized Tech Wrench / Screwdriver (Diagonal Left) */}
      <motion.g
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.85 }}
        transition={{ delay: 0.1 }}
      >
        <line x1="45" y1="45" x2="155" y2="155" stroke="url(#pink-cyan-grad)" strokeWidth="5" strokeLinecap="round" />
        {/* Wrench head */}
        <path d="M 38 38 C 30 46 32 58 42 62 L 50 54 L 54 50 L 46 42 Z" fill={colors.pink} />
        {/* Tool handle end */}
        <circle cx="155" cy="155" r="5" fill={colors.cyan} />
      </motion.g>

      {/* Tool 2: Stylized Precision Electronic Tweezer / Probe (Diagonal Right) */}
      <motion.g
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.85 }}
        transition={{ delay: 0.15 }}
      >
        <line x1="155" y1="45" x2="45" y2="155" stroke="url(#yellow-green-grad)" strokeWidth="4" strokeLinecap="round" />
        {/* Fine probe tip */}
        <path d="M 155 45 L 165 35 L 170 40 L 160 50 Z" fill={colors.yellow} />
        <circle cx="45" cy="155" r="5" fill={colors.green} />
      </motion.g>

      {/* Central Tech Microchip / CPU */}
      <motion.g
        initial={{ scale: 0.6, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        {/* CPU Outer Pin Contacts (Symmetrical micro pins) */}
        {[-30, -15, 0, 15, 30].map((offset) => (
          <React.Fragment key={offset}>
            {/* Top Pins */}
            <rect x={100 + offset - 3} y="52" width="6" height="10" fill={colors.yellow} rx="1" />
            {/* Bottom Pins */}
            <rect x={100 + offset - 3} y="138" width="6" height="10" fill={colors.green} rx="1" />
            {/* Left Pins */}
            <rect x="52" y={100 + offset - 3} width="10" height="6" fill={colors.pink} rx="1" />
            {/* Right Pins */}
            <rect x="138" y={100 + offset - 3} width="10" height="6" fill={colors.cyan} rx="1" />
          </React.Fragment>
        ))}

        {/* main microchip body */}
        <rect
          x="60"
          y="60"
          width="80"
          height="80"
          rx="12"
          fill={colors.bg}
          stroke="url(#brand-grad-horizontal)"
          strokeWidth="3"
          className="shadow-2xl"
        />

        {/* Inner circuit pattern layout */}
        <rect x="70" y="70" width="60" height="60" rx="6" fill="rgba(255,255,255,0.02)" stroke={colors.cyan} strokeWidth="1" strokeDasharray="3 3" />

        {/* Central Glowing Core Reactor (The "Dr" Logo Circle) */}
        <circle
          cx="100"
          cy="100"
          r="20"
          fill="rgba(23, 203, 224, 0.1)"
          stroke="url(#brand-grad-horizontal)"
          strokeWidth="2"
          filter={glow ? "url(#neon-glow)" : undefined}
        />

        {/* Pulse Core Element */}
        <motion.circle
          cx="100"
          cy="100"
          r="10"
          fill={colors.cyan}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Inner Tech Letter "T" (for Tecno) */}
        <text
          x="100"
          y="105"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="14"
          fontWeight="bold"
          fontFamily="monospace"
        >
          T
        </text>
      </motion.g>
    </svg>
  );
};

/**
 * Official high-fidelity Dr Tecno brand logos in corresponding colors
 */
export const logoImages = {
  cyan: "https://i.postimg.cc/c12bD5L3/Chat-GPT-Image-14-jul-2026-04-00-21-p-m.png",
  green: "https://i.postimg.cc/cHVBc2B1/Chat-GPT-Image-14-jul-2026-04-06-08-p-m.png",
  yellow: "https://i.postimg.cc/qq4z0GkR/Chat-GPT-Image-14-jul-2026-04-10-18-p-m.png",
  pink: "https://i.postimg.cc/B6MGL5T7/Chat-GPT-Image-14-jul-2026-04-15-02-p-m.png"
};

interface BrandShape {
  id: string;
  url: string;
  color: string;
  glowColor: string;
  label: string;
}

const BRAND_SHAPES: BrandShape[] = [
  {
    id: "cyan",
    url: logoImages.cyan,
    color: colors.cyan,
    glowColor: "rgba(23, 203, 224, 0.8)",
    label: "Portal Estrella"
  },
  {
    id: "green",
    url: logoImages.green,
    color: colors.green,
    glowColor: "rgba(55, 206, 127, 0.8)",
    label: "Portal Y-Sintonizador"
  },
  {
    id: "yellow",
    url: logoImages.yellow,
    color: colors.yellow,
    glowColor: "rgba(255, 208, 40, 0.8)",
    label: "Portal Triángulo Núcleo"
  },
  {
    id: "pink",
    url: logoImages.pink,
    color: colors.pink,
    glowColor: "rgba(237, 78, 157, 0.8)",
    label: "Portal Hexágono"
  }
];

/**
 * Root-level full-screen page transition overlay.
 * Uses a dynamic cyber-portal styled with the official logos acting as frames.
 * Plays zoom-in or zoom-out animations with neon outline strokes matching the selected shape.
 */
export const PageTransitionOverlay: React.FC = () => {
  const { path } = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedShape, setSelectedShape] = useState<BrandShape>(BRAND_SHAPES[0]);
  const [zoomDirection, setZoomDirection] = useState<"in" | "out">("out");

  // Trigger page transition whenever path changes
  useEffect(() => {
    // Pick random shape and zoom direction
    const randomIdx = Math.floor(Math.random() * BRAND_SHAPES.length);
    const randomDir = Math.random() > 0.5 ? "in" : "out";
    
    setSelectedShape(BRAND_SHAPES[randomIdx]);
    setZoomDirection(randomDir);
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1500); // 1.5s total duration for a fully-immersive zoom

    return () => clearTimeout(timer);
  }, [path]);

  // Framer Motion Curtain Variants for Portal Entrance/Exit
  const portalBgVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: [0, 1, 1, 0],
      transition: { duration: 1.5, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }
    }
  };

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div 
          key={`portal-${selectedShape.id}-${zoomDirection}`}
          variants={portalBgVariants}
          initial="initial"
          animate="animate"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050608] overflow-hidden select-none pointer-events-auto"
        >
          {/* Cyber grid pattern matching the portal color */}
          <div 
            className="absolute inset-0 opacity-[0.06] transition-colors duration-500 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(${selectedShape.color} 1px, transparent 1px), linear-gradient(90deg, ${selectedShape.color} 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />

          {/* Radial depth light gradient behind the portal */}
          <div 
            className="absolute inset-0 opacity-40 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${selectedShape.glowColor} 0%, rgba(0,0,0,0) 70%)`
            }}
          />

          {/* 4 Concentric Zooming Frames for highly detailed depth tunnel effect */}
          {[0, 1, 2, 3].map((index) => {
            // Configure delays to sequence the tunnel
            const delay = index * 0.12;
            
            // Zoom Direction Variants
            const scaleRange = zoomDirection === "out" 
              ? [0.1, 1 + index * 0.5, 3 + index * 1.5, 12] 
              : [12, 3 + index * 1.5, 1 + index * 0.5, 0];

            const opacityRange = zoomDirection === "out"
              ? [0, 0.8, 0.4, 0]
              : [0, 0.4, 0.8, 0];

            const rotateRange = zoomDirection === "out"
              ? [index * 15, index * 30 + 45, index * 45 + 90, index * 60 + 180]
              : [index * 60 + 180, index * 45 + 90, index * 30 + 45, index * 15];

            return (
              <motion.div
                key={`tunnel-layer-${index}`}
                initial={{ scale: scaleRange[0], opacity: 0, rotate: rotateRange[0] }}
                animate={{
                  scale: scaleRange,
                  opacity: opacityRange,
                  rotate: rotateRange
                }}
                transition={{
                  duration: 1.25,
                  delay: delay,
                  ease: "easeInOut",
                  times: [0, 0.3, 0.75, 1]
                }}
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                  width: "280px",
                  height: "280px"
                }}
              >
                {/* Holographic Glowing SVG circular border */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="47" 
                    stroke={selectedShape.color} 
                    strokeWidth="1.2" 
                    fill="none" 
                    strokeDasharray="4 8 12 8"
                    opacity={0.8 - index * 0.15}
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="43" 
                    stroke={selectedShape.color} 
                    strokeWidth="0.6" 
                    fill="none" 
                    strokeDasharray="15 5"
                    opacity={0.4 - index * 0.1}
                  />
                </svg>

                {/* The Brand Image acting as the frame */}
                <div 
                  className="relative w-48 h-48 flex items-center justify-center"
                  style={{
                    filter: `drop-shadow(0 0 ${20 - index * 4}px ${selectedShape.color})`
                  }}
                >
                  <img
                    src={selectedShape.url}
                    alt={selectedShape.label}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Internal tech guidelines mapping the portal border */}
                  <div 
                    className="absolute inset-0 border-2 rounded-full pointer-events-none opacity-45"
                    style={{ 
                      borderColor: selectedShape.color,
                      boxShadow: `0 0 12px ${selectedShape.color}, inset 0 0 12px ${selectedShape.color}`
                    }}
                  />
                </div>
              </motion.div>
            );
          })}

          {/* Central Core Portal Light */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ 
              scale: zoomDirection === "out" ? [0.2, 1.8, 4, 15] : [15, 4, 1, 0],
              opacity: [0, 1, 1, 0]
            }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute w-24 h-24 rounded-full filter blur-xl mix-blend-screen pointer-events-none"
            style={{ backgroundColor: selectedShape.color }}
          />

          {/* HUD Tech Status Label */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-4 py-1.5 rounded-full border bg-black/80 backdrop-blur-md flex items-center gap-2.5 font-mono text-[10px] tracking-wider uppercase"
              style={{ 
                borderColor: `${selectedShape.color}33`,
                boxShadow: `0 0 15px ${selectedShape.color}15`
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: selectedShape.color }} />
              <span style={{ color: selectedShape.color }}>
                {selectedShape.label}
              </span>
              <span className="text-muted-foreground">|</span>
              <span className="text-white font-bold">
                ZOOM {zoomDirection === "out" ? "OUT" : "IN"}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Container-level localized transitions for tab switcher ("viñetas") or sliders.
 * Wrap your content or put this component inside a 'relative overflow-hidden' container,
 * and pass the trigger key (like activeTab state). It plays a super clean brand zoom frame transition.
 */
export const LocalLogoTransition: React.FC<{ triggerKey: string }> = ({ triggerKey }) => {
  const [prevKey, setPrevKey] = useState(triggerKey);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedShape, setSelectedShape] = useState<BrandShape>(BRAND_SHAPES[0]);

  useEffect(() => {
    if (triggerKey !== prevKey) {
      // Determine shape based on string character sum to keep it deterministic but variety-rich
      const charSum = triggerKey.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      setSelectedShape(BRAND_SHAPES[charSum % BRAND_SHAPES.length]);
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPrevKey(triggerKey);
      }, 750); // Snappy 0.75s local zoom transition

      return () => clearTimeout(timer);
    }
  }, [triggerKey, prevKey]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.75, times: [0, 0.15, 0.85, 1] }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-background/95 backdrop-blur-sm pointer-events-none overflow-hidden rounded-xl"
        >
          {/* Zoom frame portal layer */}
          <motion.div
            initial={{ scale: 0.1, rotate: -45, opacity: 0 }}
            animate={{
              scale: [0.1, 1.2, 2.5, 6],
              rotate: [-45, 15, 45, 90],
              opacity: [0, 1, 0.8, 0]
            }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
              times: [0, 0.4, 0.75, 1]
            }}
            className="w-32 h-32 flex items-center justify-center"
            style={{
              filter: `drop-shadow(0 0 15px ${selectedShape.color})`
            }}
          >
            <img
              src={selectedShape.url}
              alt="Local Transition Shape"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            {/* Outline ring */}
            <div 
              className="absolute inset-0 border border-dashed rounded-full"
              style={{ borderColor: selectedShape.color }}
            />
          </motion.div>
          
          {/* Subtle colored flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: `${selectedShape.color}15` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
