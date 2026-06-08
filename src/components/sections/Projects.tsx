"use client";

import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/lib/projects";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsSectionProps) {
  // Use a horizontal scrolling layout instead of a grid

  return (
    <section id="projects" className="py-section">
      <div className="section-container">
        <SectionHeading
          title="Projects"
          subtitle="Engineering projects I've designed, built, and documented."
        />

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Projects coming soon — check back after my first semester!
            </p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar items-stretch">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="w-[85vw] sm:w-[350px] md:w-[400px] shrink-0 snap-start flex flex-col"
              >
                <div className="h-full">
                  <ProjectCard
                    slug={project.slug}
                    title={project.meta.title}
                    description={project.meta.description}
                    tags={project.meta.tags}
                    semester={project.meta.semester}
                    cover={project.meta.cover}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
