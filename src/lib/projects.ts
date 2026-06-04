import fs from "fs";
import path from "path";

// Re-export client-safe path utilities so server components
// can import everything from one place
export {
  getProjectCoverPath,
  getProjectImagePath,
  getProjectReportPath,
} from "./paths";

export interface ProjectMeta {
  title: string;
  date: string;
  semester: string;
  description: string;
  tags: string[];
  category: string;
  cover: string;
  github?: string;
  featured?: boolean;
}

export interface Project {
  slug: string;
  meta: ProjectMeta;
  hasReport: boolean;
  images: string[];
  writeupContent: string;
}

// ===== PATHS =====

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

// ===== CONTENT LOADERS =====

/**
 * Get all project slugs by scanning the content/projects/ directory.
 */
export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => {
      // Only include directories that have a meta.json
      const metaPath = path.join(CONTENT_DIR, dirent.name, "meta.json");
      return fs.existsSync(metaPath);
    })
    .map((dirent) => dirent.name);
}

/**
 * Load a single project by slug.
 */
export function getProjectBySlug(slug: string): Project | null {
  const projectDir = path.join(CONTENT_DIR, slug);

  if (!fs.existsSync(projectDir)) {
    return null;
  }

  // Read meta.json
  const metaPath = path.join(projectDir, "meta.json");
  if (!fs.existsSync(metaPath)) {
    return null;
  }

  const metaRaw = fs.readFileSync(metaPath, "utf-8");
  const meta: ProjectMeta = JSON.parse(metaRaw);

  // Check for report.pdf
  const reportPath = path.join(projectDir, "report.pdf");
  const hasReport = fs.existsSync(reportPath);

  // List images
  const imagesDir = path.join(projectDir, "images");
  let images: string[] = [];
  if (fs.existsSync(imagesDir)) {
    images = fs
      .readdirSync(imagesDir)
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext);
      })
      .filter((file) => file !== meta.cover); // Exclude cover from gallery
  }

  // Read writeup content
  let writeupContent = "";
  const mdxPath = path.join(projectDir, "writeup.mdx");
  const mdPath = path.join(projectDir, "writeup.md");

  if (fs.existsSync(mdxPath)) {
    writeupContent = fs.readFileSync(mdxPath, "utf-8");
  } else if (fs.existsSync(mdPath)) {
    writeupContent = fs.readFileSync(mdPath, "utf-8");
  }

  return {
    slug,
    meta,
    hasReport,
    images,
    writeupContent,
  };
}

/**
 * Get all projects, sorted by date (most recent first).
 */
export function getAllProjects(): Project[] {
  const slugs = getAllProjectSlugs();
  const projects = slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((p): p is Project => p !== null);

  // Sort by date descending (most recent first)
  projects.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );

  return projects;
}

/**
 * Get featured projects only.
 */
export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.meta.featured);
}
