import { motion } from "framer-motion";
interface Props {
  tag?: string;
  title: string;
  description?: string;
  center?: boolean;
}
export default function SectionHeading({
  tag,
  title,
  description,
  center = true
}: Props) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5
  }} className={`mb-12 ${center ? "text-center" : ""}`}>
      {tag && <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-2 block">
          {tag}
        </span>}
      <h2 className="font-display text-3xl md:text-4xl font-bold bg-primary-foreground">{title}</h2>
      {description && <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{description}</p>}
    </motion.div>;
}