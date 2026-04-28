import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const actions = [
  { icon: "⚙", label: "Settings", path: "/settings", disabled: false },
  { icon: "→", label: "Logout", path: "/login", action: "logout" },
];

export function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();

  const handleClick = (a) => {
    if (a.action === "logout") {
      // TODO: auth cleanup
      console.log("logout");
    }

    navigate(a.path);
  };

  return (
    <div className="sidebar-footer">
      {actions.map((a) => (
        <button
          key={a.label}
          className={`sidebar-footer-btn ${a.disabled ? "disabled" : ""}`}
          onClick={() => !a.disabled && handleClick(a)}
        >
          <span className="sidebar-footer-icon">{a.icon}</span>
          {!collapsed && (
            <span className="sidebar-footer-label">{a.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}