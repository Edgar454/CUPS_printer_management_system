import { useState } from "react";
import useSWR, { mutate } from "swr";

import { ConfirmModal } from "@/components/confirmModal/ConfirmModal";
import { TestResultModal } from "@/features/printers/testResultModal/TestResultModal";
import { DiagnoseModal } from "@/features/printers/diagnoseModal/DiagnoseModal";
import { PrinterPageHeader } from "@/features/printers/header/PrinterPageHeader";
import { FilterTabs } from "@/features/printers/filterTabs/FilterTabs";
import { PrinterCard } from "@/features/printers/printerCard/PrinterCard";
import { AddPrinterModal } from "@/features/printers/addPrinterModal/AddPrinterModal";

import { getPrinters, createPrinter, deletePrinter, testPrinter, diagnosePrinter } from "@/services/printers";
import type { Printer, CreatePrinterPayload, PrinterTestResponse, PrinterDiagnosisResponse } from "@/types/printer";

import "./Printers.css";

const fetchPrinters = () => getPrinters()

export default function PrintersPage() {
  const [filter, setFilter] = useState<"All" | "Online" | "Offline">("All");
  const [showAdd, setShowAdd] = useState(false);
  const [printerToRemove, setPrinterToRemove] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<PrinterTestResponse | null>(null);
  const [diagnoseResult, setDiagnoseResult] = useState<PrinterDiagnosisResponse | null>(null);

  const { data: printers, error, isLoading } = useSWR<Printer[]>('/printers/', fetchPrinters, {
    refreshInterval: 10000,
  })

  const filteredPrinters = (printers ?? []).filter(
    (p) => filter === "All" || p.status === filter.toUpperCase()
  );

  const handleAddPrinter = async (payload: CreatePrinterPayload) => {
    await createPrinter(payload)
    mutate('/printers/')
    setShowAdd(false)
  }

  const handleRemovePrinter = async () => {
    if (!printerToRemove) return;
    await deletePrinter(printerToRemove);
    mutate('/printers/');
    setPrinterToRemove(null);
  }

  const handleTest = async (name: string) => {
    const result = await testPrinter(name)
    mutate('/printers/')
    setTestResult(result)
  }

  const handleDiagnose = async (name: string) => {
    const result = await diagnosePrinter(name)
    setDiagnoseResult(result)
  }

  return (
    <div className="printersPage">
      <PrinterPageHeader
        onAdd={() => setShowAdd(true)}
        onTestAll={() => console.log("test all printers")}
      />

      <FilterTabs
        options={["All", "Online", "Offline"]}
        value={filter}
        onChange={(value) => setFilter(value as "All" | "Online" | "Offline")}
      />

      <div className="printersGrid">
        {isLoading && <div className="printersGrid__spinner">⏳ Loading...</div>}
        {error && <div className="printersGrid__error">⚠️ Failed to load printers</div>}
        {!isLoading && !error && filteredPrinters.map((p) => (
          <PrinterCard
            key={p.id}
            printer={p}
            onTest={() => handleTest(p.name)}
            onRemove={() => setPrinterToRemove(p.name)}
            onDiagnose={() => handleDiagnose(p.name)}
          />
        ))}
      </div>

      {showAdd && (
        <AddPrinterModal
          open={showAdd}
          onClose={() => setShowAdd(false)}
          onSubmit={handleAddPrinter}
        />
      )}

      <ConfirmModal
        open={!!printerToRemove}
        title="Remove Printer"
        message={`Are you sure you want to remove ${printerToRemove}? This cannot be undone.`}
        onConfirm={handleRemovePrinter}
        onClose={() => setPrinterToRemove(null)}
      />

      <TestResultModal
        open={!!testResult}
        result={testResult}
        onClose={() => setTestResult(null)}
      />

      <DiagnoseModal
        open={!!diagnoseResult}
        result={diagnoseResult}
        onClose={() => setDiagnoseResult(null)}
      />
    </div>
  );
}