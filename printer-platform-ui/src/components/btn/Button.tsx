import "./Button.css"

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost"

type ButtonProps = {
  children: React.ReactNode
  variant?: ButtonVariant
  onClick?: () => void
  small?: boolean
}

export function Button({
  children,
  variant = "primary",
  onClick,
  small = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant} ${small ? "btn-small" : ""}`}
    >
      {children}
    </button>
  )
}