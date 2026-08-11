import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import SectionKicker from "../SectionKicker";
import { EASE, viewportOnce } from "../../lib/motion";
import { useColumnCount } from "../../lib/useColumnCount";
import { mediaUrl } from "../../lib/utils";

// Alternating parallax offsets per column, mirroring the reference site's
// "The Archive" section — each column drifts at a different speed/direction
// as the section scrolls through view. Fixed hook count (rules-of-hooks safe)
// regardless of how many columns are actually rendered.
const useParallaxColumns = (scrollYProgress) => {
  const y0 = useTransform(scrollYProgress, [0, 1], [40, -100]);
  const y1 = useTransform(scrollYProgress, [0, 1], [-60, 80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -120]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-40, 60]);
  return [y0, y1, y2, y3];
};

const GalleryColumn = ({ photos, y }) => (
  <motion.div style={{ y }} className="flex flex-1 flex-col gap-4">
    {photos.map((photo) => (
      <motion.div
        key={photo.id}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6, ease: EASE }}
        className="group relative overflow-hidden rounded-xl border border-border"
      >
        <img
          src={mediaUrl(photo.image)}
          alt={photo.alt || photo.title}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {(photo.title || photo.description) && (
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/90 via-background/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {photo.title && <p className="text-sm font-semibold text-text-primary">{photo.title}</p>}
            {photo.description && <p className="text-xs text-text-secondary">{photo.description}</p>}
          </div>
        )}
      </motion.div>
    ))}
  </motion.div>
);

const GallerySection = ({ photos = [] }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const columnYs = useParallaxColumns(scrollYProgress);
  const columnCount = useColumnCount({ base: 2, sm: 3, lg: 4 });

  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    photos.forEach((photo, i) => cols[i % columnCount].push(photo));
    return cols;
  }, [photos, columnCount]);

  if (photos.length === 0) return null;

  return (
    <section ref={sectionRef} id="gallery" className="mx-auto max-w-6xl px-6 py-32">
      <SectionKicker number="06" label="Gallery" />
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE }}
        className="mb-14 max-w-2xl text-3xl font-bold sm:text-4xl"
      >
        Behind the <span className="gradient-text italic">work</span>.
      </motion.h2>

      <div className="flex gap-4">
        {columns.map((colPhotos, i) => (
          <GalleryColumn key={i} photos={colPhotos} y={columnYs[i % columnYs.length]} />
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
