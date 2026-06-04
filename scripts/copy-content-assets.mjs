#!/usr/bin/env node

/**
 * copy-content-assets.mjs
 *
 * Build-step script that copies project images and PDFs from
 * /content/projects/<slug>/ into /public/content/projects/<slug>/
 * so Vercel can serve them from its global Edge CDN.
 *
 * Run before `next build` via the "prebuild" npm script.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const CONTENT_SRC = path.join(ROOT, "content", "projects");
const PUBLIC_DEST = path.join(ROOT, "public", "content", "projects");

// File extensions to copy
const ASSET_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".pdf",
  ".avif",
]);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyAssets(srcDir, destDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      ensureDir(destPath);
      copyAssets(srcPath, destPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ASSET_EXTENSIONS.has(ext)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// ===== MAIN =====

console.log("📦 Copying content assets to public/...");

if (!fs.existsSync(CONTENT_SRC)) {
  console.log("   No content/projects/ directory found. Skipping.");
  process.exit(0);
}

// Clean previous output to avoid stale assets
if (fs.existsSync(PUBLIC_DEST)) {
  fs.rmSync(PUBLIC_DEST, { recursive: true, force: true });
}

ensureDir(PUBLIC_DEST);

const projectDirs = fs
  .readdirSync(CONTENT_SRC, { withFileTypes: true })
  .filter((d) => d.isDirectory());

let totalFiles = 0;

for (const dir of projectDirs) {
  const srcProjectDir = path.join(CONTENT_SRC, dir.name);
  const destProjectDir = path.join(PUBLIC_DEST, dir.name);
  ensureDir(destProjectDir);
  copyAssets(srcProjectDir, destProjectDir);

  // Count copied files
  const countFiles = (d) => {
    let count = 0;
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      if (entry.isDirectory()) count += countFiles(path.join(d, entry.name));
      else count++;
    }
    return count;
  };

  if (fs.existsSync(destProjectDir)) {
    const count = countFiles(destProjectDir);
    totalFiles += count;
    console.log(`   ✅ ${dir.name}: ${count} assets`);
  }
}

console.log(`\n📦 Done! Copied ${totalFiles} assets from ${projectDirs.length} projects.\n`);
