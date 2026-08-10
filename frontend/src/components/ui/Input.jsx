import { cn } from "../../lib/utils";

export const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 outline-none transition-colors focus:border-primary-light",
      className
    )}
    {...props}
  />
);

export const Textarea = ({ className, ...props }) => (
  <textarea
    className={cn(
      "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 outline-none transition-colors focus:border-primary-light min-h-[100px]",
      className
    )}
    {...props}
  />
);

export const Label = ({ className, children, ...props }) => (
  <label className={cn("mb-1.5 block text-xs font-medium text-text-secondary", className)} {...props}>
    {children}
  </label>
);

export default Input;
