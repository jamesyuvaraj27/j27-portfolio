import { cn } from "../../lib/utils";

const VARIANTS = {
  primary: "bg-primary hover:bg-primary-light text-white shadow-glow",
  outline: "border border-border hover:border-primary-light text-text-primary bg-transparent",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
  accent: "bg-accent hover:bg-accent-light text-background",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const Button = ({ as: Component = "button", variant = "primary", size = "md", className, children, ...props }) => (
  <Component
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
      VARIANTS[variant],
      SIZES[size],
      className
    )}
    {...props}
  >
    {children}
  </Component>
);

export default Button;
