import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "../lib/utils";

const Navbar = ({ brand = "J27", navItems = [] }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 w-full transition-colors duration-300",
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="font-heading text-xl font-bold gradient-text">
          {brand}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
              {item.label}
            </a>
          ))}
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-6 py-4 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-text-secondary hover:text-text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
