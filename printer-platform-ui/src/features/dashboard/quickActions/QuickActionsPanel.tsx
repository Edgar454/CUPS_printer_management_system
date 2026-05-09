import "./QuickActionsPanel.css";
import { useNavigate } from "react-router-dom";

export function QuickActionsPanel() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: "⬆",
      label: "Upload File",
      sub: "Add file to print",
      onClick: () => navigate("/jobs")
    },
    {
      icon: "⎙",
      label: "Add Printer",
      sub: "Register new printer",
      onClick: () => navigate("/printers")
    },
    {
      icon: "◈",
      label: "Test Printer",
      sub: "Check printer status",
      onClick: () => navigate("/printers")
    },
    {
      icon: "◉",
      label: "System Health",
      sub: "Check all components",
      onClick: () => navigate("/system")
    },
  ]

  return (
    <div className="quickActionsPanel">
      <h3 className="quickActionsPanel__title">Quick Actions</h3>

      <div className="quickActionsPanel__grid">
        {actions.map((a) => (
          <button
            key={a.label}
            className="quickActionsPanel__card"
            onClick={a.onClick}
          >
            <div className="quickActionsPanel__icon">{a.icon}</div>
            <div className="quickActionsPanel__label">{a.label}</div>
            <div className="quickActionsPanel__sub">{a.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}