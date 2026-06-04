"use client";

import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/lib/projects";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsSectionProps) {
  const gridClasses =
    projects.length <= 2
      ? "flex flex-col md:flex-row gap-6 justify-center max-w-3xl mx-auto"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

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
          <div className={gridClasses}>
            {projects.map((project) => (
              <div
                key={project.slug}
                className={projects.length <= 2 ? "w-full md:w-96" : ""}
              >
                <ProjectCard
                  slug={project.slug}
                  title={project.meta.title}
                  description={project.meta.description}
                  tags={project.meta.tags}
                  semester={project.meta.semester}
                  cover={project.meta.cover}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
