import { cn } from "../../lib/utils";

export const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      "rounded-2xl border border-border bg-surface/60 backdrop-blur-sm p-6 transition-colors hover:border-primary-light/50",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Badge = ({ className, children, ...props }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border border-border bg-surface-hover px-3 py-1 text-xs font-medium text-text-secondary",
      className
    )}
    {...props}
  >
    {children}
  </span>
);

export default Card;
