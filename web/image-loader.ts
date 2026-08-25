/**
 * Static-export image loader.
 *
 * A static export has no image optimiser, so images have to be served as the
 * files they already are. The obvious way to say that is `unoptimized: true`,
 * but that flag short-circuits the loader entirely and next/image then emits
 * the bare `src` with no basePath — so on a project page every image resolves
 * to the domain root and 404s. A custom loader is the only form that both
 * skips optimisation and honours the prefix.
 *
 * NEXT_PUBLIC_ rather than BASE_PATH because this runs in the browser bundle.
 */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({ src }: { src: string }) {
  return src.startsWith("/") ? `${base}${src}` : src;
}
