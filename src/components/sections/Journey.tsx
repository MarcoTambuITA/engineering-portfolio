"use client";

import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

interface TimelineEntry {
  semester: string;
  period: string;
  highlights: string[];
}

const TIMELINE: TimelineEntry[] = [
  {
    semester: "Summer 2025",
    period: "Jun – Aug 2025",
    highlights: [
      "Power Engineering Intern at Newkirk Electric Associates, Michigan",
      "Built the WPT System Simulator — a wireless power transfer modeling tool",
      "Beginning RF coursework and Keysight certification prep",
    ],
  },
  {
    semester: "Spring 2025",
    period: "Jan – May 2025",
    highlights: [
      "Completed Digital Circuits, Calculus 2, and Physics",
      "Built wearable accelerometer project (Arduino Nano 33 BLE + Flutter app)",
      "Elected Professional Development Chair at IEEE @ USF",
      "Secured power engineering internship at Newkirk Electric",
      "Won USF innovation challenge — pitched in Minneapolis, secured $10k+ in funding",
      "Elected Special Events Coordinator for Engineering Ambassadors",
      "Joined SYP startup accelerator program",
    ],
  },
  {
    semester: "Fall 2024",
    period: "Aug – Dec 2024",
    highlights: [
      "Started at USF as Electrical Engineering Freshman",
      "Joined Engineering Ambassadors program",
      "Built first engineering project — following robot with ultrasonic sensors",
      "Began learning electronics, Arduino, and embedded programming from scratch",
    ],
  },
];

export default function Journey() {
  return (
    <section id="journey" className="py-section">
      <div className="section-container">
        <SectionHeading
          title="Journey"
          subtitle="A living timeline of milestones, projects, and growth."
        />

        <div className="max-w-3xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-electric-500/50 via-electric-500/20 to-transparent" />

            {TIMELINE.map((entry, i) => (
              <ScrollReveal key={entry.semester} delay={i * 0.1}>
                <div className="relative pl-12 md:pl-16 pb-12 last:pb-0">
                  {/* Circle marker */}
                  <div className="absolute left-2.5 md:left-4.5 top-1 w-3 h-3 rounded-full bg-electric-500 border-2 border-navy-900 shadow-lg shadow-electric-500/30" />

                  {/* Content */}
                  <div className="glass-card p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                      <h3 className="font-heading font-bold text-xl text-white">
                        {entry.semester}
                      </h3>
                      <span className="text-xs font-mono text-gray-500 sm:ml-auto">
                        {entry.period}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {entry.highlights.map((highlight, j) => (
                        <li
                          key={j}
                          className="text-gray-400 text-sm leading-relaxed flex items-start gap-2"
                        >
                          <span className="text-electric-500/60 mt-1.5 flex-shrink-0">
                            ▸
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
