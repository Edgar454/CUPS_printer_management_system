import "./FilterTabs.css";

interface Props {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterTabs({ options, value, onChange }: Props) {
  return (
    <div className="filterTabs">
      {options.map((option) => {
        const active = value === option;

        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`filterTabs__tab ${active ? "active" : ""}`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}