import { motion } from 'framer-motion'

export default function WaspStripeDivider() {
  return (
    <motion.div
      className="flex h-2 w-full overflow-hidden"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ transformOrigin: 'left' }}
    >
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`flex-1 ${i % 2 === 0 ? 'bg-wasp-yellow' : 'bg-wasp-black'}`}
        />
      ))}
    </motion.div>
  )
}
