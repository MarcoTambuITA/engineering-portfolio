import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getProjectCoverPath,
  getProjectReportPath,
} from "@/lib/projects";
import Navbar from "@/components/Navbar";
import ImageGallery from "@/components/ImageGallery";
import PdfViewer from "@/components/PdfViewer";
import CopyButton from "@/components/CopyButton";
import { rehypeExtractRawCode } from "@/lib/rehype-extract-raw-code";
import WPTSimulatorWidget from "@/components/mdx/WPTSimulatorWidget";
import RacingSimulationWidget from "@/components/mdx/RacingSimulationWidget";

// ===== STATIC PARAMS =====

export function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ===== DYNAMIC METADATA =====

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.meta.title,
    description: project.meta.description,
    openGraph: {
      title: project.meta.title,
      description: project.meta.description,
      images: [
        {
          url: getProjectCoverPath(project.slug, project.meta.cover),
          width: 1200,
          height: 630,
          alt: project.meta.title,
        },
      ],
    },
  };
}

// ===== MDX COMPONENTS =====

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-3xl md:text-4xl font-heading font-bold text-white mt-10 mb-4"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl md:text-3xl font-heading font-bold text-white mt-8 mb-3"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="text-xl md:text-2xl font-heading font-semibold text-gray-100 mt-6 mb-3"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-gray-300 leading-relaxed mb-4" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-electric-400 hover:text-electric-300 underline underline-offset-2 transition-colors"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-inside space-y-1 mb-4 text-gray-300"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-inside space-y-1 mb-4 text-gray-300"
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-electric-500/50 pl-4 italic text-gray-400 my-4"
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pre: (props: any) => (
    <pre className="group relative" {...props}>
      {props.children}
      {props.raw && <CopyButton code={props.raw} />}
    </pre>
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="text-white font-semibold" {...props} />
  ),
  hr: () => <hr className="border-navy-600/50 my-8" />,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="text-left p-3 bg-navy-800 border border-navy-600/30 text-white font-heading font-semibold"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="p-3 border border-navy-600/30 text-gray-300" {...props} />
  ),
  WPTSimulatorWidget,
  RacingSimulationWidget,
};

// ===== PAGE COMPONENT =====

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const { meta, writeupContent, hasReport, images, slug } = project;

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-20">
        <article className="section-container max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-electric-400 transition-colors mb-8 group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to projects
          </Link>

          {/* Title & Meta */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              {meta.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              <span className="font-mono">{meta.semester}</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span>{meta.category}</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span>
                {new Date(meta.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="tech-badge text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* GitHub Link */}
            {meta.github && (
              <a
                href={meta.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-electric-400 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub →
              </a>
            )}
          </header>

          {/* Hero Image */}
          <div className="relative aspect-video rounded-xl overflow-hidden mb-12">
            <Image
              src={getProjectCoverPath(slug, meta.cover)}
              alt={meta.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>

          {/* PDF Report */}
          {hasReport && (
            <PdfViewer
              src={getProjectReportPath(slug)}
              title={meta.title}
            />
          )}

          {/* MDX Content */}
          <div className="prose-custom my-12">
            <MDXRemote
              source={writeupContent}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeExtractRawCode,
                    [
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      rehypePrettyCode as any,
                      {
                        theme: "github-dark-default",
                        keepBackground: true,
                      },
                    ],
                  ],
                },
              }}
            />
          </div>

          {/* Image Gallery */}
          <ImageGallery
            slug={slug}
            images={images}
            projectTitle={meta.title}
          />
        </article>
      </main>
    </>
  );
}
