import { useState } from "react";

import { PrinterPageHeader } from "@/features/printers/header/PrinterPageHeader";
import { FilterTabs } from "@/features/printers/filterTabs/FilterTabs";
import { PrinterCard } from "@/features/printers/printerCard/PrinterCard";
import { AddPrinterModal } from "@/features/printers/addPrinterModal/AddPrinterModal";

import { PRINTERS } from "@/mocks/printers.mock";
import type { Printer } from "@/types/printer";

import "./Printers.css";

export default function PrintersPage() {
  const [filter, setFilter] = useState<"All" | "Online" | "Offline">("All");
  const [showAdd, setShowAdd] = useState(false);
  const [printers, setPrinters] = useState<Printer[]>(PRINTERS);

  // ───── filtering logic ─────
  const filteredPrinters = printers.filter(
    (p) => filter === "All" || p.status === filter.toUpperCase()
  );

  // ───── actions ─────
  const handleAddPrinter = (newPrinter: Printer) => {
    setPrinters((prev) => [...prev, newPrinter]);
  };

  return (
    <div className="printersPage">
      {/* header */}
      <PrinterPageHeader
        onAdd={() => {console.log(showAdd); setShowAdd(true)}}
        onTestAll={() => console.log("test all printers")}
      />

      {/* filters */}
      <FilterTabs
        options={["All", "Online", "Offline"]}
        value={filter}
        onChange={setFilter}
      />

      {/* grid */}
      <div className="printersGrid">
        {filteredPrinters.map((p) => (
          <PrinterCard key={p.id} printer={p} />
        ))}
      </div>

      {/* modal */}
      {showAdd && (
        <AddPrinterModal
          open={showAdd}
          onClose={() => setShowAdd(false)}
          onSubmit={handleAddPrinter}
        />
      )}
    </div>
  );
}