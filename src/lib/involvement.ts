import fs from "fs";
import path from "path";

export {
  getInvolvementCoverPath,
  getInvolvementImagePath,
} from "./paths";

export interface InvolvementMeta {
  title: string;
  date?: string;
  semester: string;
  description: string;
  organization: string;
  icon: string;
  tags?: string[];
  cover?: string;
}

export interface Involvement {
  slug: string;
  meta: InvolvementMeta;
  images: string[];
  writeupContent: string;
  coverImage?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "involvement");

export function getAllInvolvementSlugs(): string[] {
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

export function getInvolvementBySlug(slug: string): Involvement | null {
  const involvementDir = path.join(CONTENT_DIR, slug);

  if (!fs.existsSync(involvementDir)) {
    return null;
  }

  const metaPath = path.join(involvementDir, "meta.json");
  if (!fs.existsSync(metaPath)) {
    return null;
  }

  const metaRaw = fs.readFileSync(metaPath, "utf-8");
  const meta: InvolvementMeta = JSON.parse(metaRaw);

  const imagesDir = path.join(involvementDir, "images");
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
  const mdxPath = path.join(involvementDir, "writeup.mdx");
  const mdPath = path.join(involvementDir, "writeup.md");

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

export function getAllInvolvements(): Involvement[] {
  const slugs = getAllInvolvementSlugs();
  const involvements = slugs
    .map((slug) => getInvolvementBySlug(slug))
    .filter((i): i is Involvement => i !== null);

  // Sort by date descending, falling back to year in semester if date is missing
  const getSortTime = (i: Involvement) => {
    if (i.meta.date) {
      return new Date(i.meta.date).getTime();
    }
    const years = i.meta.semester.match(/\d{4}/g);
    if (years && years.length > 0) {
      const maxYear = Math.max(...years.map(Number));
      return new Date(`${maxYear}-07-01`).getTime();
    }
    return 0;
  };

  involvements.sort((a, b) => getSortTime(b) - getSortTime(a));

  return involvements;
}
