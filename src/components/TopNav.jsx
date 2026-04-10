import { NavLink } from "react-router-dom";
import { Radio } from "lucide-react";

const navItems = [
  { path: "/", label: "Inicio" },
  { path: "/noticias", label: "Noticias" },
  { path: "/musica", label: "Musica" },
];

const TopNav = () => {
  return (
    <header className="sticky top-0 z-50 glass-menu border-b border-border">
      <div className="container mx-auto px-4 md:px-8 lg:px-25 flex items-center justify-between h-16">
        {/* Logo - Ahora es un link al inicio */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <Radio className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
          <span className="font-display font-bold text-lg neon-text">
            La Romántica Radio
          </span>
        </NavLink>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"}
              `}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default TopNav;