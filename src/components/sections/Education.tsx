"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

export default function Education() {
  const coursework = ["Digital Circuits", "Physics", "EE systems"];
  const certifications = [
    {
      title: "MATLAB Certified",
      thumbnailPath: "/MATLAB-cert.png",
      href: "https://www.credly.com/badges/a71848bc-061a-41d2-bde6-dba0f81a74f5/linked_in_profile",
    },
    {
      title: "Altium Designer",
      thumbnailPath: "/Altium-cert.png",
      href: null,
    },
    {
      title: "Ansys Simulation",
      thumbnailPath: "/Ansys-cert.png",
      href: null,
    },
  ];

  return (
    <section id="education" className="py-section">
      <div className="section-container">
        <SectionHeading
          title="Education & Certifications"
          subtitle="Academic foundation and professional tool proficiency."
        />

        <div className="grid md:grid-cols-2 gap-2 items-stretch">
          {/* Academic Card */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="glass-card p-3 h-full flex flex-col items-center text-center hover:border-electric-500/30 transition-all duration-300">
              {/* Logo Box - Massively increased size and centered */}
              <div className="w-90 h-48 md:w-96 md:h-50 mb-6 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden relative border border-white/10 shadow-lg">
                <Image
                  src="/USF-logo.png"
                  alt="USF Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>

              <h3 className="text-2xl font-heading font-bold text-white mb-2">
                B.S. Electrical Engineering
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                University of South Florida · Expected Spring 2029
              </p>

              {/* GPA Highlight */}
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-500/10 border border-electric-500/30 text-electric-400 font-bold shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                  <span>GPA: 4.00</span>
                </span>
              </div>

              {/* Coursework Tags */}
              <div className="mt-auto w-full">
                <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">
                  Relevant Coursework
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {coursework.map((course) => (
                    <span
                      key={course}
                      className="px-3 py-1.5 rounded-lg bg-navy-800/50 border border-white/5 text-gray-300 text-sm hover:border-electric-500/20 transition-colors cursor-default"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Certifications Card */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="glass-card p-8 h-full flex flex-col hover:border-electric-500/30 transition-all duration-300">
              <h3 className="text-2xl font-heading font-bold text-white mb-6">
                Professional Certifications
              </h3>

              <div className="space-y-4">
                {certifications.map((cert) => {
                  const Wrapper = cert.href ? "a" : "div";
                  const wrapperProps = cert.href
                    ? {
                      href: cert.href,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                    : {};

                  return (
                    <Wrapper
                      key={cert.title}
                      {...wrapperProps}
                      className={`flex items-center gap-5 p-4 rounded-xl bg-navy-800/50 border border-white/5 transition-all duration-300 group ${cert.href
                        ? "hover:bg-slate-800/50 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:-translate-y-1 cursor-pointer"
                        : ""
                        }`}
                    >
                      {/* Thumbnail Container */}
                      <div
                        className={`w-40 h-24 rounded-lg bg-navy-900/50 overflow-hidden relative border border-white/10 flex-shrink-0 transition-colors ${cert.href ? "group-hover:border-blue-500/50" : ""
                          }`}
                      >
                        <Image
                          src={cert.thumbnailPath}
                          alt={`${cert.title} Certificate`}
                          fill
                          className={`object-cover transition-transform duration-500 ${cert.href ? "group-hover:scale-105" : ""
                            }`}
                        />
                      </div>

                      {/* Text Container */}
                      <div className="flex-1">
                        <span
                          className={`font-semibold block text-lg transition-colors ${cert.href
                            ? "text-gray-200 group-hover:text-blue-400"
                            : "text-gray-200"
                            }`}
                        >
                          {cert.title}
                        </span>
                        {cert.href && (
                          <span className="text-xs text-gray-500 flex items-center mt-1 gap-1 group-hover:text-gray-400 transition-colors">
                            View Credential
                            <svg
                              className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                    </Wrapper>
                  );
                })}
              </div>

              <div className="mt-auto pt-6">
                <div className="h-1 w-full bg-gradient-to-r from-electric-500/50 to-transparent rounded-full opacity-50" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
