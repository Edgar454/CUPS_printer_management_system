import "./Badge.css"
import { statusColor, statusBg } from "@/theme/status"

export type BadgeProps = {
  status: string
}

export function Badge({ status }: BadgeProps) {
  return (
    <span
      className="badge"
      style={{
        color: statusColor(status),
        background: statusBg(status),
        borderColor: `${statusColor(status)}22`,
      }}
    >
      <span
        className="badge-dot"
        style={{
          background: statusColor(status),
        }}
      />
      {status}
    </span>
  )
}