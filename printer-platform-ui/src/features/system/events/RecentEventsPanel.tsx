import "./RecentEventsPanel.css";

const events = [
  { icon: "⎙", msg: "Printer HP LaserJet 400 added", time: "2 min ago", color: "#22c55e" },
  { icon: "◷", msg: "Job scheduled for 18:30", time: "10 min ago", color: "#f59e0b" },
  { icon: "◈", msg: "Worker restarted", time: "30 min ago", color: "#3b82f6" },
  { icon: "!", msg: "Job failed — timeout", time: "12 min ago", color: "#ef4444" },
  { icon: "⊕", msg: "User added", time: "1h ago", color: "#8b5cf6" },
];

export function RecentEventsPanel() {
  return (
    <div className="eventsPanel">
      <h3>Recent Events</h3>

      {events.map((e, i) => (
        <div key={i} className="eventRow">
          <div className="icon" style={{ background: e.color + "20", color: e.color }}>
            {e.icon}
          </div>

          <div className="content">
            <div className="msg">{e.msg}</div>
            <div className="time">{e.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}