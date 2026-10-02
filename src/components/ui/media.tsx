"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import type { ImageAsset } from "@/types/content";

export function Portrait({ image }: { image?: ImageAsset }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="portrait" data-testid="portrait">
      {image && !failed ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 768px) 192px, 96px"
          style={{ objectPosition: image.focalPosition ?? "50% 50%" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="portrait-initials"
          role="img"
          aria-label="Matthew Gallardo initials placeholder"
        >
          <span>
            MG<span className="accent">.</span>
          </span>
          <span className="portrait-caption" aria-hidden="true">
            MATTHEW GALLARDO
          </span>
        </div>
      )}
    </div>
  );
}

export function ProjectMedia({
  image,
  name,
  index,
  compact,
}: {
  image?: ImageAsset;
  name: string;
  index: number;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`project-media ${compact ? "compact-media" : ""}`}>
      {image && !failed ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={
            compact
              ? "(min-width: 768px) 128px, 100vw"
              : "(min-width: 768px) 360px, 100vw"
          }
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="project-placeholder"
          role="img"
          aria-label={`${name} project preview placeholder`}
        >
          <span className="preview-number" aria-hidden="true">
            {String(index).padStart(2, "0")}
          </span>
          <ImageIcon size={20} strokeWidth={1.25} aria-hidden="true" />
          <span className="preview-label">Project preview</span>
        </div>
      )}
    </div>
  );
}

export function WakaTimeImage({
  src,
  alt,
  chart = false,
}: {
  src: string;
  alt: string;
  chart?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={chart ? "activity-chart" : "activity-badge"}>
      {failed ? (
        <p className="media-error" role="status">
          WakaTime statistics are temporarily unavailable.
        </p>
      ) : (
        // Public provider SVGs stay external and do not pass through the raster optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={chart ? 800 : 191}
          height={chart ? 600 : 20}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
