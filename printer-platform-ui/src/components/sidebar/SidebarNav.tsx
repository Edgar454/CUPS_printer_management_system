import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/constants/navItems";
import "./Sidebar.css";

export function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sidebar-nav">
      {NAV_ITEMS.map((n) => {
        const active = location.pathname === n.path;

        return (
          <button
            key={n.id}
            onClick={() => navigate(n.path)}
            className={`sidebar-item ${active ? "active" : ""}`}
          >
            <span className="sidebar-icon">{n.icon}</span>

            {!collapsed && (
              <span className={`sidebar-label ${active ? "active" : ""}`}>
                {n.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}