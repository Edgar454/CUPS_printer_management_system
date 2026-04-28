import "./Topbar.css";

export function TopbarRight() {
  return (
    <div className="topbar-right">
      <button className="topbar-icon-btn" aria-label="Notifications">
        🔔
      </button>

      <div className="topbar-avatar">AD</div>

      <span className="topbar-user">
        Admin ▾
      </span>
    </div>
  );
}