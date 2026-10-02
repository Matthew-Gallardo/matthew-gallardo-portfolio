import "server-only";
import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";
import type { ImageAsset } from "@/types/content";

export function availableImage(image?: ImageAsset): ImageAsset | undefined {
  if (!image || !image.src.startsWith("/images/")) return undefined;
  const root = resolve(process.cwd(), "public");
  const file = resolve(root, `.${image.src}`);
  return file.startsWith(root + sep) && existsSync(file) ? image : undefined;
}
