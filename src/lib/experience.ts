import fs from "fs";
import path from "path";

export {
  getExperienceCoverPath,
  getExperienceImagePath,
} from "./paths";

export interface ExperienceMeta {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  tags?: string[];
  logo?: string;
  cover?: string;
}

export interface Experience {
  slug: string;
  meta: ExperienceMeta;
  images: string[];
  writeupContent: string;
  coverImage?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "experience");

export function getAllExperienceSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => {
      const metaPath = path.join(CONTENT_DIR, dirent.name, "meta.json");
      return fs.existsSync(metaPath);
    })
    .map((dirent) => dirent.name);
}

export function getExperienceBySlug(slug: string): Experience | null {
  const experienceDir = path.join(CONTENT_DIR, slug);

  if (!fs.existsSync(experienceDir)) {
    return null;
  }

  const metaPath = path.join(experienceDir, "meta.json");
  if (!fs.existsSync(metaPath)) {
    return null;
  }

  const metaRaw = fs.readFileSync(metaPath, "utf-8");
  const meta: ExperienceMeta = JSON.parse(metaRaw);

  const imagesDir = path.join(experienceDir, "images");
  let images: string[] = [];
  if (fs.existsSync(imagesDir)) {
    images = fs
      .readdirSync(imagesDir)
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext);
      })
      .filter((file) => file !== meta.cover);
  }

  let writeupContent = "";
  const mdxPath = path.join(experienceDir, "writeup.mdx");
  const mdPath = path.join(experienceDir, "writeup.md");

  if (fs.existsSync(mdxPath)) {
    writeupContent = fs.readFileSync(mdxPath, "utf-8");
  } else if (fs.existsSync(mdPath)) {
    writeupContent = fs.readFileSync(mdPath, "utf-8");
  }

  return {
    slug,
    meta,
    images,
    writeupContent,
    coverImage: meta.cover,
  };
}

export function getAllExperiences(): Experience[] {
  const slugs = getAllExperienceSlugs();
  const experiences = slugs
    .map((slug) => getExperienceBySlug(slug))
    .filter((e): e is Experience => e !== null);

  // Sort by startDate descending (most recent first)
  const getSortTime = (e: Experience) => {
    if (e.meta.startDate) {
      return new Date(e.meta.startDate + "-01").getTime();
    }
    return 0;
  };

  experiences.sort((a, b) => getSortTime(b) - getSortTime(a));

  return experiences;
}
