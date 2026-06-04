# Marco Tamburini — Engineering Portfolio

Personal engineering portfolio website built with **Next.js 14**, **Tailwind CSS**, **Framer Motion**, and a **file-based MDX content system**.

> **Live site:** [marcotambu.vercel.app](https://marcotambu.vercel.app) *(deploy when ready)*

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server (auto-copies content assets)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
├── content/
│   └── projects/                    # ← YOUR PROJECTS GO HERE
│       └── wearable-accelerometer/
│           ├── meta.json            # Project metadata
│           ├── writeup.mdx          # Project writeup (Markdown/MDX)
│           ├── report.pdf           # Optional engineering report
│           └── images/
│               └── cover.jpg        # Cover + additional images
├── public/
│   ├── headshot.png                 # Your profile photo
│   └── resume.pdf                   # Your resume (TODO: add)
├── scripts/
│   └── copy-content-assets.mjs      # Copies content images → public/ at build time
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── page.tsx                 # Homepage (all sections)
│   │   └── projects/[slug]/page.tsx # Dynamic project pages
│   ├── components/                  # React components
│   │   ├── sections/                # Homepage sections (Hero, About, Skills, etc.)
│   │   └── ...                      # Shared components
│   └── lib/
│       └── projects.ts              # Content loader (scans /content/projects/)
└── tailwind.config.ts
```

---

## ➕ How to Add a New Project

**It takes 5 minutes. No code changes required.**

### Step 1: Create a folder

```
content/projects/my-new-project/
```

### Step 2: Add `meta.json`

```json
{
  "title": "My New Project",
  "date": "2025-06-01",
  "semester": "Summer 2025",
  "description": "One-sentence description of the project.",
  "tags": ["Arduino", "C++", "PCB"],
  "category": "Embedded Systems",
  "cover": "cover.jpg",
  "github": "https://github.com/MarcoTambuITA/my-project",
  "featured": true
}
```

### Step 3: Add images

Drop your cover image and any additional photos/schematics into:

```
content/projects/my-new-project/images/
├── cover.jpg        # Required — card thumbnail + hero image
├── schematic.png    # Optional — appears in gallery
└── results.png      # Optional — appears in gallery
```

> **Tip:** Resize images to ~1200px wide before adding. Keeps the site fast.

### Step 4: Write your story

Create `writeup.mdx` with normal Markdown:

```markdown
## The Problem
What problem were you solving?

## My Approach
How did you build it? Include code snippets:

\`\`\`cpp
void setup() {
  // your code here
}
\`\`\`

## Results
What did you achieve? Use tables for metrics.

## Lessons Learned
What would you do differently?
```

### Step 5: Optional — add a PDF report

Drop `report.pdf` into the project folder. It will be embedded automatically.

### Step 6: Push to GitHub

```bash
git add .
git commit -m "Add new project: my-new-project"
git push
```

Vercel auto-deploys in ~30 seconds. Done. ✅

---

## ⚙️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework, App Router, SSG |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Scroll animations, hover effects |
| [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) | Server-side MDX rendering |
| [rehype-pretty-code](https://github.com/rehype-pretty/rehype-pretty-code) | Syntax highlighting (Shiki) |
| [yet-another-react-lightbox](https://yet-another-react-lightbox.com/) | Image gallery lightbox |

---

## 🌐 Deployment

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
3. Vercel auto-detects Next.js and deploys
4. Every `git push` triggers a new deployment automatically

### Custom Domain (Free)

1. Go to [education.github.com/pack](https://education.github.com/pack)
2. Claim a free `.dev` domain with your USF `.edu` email
3. Point it to Vercel via DNS settings (~5 min setup)

---

## 📝 Content Fields Reference

### `meta.json` fields

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✅ | Project title |
| `date` | string | ✅ | ISO date (YYYY-MM-DD) for sorting |
| `semester` | string | ✅ | Display label (e.g., "Spring 2025") |
| `description` | string | ✅ | One-sentence summary for the card |
| `tags` | string[] | ✅ | Tech tags shown as pills |
| `category` | string | ✅ | Category label (e.g., "Embedded Systems") |
| `cover` | string | ✅ | Filename of cover image in images/ |
| `github` | string | ❌ | GitHub repo URL |
| `featured` | boolean | ❌ | Highlight on homepage |

---

## 📄 License

Personal portfolio — not licensed for redistribution.
