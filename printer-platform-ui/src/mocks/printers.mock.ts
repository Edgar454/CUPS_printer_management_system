import type { Printer } from "@/types/printer";

export const PRINTERS: Printer[] = [
  { id: 1, name: "HP LaserJet 400", ip: "192.168.1.101", status: "ONLINE", queue: 0, lastActivity: "2 min ago" },
  { id: 2, name: "Canon iR-ADV C5535", ip: "192.168.1.102", status: "ONLINE", queue: 1, lastActivity: "5 min ago" },
  { id: 3, name: "Office Printer 1", ip: "192.168.1.103", status: "ONLINE", queue: 0, lastActivity: "12 min ago" },
  { id: 4, name: "Brother MFC-L8900", ip: "192.168.1.104", status: "OFFLINE", queue: 0, lastActivity: "2h ago" },
  { id: 5, name: "Xerox WorkCentre 6515", ip: "192.168.1.105", status: "OFFLINE", queue: 0, lastActivity: "1d ago" },
];