import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faqPage } from '../lib/jsonLd'

export interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  items: FaqItem[]
  jsonLdId?: string
}

export default function FaqSection({ items, jsonLdId = 'faq' }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const jsonLd = faqPage(items)

  return (
    <section className="bg-wasp-light py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id={jsonLdId}
      />
      <div className="mx-auto max-w-3xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center font-rajdhani text-3xl font-black text-wasp-black"
        >
          Questions fréquentes
        </motion.h2>
        <div className="space-y-2">
          {items.map(({ question, answer }, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-200 ${
                openIndex === i ? 'border-l-4 border-wasp-yellow' : 'border-l-4 border-transparent'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="font-poppins text-sm font-semibold text-wasp-black">
                  {question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-wasp-yellow transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="border-t border-gray-100 px-5 py-4 font-poppins text-sm leading-relaxed text-wasp-gray">
                      {answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
