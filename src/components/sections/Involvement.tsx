"use client";

import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

const INVOLVEMENTS = [
  {
    title: "Engineering Contributor",
    organization: "Student Yacht Program (SYP)",
    icon: "🚀",
    description:
      "Engineering contributor in USF's startup accelerator program, working with a cross-functional team to develop and pitch technology-driven solutions to real-world problems. Secured $10,000+ in funding after pitching at the Minneapolis innovation challenge.",
  },
  {
    title: "Professional Development Chair",
    organization: "IEEE @ USF",
    icon: "⚡",
    description:
      "Responsible for organizing career-focused events, industry speaker sessions, and skill-building workshops for the chapter's engineering student members. Building a bridge between academic learning and professional readiness.",
  },
  {
    title: "Special Events Coordinator",
    organization: "Engineering Ambassadors",
    icon: "🎯",
    description:
      "Lead coordination efforts for major outreach events such as EXPO and SHPE Jr. Noche de Ciencias. Organize ambassador participation by recruiting, scheduling, and managing involvement. Interview and help select new members for the program.",
  },
];

export default function Involvement() {
  return (
    <section id="involvement" className="py-section">
      <div className="section-container">
        <SectionHeading
          title="Involvement"
          subtitle="Leadership and impact beyond the classroom."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {INVOLVEMENTS.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <div className="glass-card p-6 md:p-8 h-full group hover:border-electric-500/20 transition-all duration-300 glow-border">
                {/* Icon */}
                <div className="text-4xl mb-4">{item.icon}</div>

                {/* Content */}
                <h3 className="text-lg font-heading font-bold text-white mb-1 group-hover:text-electric-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-electric-400/70 text-sm font-mono mb-4">
                  {item.organization}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
