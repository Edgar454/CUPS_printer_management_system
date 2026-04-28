import "./QuickActionsPanel.css";

type Action = {
  icon: string;
  label: string;
  sub: string;
  onClick?: () => void;
};

interface Props {
  actions?: Action[];
}

const defaultActions: Action[] = [
  { icon: "⬆", label: "Upload File", sub: "Add file to print" },
  { icon: "⎙", label: "Add Printer", sub: "Register new printer" },
  { icon: "◈", label: "Test Printer", sub: "Check printer status" },
  { icon: "⊕", label: "Add User", sub: "Create new user" },
  { icon: "◉", label: "System Health", sub: "Check all components" },
];

export function QuickActionsPanel({ actions = defaultActions }: Props) {
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