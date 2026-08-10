import { cn } from "../../lib/utils";

const Avatar = ({ src, alt, size = 96, className }) => (
  <div
    className={cn("overflow-hidden rounded-full border-2 border-primary-light/40 bg-surface", className)}
    style={{ width: size, height: size }}
  >
    {src ? (
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-2xl font-heading text-primary-light">
        {(alt || "J").charAt(0).toUpperCase()}
      </div>
    )}
  </div>
);

export default Avatar;
