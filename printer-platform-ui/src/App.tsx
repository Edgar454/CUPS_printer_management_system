import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layout/MainLayout";

import Dashboard from "@/pages/dashboard/Dashboard";
import Printers from "@/pages/printers/Printers";
import Jobs from "@/pages/jobs/Jobs";
import SystemPage from "@/pages/system/SystemPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/printers" element={<Printers />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/system" element={<SystemPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}