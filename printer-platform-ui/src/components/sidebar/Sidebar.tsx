import "./Sidebar.css";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <SidebarLogo collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} />
    </div>
  );
}