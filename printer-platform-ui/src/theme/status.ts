export function statusColor(status: string): string {
  switch (status.toUpperCase()) {
    case "ONLINE":
    case "COMPLETED":
    case "SUCCESS":
      return "#22c55e"  // green

    case "QUEUED":
    case "SCHEDULED":
      return "#3b82f6"  // blue

    case "PROCESSING":
    case "PRINTING":
    case "RUNNING":
      return "#8b5cf6"  // purple

    case "FAILED":
    case "ERROR":
    case "OFFLINE":
      return "#ef4444"  // red

    case "CANCELLED":
      return "#6b7280"  // gray

    case "RETRY":
      return "#f59e0b"  // orange

    default:
      return "#6b7280"  // gray fallback
  }
}

export function statusBg(status: string): string {
  return statusColor(status) + "18"  // 10% opacity
}