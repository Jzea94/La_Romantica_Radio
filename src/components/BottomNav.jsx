import { NavLink } from "react-router-dom";
import { Home, Newspaper, TrendingUp } from "lucide-react";

const navItems = [
  { path: "/", label: "Inicio", icon: Home },
  { path: "/noticias", label: "Noticias", icon: Newspaper },
  { path: "/top", label: "Top", icon: TrendingUp },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-menu">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 px-4 py-2 transition-all duration-300
                ${isActive 
                  ? "text-primary scale-110" 
                  : "text-muted-foreground hover:text-primary/70"}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-wide">
                {item.label}
              </span>
              
              {/* Indicador visual activo (opcional) */}
              <div className="active-indicator h-1 w-1 rounded-full bg-primary opacity-0 transition-opacity" />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;