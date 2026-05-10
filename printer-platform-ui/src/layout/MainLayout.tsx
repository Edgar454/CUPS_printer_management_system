import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Toaster } from 'react-hot-toast';

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Topbar } from "@/components/topbar/Topbar";
import { Footer } from "@/components/footer/Footer";

import "./MainLayout.css";

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} />

      <div className="layout-main">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="layout-content">
          <Outlet />
        </div>

        <Footer />
        <Toaster position="top-right" />
      </div>
    </div>
  );
}