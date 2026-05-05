import "./Button.css"

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost"

type ButtonProps = {
  children: React.ReactNode
  variant?: ButtonVariant
  onClick?: () => void
  small?: boolean
  type?: "button" | "submit" | "reset"
}

export function Button({ children, variant = "primary", onClick, small = false, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${small ? "btn-small" : ""}`}
    >
      {children}
    </button>
  )
}