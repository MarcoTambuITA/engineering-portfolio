"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import type { Involvement as InvolvementType } from "@/lib/involvement";

interface InvolvementProps {
  involvements: InvolvementType[];
}

export default function Involvement({ involvements }: InvolvementProps) {
  return (
    <section id="involvement" className="py-section">
      <div className="section-container">
        <SectionHeading
          title="Involvement"
          subtitle="Leadership and impact beyond the classroom."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {involvements.map((item, i) => (
            <ScrollReveal key={item.slug} delay={i * 0.1}>
              <Link href={`/involvement/${item.slug}`} className="block h-full">
                <motion.div
                  className="glass-card h-full flex flex-col group hover:border-electric-500/20 transition-all duration-300 relative overflow-hidden"
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                >
                  {item.coverImage && (
                    <div className="h-48 w-full overflow-hidden shrink-0">
                      <img
                        src={`/content/involvement/${item.slug}/images/${item.coverImage}`}
                        alt={item.meta.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10">
                    {/* Icon */}
                    <div className="text-4xl mb-4 relative z-10">{item.meta.icon}</div>

                    {/* Content */}
                    <h3 className="text-lg font-heading font-bold text-white mb-1 group-hover:text-electric-400 transition-colors relative z-10">
                      {item.meta.title}
                    </h3>
                    <p className="text-electric-400/70 text-sm font-mono mb-4 relative z-10">
                      {item.meta.organization}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                      {item.meta.description}
                    </p>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: "inset 0 0 0 1px rgba(59, 130, 246, 0.2), 0 0 30px rgba(59, 130, 246, 0.08)",
                    }}
                  />
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
