import "./Topbar.css";
import { TopbarLeft } from "./TopBarLeft";
import { TopbarSearch } from "./TopBarSearch";
import { TopbarRight } from "./TopBarRight";

export function Topbar({ collapsed, setCollapsed, page }: any) {
  return (
    <div className="topbar">
      <TopbarLeft
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        page={page}
      />

      <div className="topbar-spacer" />

      <TopbarSearch />

      <TopbarRight />
    </div>
  );
}