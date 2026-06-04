import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import {
  getAllInvolvementSlugs,
  getInvolvementBySlug,
} from "@/lib/involvement";
import Navbar from "@/components/Navbar";
import ImageGallery from "@/components/ImageGallery";
import CopyButton from "@/components/CopyButton";
import { rehypeExtractRawCode } from "@/lib/rehype-extract-raw-code";
import { getInvolvementCoverPath } from "@/lib/paths";

// ===== STATIC PARAMS =====

export function generateStaticParams() {
  const slugs = getAllInvolvementSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ===== DYNAMIC METADATA =====

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const involvement = getInvolvementBySlug(params.slug);

  if (!involvement) {
    return { title: "Involvement Not Found" };
  }

  return {
    title: involvement.meta.title,
    description: involvement.meta.description,
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
};

// ===== PAGE COMPONENT =====

export default function InvolvementPage({
  params,
}: {
  params: { slug: string };
}) {
  const involvement = getInvolvementBySlug(params.slug);

  if (!involvement) {
    notFound();
  }

  const { meta, writeupContent, images, slug } = involvement;

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-20">
        <article className="section-container max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/#involvement"
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
            Back to involvement
          </Link>

          {/* Title & Meta */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              {meta.organization} - {meta.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              <span className="font-mono">{meta.semester}</span>
              {meta.date && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span>
                    {new Date(meta.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>

            {/* Tech Tags */}
            {meta.tags && meta.tags.length > 0 && (
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
            )}
          </header>



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
          {images && images.length > 0 && (
            <ImageGallery
              slug={slug}
              images={images}
              projectTitle={meta.title}
              type="involvement"
            />
          )}
        </article>
      </main>
    </>
  );
}
