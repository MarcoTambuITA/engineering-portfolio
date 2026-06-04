"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getProjectImagePath } from "@/lib/paths";

// Dynamically import lightbox to reduce initial bundle size
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

// Import lightbox CSS
import "yet-another-react-lightbox/styles.css";

interface ImageGalleryProps {
  slug: string;
  images: string[];
  projectTitle: string;
}

export default function ImageGallery({
  slug,
  images,
  projectTitle,
}: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (images.length === 0) return null;

  const slides = images.map((img) => ({
    src: getProjectImagePath(slug, img),
    alt: `${projectTitle} — ${img.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}`,
  }));

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold text-white mb-6">
        Gallery
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => {
              setLightboxIndex(i);
              setLightboxOpen(true);
            }}
            className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
          >
            <Image
              src={getProjectImagePath(slug, img)}
              alt={`${projectTitle} — ${img.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/30 transition-colors flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                🔍 Expand
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={slides}
          styles={{
            container: { backgroundColor: "rgba(10, 15, 30, 0.95)" },
          }}
        />
      )}
    </div>
  );
}
