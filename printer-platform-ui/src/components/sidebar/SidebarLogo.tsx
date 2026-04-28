import "./Sidebar.css";

export function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="sidebar-logo">
      <div className="sidebar-logo-icon">🖨️</div>

      {!collapsed && (
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-title">VUP</div>
          <div className="sidebar-logo-subtitle">Printer Management</div>
        </div>
      )}
    </div>
  );
}