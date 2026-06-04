/**
 * Client-safe utility functions for constructing project asset URLs.
 * These do NOT use Node.js `fs` — safe to import from client components.
 */

/**
 * Returns the public URL path for a project cover image.
 */
export function getProjectCoverPath(slug: string, cover: string): string {
  return `/content/projects/${slug}/images/${cover}`;
}

/**
 * Returns the public URL path for a project gallery image.
 */
export function getProjectImagePath(slug: string, filename: string): string {
  return `/content/projects/${slug}/images/${filename}`;
}

/**
 * Returns the public URL path for a project's engineering report PDF.
 */
export function getProjectReportPath(slug: string): string {
  return `/content/projects/${slug}/report.pdf`;
}
