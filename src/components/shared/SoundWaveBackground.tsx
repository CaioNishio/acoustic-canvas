import { motion } from "framer-motion";

interface Props {
  variant?: "a" | "b" | "c" | "d";
  flip?: boolean;
}

export default function SoundWaveBackground({ variant = "a", flip = false }: Props) {
  const transform = flip ? "scaleX(-1)" : undefined;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ transform }}>
      {/* Large orange radial glow */}
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-[hsl(25,85%,52%)]/[0.06] blur-[100px]" />
      <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-[hsl(25,80%,50%)]/[0.04] blur-[80px]" />

      {/* Sound wave SVGs */}
      {variant === "a" && (
        <>
          {/* Concentric arcs — top right */}
          <svg className="absolute -top-10 -right-16 w-[450px] h-[450px] opacity-[0.12]" viewBox="0 0 400 400" fill="none">
            {[80, 120, 160, 200, 240].map((r, i) => (
              <motion.circle
                key={i}
                cx="400" cy="0" r={r}
                stroke={`hsl(${25 - i * 3}, ${80 + i * 2}%, ${50 + i * 3}%)`}
                strokeWidth={1.5 - i * 0.15}
                strokeDasharray="8 6"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 1.5, ease: "easeOut" }}
              />
            ))}
          </svg>

          {/* Flowing sine waves — bottom */}
          <svg className="absolute bottom-0 left-0 w-full h-32 opacity-[0.08]" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none">
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M0,${60 + i * 15} Q150,${30 + i * 10} 300,${60 + i * 15} T600,${60 + i * 15} T900,${60 + i * 15} T1200,${60 + i * 15}`}
                stroke={`hsl(${25 + i * 5}, 80%, ${50 + i * 5}%)`}
                strokeWidth={2 - i * 0.4}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 2, ease: "easeOut" }}
              />
            ))}
          </svg>

          {/* Scattered frequency dots */}
          <div className="hidden md:block">
            {[
              { x: "15%", y: "20%", size: 4, opacity: 0.15, delay: 0.3 },
              { x: "25%", y: "65%", size: 6, opacity: 0.10, delay: 0.5 },
              { x: "70%", y: "30%", size: 3, opacity: 0.20, delay: 0.2 },
              { x: "80%", y: "75%", size: 5, opacity: 0.12, delay: 0.6 },
              { x: "45%", y: "15%", size: 3, opacity: 0.18, delay: 0.4 },
            ].map((dot, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[hsl(25,80%,50%)]"
                style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size, opacity: dot.opacity }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: dot.delay, duration: 0.6, ease: "backOut" }}
              />
            ))}
          </div>
        </>
      )}

      {variant === "b" && (
        <>
          {/* Equalizer bars — left side */}
          <svg className="absolute top-1/2 -translate-y-1/2 -left-4 w-16 h-64 opacity-[0.10]" viewBox="0 0 60 240" fill="none">
            {[20, 50, 35, 65, 40, 55, 30, 60, 25, 45, 35, 55].map((h, i) => (
              <motion.rect
                key={i}
                x={i * 5}
                y={120 - h / 2}
                width="3"
                height={h}
                rx="1.5"
                fill={`hsl(${20 + i * 2}, 80%, ${48 + i}%)`}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.8, ease: "backOut" }}
              />
            ))}
          </svg>

          {/* Propagation rings — center right */}
          <svg className="absolute top-[20%] right-[5%] w-[350px] h-[350px] opacity-[0.08]" viewBox="0 0 300 300" fill="none">
            {[40, 70, 100, 130, 160].map((r, i) => (
              <motion.circle
                key={i}
                cx="0" cy="150" r={r}
                stroke={`hsl(${25 + i * 4}, ${75 + i * 3}%, ${50 + i * 4}%)`}
                strokeWidth={1.2 - i * 0.1}
                strokeDasharray="4 8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 1 }}
              />
            ))}
          </svg>

          {/* Diagonal wave lines */}
          <svg className="absolute bottom-0 right-0 w-full h-24 opacity-[0.06]" viewBox="0 0 1200 100" preserveAspectRatio="none" fill="none">
            {[0, 1, 2, 3].map((i) => (
              <motion.path
                key={i}
                d={`M0,${80 - i * 12} C200,${60 - i * 10} 400,${90 - i * 12} 600,${70 - i * 10} S1000,${80 - i * 12} 1200,${65 - i * 10}`}
                stroke={`hsl(${22 + i * 4}, 80%, ${48 + i * 4}%)`}
                strokeWidth={1.5 - i * 0.2}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 1.8 }}
              />
            ))}
          </svg>
        </>
      )}

      {variant === "c" && (
        <>
          {/* Waveform — full width top */}
          <svg className="absolute top-4 left-0 w-full h-20 opacity-[0.07]" viewBox="0 0 1200 80" preserveAspectRatio="none" fill="none">
            <motion.path
              d="M0,40 Q50,15 100,40 T200,40 T300,40 T400,40 T500,40 T600,40 T700,40 T800,40 T900,40 T1000,40 T1100,40 T1200,40"
              stroke="hsl(25,80%,50%)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            />
            <motion.path
              d="M0,40 Q50,60 100,40 T200,40 T300,40 T400,40 T500,40 T600,40 T700,40 T800,40 T900,40 T1000,40 T1100,40 T1200,40"
              stroke="hsl(20,75%,45%)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
            />
          </svg>

          {/* Concentric arcs — bottom left */}
          <svg className="absolute -bottom-20 -left-20 w-[400px] h-[400px] opacity-[0.10]" viewBox="0 0 400 400" fill="none">
            {[60, 100, 140, 180, 220].map((r, i) => (
              <motion.circle
                key={i}
                cx="0" cy="400" r={r}
                stroke={`hsl(${28 - i * 2}, ${85 - i * 2}%, ${50 + i * 3}%)`}
                strokeWidth={1.2}
                strokeDasharray="6 10"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1.5 }}
              />
            ))}
          </svg>

          {/* Frequency spectrum bars — right */}
          <svg className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-48 opacity-[0.10]" viewBox="0 0 40 200" fill="none">
            {[30, 55, 40, 70, 35, 60, 45, 65, 30, 50].map((h, i) => (
              <motion.rect
                key={i}
                x="0"
                y={i * 20}
                width={h}
                height="3"
                rx="1.5"
                fill={`hsl(${22 + i * 2}, 80%, ${48 + i * 2}%)`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                style={{ transformOrigin: "right center" }}
                transition={{ delay: i * 0.06, duration: 0.7, ease: "backOut" }}
              />
            ))}
          </svg>
        </>
      )}

      {variant === "d" && (
        <>
          {/* Double arc — top */}
          <svg className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.08]" viewBox="0 0 600 300" fill="none">
            {[80, 120, 160, 200].map((r, i) => (
              <motion.circle
                key={i}
                cx="300" cy="0" r={r}
                stroke={`hsl(${25 + i * 3}, ${80 - i * 2}%, ${50 + i * 3}%)`}
                strokeWidth={1.5 - i * 0.2}
                strokeDasharray="12 8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 1.5 }}
              />
            ))}
          </svg>

          {/* Flowing waves — bottom */}
          <svg className="absolute bottom-0 left-0 w-full h-28 opacity-[0.06]" viewBox="0 0 1200 100" preserveAspectRatio="none" fill="none">
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M0,${50 + i * 12} C300,${20 + i * 8} 600,${70 + i * 10} 900,${30 + i * 8} L1200,${50 + i * 12}`}
                stroke={`hsl(${25 + i * 5}, 80%, ${48 + i * 5}%)`}
                strokeWidth={1.8 - i * 0.3}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 2 }}
              />
            ))}
          </svg>

          {/* Scattered warm dots */}
          <div className="hidden md:block">
            {[
              { x: "10%", y: "30%", size: 5, opacity: 0.12 },
              { x: "85%", y: "25%", size: 4, opacity: 0.15 },
              { x: "60%", y: "70%", size: 6, opacity: 0.08 },
              { x: "30%", y: "80%", size: 3, opacity: 0.18 },
            ].map((dot, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[hsl(25,80%,50%)]"
                style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size, opacity: dot.opacity }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: "backOut" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
