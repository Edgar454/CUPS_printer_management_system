export const statusColor = (s: string) => ({
  SUCCESS: "#22c55e",
  ONLINE: "#22c55e",
  FAILED: "#ef4444",
  OFFLINE: "#ef4444",
  SCHEDULED: "#f59e0b",
  PENDING: "#f59e0b",
  PROCESSING: "#3b82f6",
  RUNNING: "#22c55e",
}[s] || "#888")

export const statusBg = (s: string) => ({
  SUCCESS: "#f0fdf4",
  ONLINE: "#f0fdf4",
  FAILED: "#fef2f2",
  OFFLINE: "#fef2f2",
  SCHEDULED: "#fffbeb",
  PENDING: "#fffbeb",
}[s] || "#f5f5f5")