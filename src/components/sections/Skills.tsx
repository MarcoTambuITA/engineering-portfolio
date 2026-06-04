"use client";

import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import TechBadge from "@/components/TechBadge";

interface SkillItem {
  name: string;
  icon: string;
  linkedProject?: string;
}

const TECH_STACK: SkillItem[] = [
  { name: "C", icon: "🔧" },
  { name: "C++", icon: "⚙️" },
  { name: "Python", icon: "🐍" },
  { name: "MATLAB", icon: "📊" },
  { name: "Flutter", icon: "📱" },
  { name: "Firebase", icon: "🔥" },
  { name: "Git", icon: "🔀" },
  { name: "Arduino", icon: "🔌" },
];

const ENGINEERING_TOOLS: SkillItem[] = [
  { name: "Altium Designer", icon: "🖥️" },
  { name: "Ansys", icon: "📐" },
  { name: "SolidWorks", icon: "🏗️" },
  { name: "Fusion 360", icon: "🔩" },
  { name: "MATLAB/Simulink", icon: "📈" },
  { name: "LTspice", icon: "⚡" },
];

const CURRENTLY_LEARNING: SkillItem[] = [
  { name: "Altium PCB Design", icon: "📋" },
  { name: "Keysight RF Certification", icon: "📡" },
  { name: "FPGA / Verilog", icon: "🧩" },
];

function SkillGroup({
  title,
  skills,
  delay = 0,
}: {
  title: string;
  skills: SkillItem[];
  delay?: number;
}) {
  return (
    <ScrollReveal delay={delay}>
      <div className="glass-card p-6 md:p-8">
        <h3 className="text-lg font-heading font-bold text-white mb-5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-electric-500" />
          {title}
        </h3>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <TechBadge
              key={skill.name}
              name={skill.name}
              icon={skill.icon}
              linkedProject={skill.linkedProject}
            />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-section">
      <div className="section-container">
        <SectionHeading
          title="Skills & Tools"
          subtitle="Technologies I use to design, build, and test."
        />

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <SkillGroup title="Tech Stack" skills={TECH_STACK} delay={0} />
          <SkillGroup
            title="Engineering Software"
            skills={ENGINEERING_TOOLS}
            delay={0.15}
          />
        </div>

        {/* Currently Learning */}
        <ScrollReveal delay={0.3}>
          <div className="glass-card p-6 md:p-8 border-dashed">
            <h3 className="text-lg font-heading font-bold text-gray-400 mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              Currently Learning
            </h3>
            <div className="flex flex-wrap gap-3">
              {CURRENTLY_LEARNING.map((skill) => (
                <TechBadge
                  key={skill.name}
                  name={skill.name}
                  icon={skill.icon}
                  variant="learning"
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
