"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

const STATS = [
  { label: "Academic Year", value: "Freshman → Sophomore" },
  { label: "Program", value: "USF Electrical Engineering" },
  { label: "Leadership", value: "IEEE ProDev Chair" },
  { label: "Experience", value: "Power Engineering Intern" },
];

export default function About() {
  return (
    <section id="about" className="py-section">
      <div className="section-container">
        <SectionHeading
          title="About Me"
          subtitle="⚡ From Italy to the US, building my engineering career one circuit at a time."
        />

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Bio Text */}
          <ScrollReveal direction="left">
            <div className="space-y-5">
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                Hi, I&apos;m Marco 👷 — an Electrical Engineering student at the University of
                South Florida, originally from Italy 🇮🇹. I moved to the US to build my engineering
                career from the ground up, and I&apos;ve been all-in ever since.
              </p>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                My technical focus spans{" "}
                <span className="text-electric-400 font-medium">RF systems</span>,{" "}
                <span className="text-electric-400 font-medium">power electronics</span>,{" "}
                <span className="text-electric-400 font-medium">FPGAs</span>, and{" "}
                <span className="text-electric-400 font-medium">embedded design</span>. I love the
                intersection of hardware and software — taking an idea from schematic to PCB to
                working prototype.
              </p>
              <p className="text-gray-400 leading-relaxed">
                When I&apos;m not in the lab or debugging firmware, you&apos;ll find me organizing
                professional development events for IEEE, pitching startup ideas at innovation
                challenges, or diving deeper into Altium PCB design. I&apos;m driven by the belief
                that the best engineers build things that matter — and I&apos;m just getting started.
              </p>
            </div>
          </ScrollReveal>

          {/* Photo + Stats */}
          <ScrollReveal direction="right">
            <div className="space-y-8">
              {/* Photo */}
              <div className="relative mx-auto w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
                {/* Gradient border ring */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-electric-500/40 via-electric-600/20 to-transparent p-[2px]">
                  <div className="w-full h-full rounded-2xl bg-navy-800 overflow-hidden">
                    <Image
                      src="/headshot.png"
                      alt="Marco Tamburini"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 256px, 320px"
                      priority
                    />
                  </div>
                </div>
                {/* Decorative accent */}
                <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border border-electric-500/20 -z-10" />
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="glass-card p-4 text-center group hover:border-electric-500/30 transition-all duration-200"
                  >
                    <p className="text-electric-400 font-heading font-bold text-sm mb-1">
                      {stat.value}
                    </p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
