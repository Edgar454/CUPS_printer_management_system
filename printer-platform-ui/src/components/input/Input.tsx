import "./Input.css"

type InputProps = {
  label: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: InputProps) {
  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>

      <input
        className="input-field"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}