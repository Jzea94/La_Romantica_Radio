import { Radio } from "lucide-react";

const navItems = [
  { id: "inicio", label: "Inicio" },
  { id: "top", label: "Top Canciones" },
  { id: "noticias", label: "Noticias" },
];

const TopNav = ({ active, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-25 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Radio className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg neon-text">
            Salsa Romántica FM
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                active === item.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default TopNav;