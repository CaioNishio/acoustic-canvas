import { motion } from "framer-motion";

/**
 * Waveform divider — a subtle animated sine-wave SVG strip
 */
export function WaveDivider({
  flip = false,
  color = "hsl(var(--primary))",
  className = ""




}: {flip?: boolean;color?: string;className?: string;}) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="w-full h-[40px] md:h-[60px]">

        <path
          d="M0,40 C120,65 240,10 360,40 C480,70 600,15 720,40 C840,65 960,10 1080,40 C1200,70 1320,15 1440,40 L1440,80 L0,80 Z"
          fill={color}
          fillOpacity="0.06" />

        <path
          d="M0,50 C160,25 320,70 480,45 C640,20 800,65 960,45 C1120,25 1280,65 1440,50"
          fill="none"
          stroke={color}
          strokeOpacity="0.12"
          strokeWidth="1.5" />

      </svg>
    </div>);

}

/**
 * Animated frequency bars — small equalizer visualization
 */
export function FrequencyBars({
  count = 24,
  className = ""



}: {count?: number;className?: string;}) {
  return (
    <div className={`flex items-end justify-center gap-[3px] h-8 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const baseHeight = Math.sin(i / count * Math.PI) * 100;
        return (
          <motion.div
            key={i}
            className="w-[2px] rounded-full bg-primary/20"
            initial={{ height: `${baseHeight * 0.3}%` }}
            whileInView={{ height: `${baseHeight}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.02, ease: "easeOut" }} />);


      })}
    </div>);

}

/**
 * Sound wave pulse line — animated horizontal waveform
 */
export function SoundWaveLine({ className = "" }: {className?: string;}) {
  return (
    <div className={`w-full flex items-center justify-center py-6 ${className}`}>
      <div className="flex items-center gap-3 w-full max-w-3xl">
        {/* Left fade line */}
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/15" />

        {/* Central waveform */}
        <svg viewBox="0 0 200 40" className="w-48 h-8 flex-shrink-0 border-amber-500 text-amber-600 bg-muted-foreground" preserveAspectRatio="xMidYMid meet">
          <motion.path
            d="M0,20 Q10,20 15,8 Q20,-4 25,20 Q30,44 35,20 Q40,20 50,20 Q55,20 60,12 Q65,4 70,20 Q75,36 80,20 Q85,20 95,20 Q100,20 105,6 Q110,-8 115,20 Q120,48 125,20 Q130,20 140,20 Q145,20 150,14 Q155,8 160,20 Q165,32 170,20 Q175,20 185,20 Q190,20 195,16 Q200,12 200,20"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }} />

        </svg>

        {/* Right fade line */}
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/15" />
      </div>
    </div>);

}

/**
 * Concentric sound rings — emanating from a point
 */
export function SoundRings({ className = "" }: {className?: string;}) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="relative w-32 h-16">
        {[0, 1, 2, 3].map((i) =>
        <motion.div
          key={i}
          className="absolute top-1/2 left-0 -translate-y-1/2 border border-primary/10 rounded-full"
          style={{
            width: `${(i + 1) * 25}%`,
            height: `${(i + 1) * 30}%`,
            left: "0"
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }} />

        )}
        <motion.div
          className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }} />

      </div>
    </div>);

}

/**
 * Dotted acoustic pattern — subtle background texture divider
 */
export function AcousticDots({ className = "" }: {className?: string;}) {
  return (
    <div className={`w-full flex justify-center py-6 ${className}`}>
      <div className="flex items-center gap-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const size = Math.sin((i + 1) / 8 * Math.PI) * 6 + 2;
          return (
            <motion.div
              key={i}
              className="rounded-full bg-primary/15"
              style={{ width: size, height: size }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.3 }} />);


        })}
      </div>
    </div>);

}

/**
 * Double wave section border — top and bottom SVG waves
 */
export function WaveSectionBorder({
  position = "top",
  className = ""



}: {position?: "top" | "bottom";className?: string;}) {
  const isBottom = position === "bottom";
  return (
    <div className={`w-full overflow-hidden leading-[0] ${isBottom ? "rotate-180" : ""} ${className}`}>
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-[24px] md:h-[36px]">
        <path
          d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 L1440,48 L0,48 Z"
          fill="hsl(var(--muted))"
          fillOpacity="0.5" />

      </svg>
    </div>);

}