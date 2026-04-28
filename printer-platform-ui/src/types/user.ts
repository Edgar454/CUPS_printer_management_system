export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER"

export type User = {
  id: number
  email: string
  role: UserRole
  permissions: string
  initials: string
}