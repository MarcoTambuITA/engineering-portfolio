"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getProjectCoverPath } from "@/lib/paths";

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  semester: string;
  cover: string;
}

export default function ProjectCard({
  slug,
  title,
  description,
  tags,
  semester,
  cover,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`}>
      <motion.article
        className="glass-card overflow-hidden cursor-pointer group h-full flex flex-col"
        whileHover={{
          y: -6,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cover Image */}
        <div className="relative h-48 md:h-52 overflow-hidden">
          <Image
            src={getProjectCoverPath(slug, cover)}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />

          {/* Semester badge */}
          <span className="absolute top-3 right-3 text-xs font-mono text-gray-400 bg-navy-900/70 backdrop-blur-sm px-2 py-1 rounded">
            {semester}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-electric-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2 py-1 rounded bg-navy-700/50 text-electric-300/80 border border-electric-500/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(59, 130, 246, 0.2), 0 0 30px rgba(59, 130, 246, 0.08)",
          }}
        />
      </motion.article>
    </Link>
  );
}
