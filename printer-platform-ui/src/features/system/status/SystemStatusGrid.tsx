import "./SystemStatusGrid.css";

const stats = [
  { label: "Worker", value: "RUNNING" },
  { label: "Queue Size", value: "2" },
  { label: "CUPS", value: "CONNECTED" },
  { label: "Database", value: "HEALTHY" },
];

export function SystemStatusGrid() {
  return (
    <div className="systemGrid">
      {stats.map((s) => (
        <div key={s.label} className="systemGrid__card">
          <div className="systemGrid__label">{s.label}</div>

          <div className="systemGrid__value">
            <span className="dot" />
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}