import AnimatedSection from "../AnimatedSection";
import SectionHeading from "../SectionHeading";
import { mediaUrl } from "../../lib/utils";

const GallerySection = ({ photos = [] }) => {
  if (photos.length === 0) return null;

  return (
    <AnimatedSection id="gallery" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Gallery" title="Behind the Work" />

      <div className="columns-2 gap-4 sm:columns-3">
        {photos.map((photo) => (
          <div key={photo.id} className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border">
            <img src={mediaUrl(photo.image)} alt={photo.alt || photo.title} className="w-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default GallerySection;
