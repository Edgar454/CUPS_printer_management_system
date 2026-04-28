import "./SystemHealthPanel.css";

type SystemItem = {
  name: string;
  sub: string;
  status: "ONLINE" | "RUNNING" | "OFFLINE" | "ERROR";
};

interface Props {
  items?: SystemItem[];
}

const defaultItems: SystemItem[] = [
  { name: "Database", sub: "Connected", status: "ONLINE" },
  { name: "CUPS Server", sub: "Connected", status: "ONLINE" },
  { name: "Worker Service", sub: "Running", status: "RUNNING" },
  { name: "File Storage", sub: "Healthy", status: "ONLINE" },
];

const statusColor = (status: SystemItem["status"]) => {
  switch (status) {
    case "ONLINE":
      return "#22c55e";
    case "RUNNING":
      return "#3b82f6";
    case "OFFLINE":
      return "#f59e0b";
    case "ERROR":
      return "#ef4444";
    default:
      return "#999";
  }
};

export function SystemHealthPanel({ items = defaultItems }: Props) {
  return (
    <div className="systemHealthPanel">
      <h3 className="systemHealthPanel__title">System Health</h3>

      <div className="systemHealthPanel__list">
        {items.map((s) => (
          <div key={s.name} className="systemHealthPanel__item">
            <div
              className="systemHealthPanel__dot"
              style={{ background: statusColor(s.status) }}
            />

            <div className="systemHealthPanel__content">
              <div className="systemHealthPanel__name">{s.name}</div>
              <div className="systemHealthPanel__sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}