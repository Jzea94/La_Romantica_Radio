import { Home, Newspaper, TrendingUp } from "lucide-react";

const navItems = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "noticias", label: "Noticias", icon: Newspaper },
  { id: "top", label: "Top", icon: TrendingUp },
];

const BottomNav = ({ active, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-menu">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

