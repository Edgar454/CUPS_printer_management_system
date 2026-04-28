import "./StatsGrid.css";

const stats = [
  { label: "System Status", value: "Healthy", sub: "All systems operational", accent: "#22c55e", icon: "✓" },
  { label: "Printers", value: 0, sub: "0 online · 0 offline", accent: "#3b82f6", icon: "⎙" },
  { label: "Today's Jobs", value: 0, sub: "0 success · 0 failed", accent: "#8b5cf6", icon: "≡" },
  { label: "Scheduled", value: 0, sub: "Upcoming jobs", accent: "#f59e0b", icon: "◷" },
  { label: "Failed Jobs", value: 0, sub: "Needs attention", accent: "#ef4444", icon: "!" },
];

export function StatsGrid() {
  return (
    <div className="stats-grid">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <div className="stat-header">
            <div
              className="stat-icon"
              style={{ background: s.accent + "18", color: s.accent }}
            >
              {s.icon}
            </div>
            <span className="stat-label">{s.label}</span>
          </div>

          <div className="stat-value">{s.value}</div>
          <div className="stat-sub">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}