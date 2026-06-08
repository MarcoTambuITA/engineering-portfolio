"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import type { Experience as ExperienceType } from "@/lib/experience";

interface ExperienceProps {
  experiences: ExperienceType[];
}

function formatDateRange(startDate: string, endDate?: string): string {
  const format = (d: string) => {
    const [year, month] = d.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const start = format(startDate);

  if (!endDate || endDate.toLowerCase() === "present") {
    return `${start} — Present`;
  }

  return `${start} — ${format(endDate)}`;
}

export default function Experience({ experiences }: ExperienceProps) {
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-section">
      <div className="section-container">
        <SectionHeading
          title="Experience"
          subtitle="Professional internships and industry roles."
        />

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connector line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-electric-500/40 via-electric-500/20 to-transparent" />

          <div className="flex flex-col gap-8">
            {experiences.map((item, i) => (
              <ScrollReveal key={item.slug} delay={i * 0.12}>
                <Link href={`/experience/${item.slug}`} className="block group">
                  <motion.div
                    className="relative pl-16 md:pl-20"
                    whileHover={{
                      y: -4,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-[18px] md:left-[26px] top-8 w-3 h-3 rounded-full bg-electric-500 border-2 border-navy-900 z-10 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />

                    {/* Card */}
                    <div className="glass-card p-6 md:p-8 group-hover:border-electric-500/20 transition-all duration-300 relative overflow-hidden">
                      {/* Top row: logo + title info */}
                      <div className="flex items-start gap-4">
                        {/* Company logo */}
                        {item.meta.logo && (
                          <div className="w-12 h-12 rounded-lg bg-navy-700/50 border border-navy-600/30 flex items-center justify-center shrink-0 overflow-hidden">
                            <Image
                              src={`/content/experience/${item.slug}/images/${item.meta.logo}`}
                              alt={`${item.meta.company} logo`}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain p-1.5"
                            />
                          </div>
                        )}
                        {!item.meta.logo && (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-500/20 to-electric-600/10 border border-navy-600/30 flex items-center justify-center shrink-0">
                            <span className="text-xl">💼</span>
                          </div>
                        )}

                        <div className="flex-grow min-w-0">
                          <h3 className="text-lg font-heading font-bold text-white group-hover:text-electric-400 transition-colors">
                            {item.meta.title}
                          </h3>
                          <p className="text-electric-400/80 text-sm font-mono">
                            {item.meta.company}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className="text-gray-500 text-xs font-mono">
                              {formatDateRange(item.meta.startDate, item.meta.endDate)}
                            </span>
                            {item.meta.location && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className="text-gray-500 text-xs">
                                  {item.meta.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Arrow indicator */}
                        <svg
                          className="w-5 h-5 text-gray-600 group-hover:text-electric-400 transition-all group-hover:translate-x-1 shrink-0 mt-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed mt-4">
                        {item.meta.description}
                      </p>

                      {/* Tags */}
                      {item.meta.tags && item.meta.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.meta.tags.map((tag) => (
                            <span key={tag} className="tech-badge text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Hover glow effect */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          boxShadow:
                            "inset 0 0 0 1px rgba(59, 130, 246, 0.2), 0 0 30px rgba(59, 130, 246, 0.08)",
                        }}
                      />
                    </div>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
