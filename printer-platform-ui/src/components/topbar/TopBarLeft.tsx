import "./Topbar.css";

export function TopbarLeft({ collapsed, setCollapsed, page }: any) {
  const title = page === "jobs" ? "Files & Jobs" : page;

  return (
    <div className="topbar-left">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="topbar-toggle-btn"
      >
        ☰
      </button>

      <h1 className="topbar-title">{title}</h1>
    </div>
  );
}