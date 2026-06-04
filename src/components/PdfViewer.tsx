"use client";

interface PdfViewerProps {
  src: string;
  title: string;
}

export default function PdfViewer({ src, title }: PdfViewerProps) {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-heading font-bold text-white mb-4">
        Engineering Report
      </h2>

      {/* Embedded PDF */}
      <div className="glass-card overflow-hidden">
        <iframe
          src={src}
          title={`${title} — Engineering Report`}
          className="w-full h-[600px] md:h-[800px] bg-white"
        />
      </div>

      {/* Download fallback */}
      <div className="mt-3 text-center">
        <a
          href={src}
          download
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-electric-400 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </a>
      </div>
    </div>
  );
}
