"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  subMonths,
} from "date-fns";

const PAGE_SIZE = 15;

type Period = "today" | "week" | "month" | "last3" | "last6" | "custom";

const PERIODS: { key: Period; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "last3", label: "Last 3 Months" },
  { key: "last6", label: "Last 6 Months" },
  { key: "custom", label: "Custom" },
];

function getRange(period: Period, customFrom: string, customTo: string) {
  const now = new Date();

  if (period === "today") return { start: startOfDay(now), end: endOfDay(now) };
  if (period === "week") return { start: startOfWeek(now), end: endOfDay(now) };
  if (period === "month") return { start: startOfMonth(now), end: endOfDay(now) };
  if (period === "last3") return { start: startOfDay(subMonths(now, 3)), end: endOfDay(now) };
  if (period === "last6") return { start: startOfDay(subMonths(now, 6)), end: endOfDay(now) };

  if (period === "custom" && customFrom && customTo) {
    return { start: startOfDay(new Date(customFrom)), end: endOfDay(new Date(customTo)) };
  }

  return null;
}

function fmt(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const EXPORT_COLUMNS = [
  "Visitor's Code",
  "Visitor",
  "Mobile",
  "Purpose",
  "Person To Meet",
  "Status",
  "Check In",
  "Check Out",
];

function toExportRows(list: any[]) {
  return list.map((v) => [
    v.visitor_code,
    v.full_name,
    v.mobile_number,
    v.purpose_of_visit || "-",
    v.person_to_meet || "-",
    v.status,
    fmt(v.check_in_time),
    fmt(v.check_out_time),
  ]);
}

export default function AdminPage() {

  const [visitors, setVisitors] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("reports");

  const [period, setPeriod] = useState<Period>("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const [sortKey, setSortKey] = useState("check_in_time");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = useState(1);

  const detailsRef = useRef<HTMLDivElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchVisitors();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [period, customFrom, customTo]);

  const fetchVisitors = async () => {
    try {
      const response = await fetch("/api/visitors/list", { credentials: "include" });
      const data = await response.json();
      setVisitors(Array.isArray(data.visitors) ? data.visitors : []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckOut = async (visitorId: number) => {
    try {
      const response = await fetch("/api/visitors/checkout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
      });

      if (response.ok) fetchVisitors();
    } catch (error) {
      console.log(error);
    }
  };

  function scrollToSection(section: string, ref: any) {
    setActiveSection(section);
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  }

  const range = useMemo(() => getRange(period, customFrom, customTo), [period, customFrom, customTo]);

  const selectedVisitors = useMemo(() => {
    if (!range) return visitors;

    return visitors.filter((visitor: any) => {
      if (!visitor.check_in_time) return false;
      const visitorDate = new Date(visitor.check_in_time);
      return visitorDate >= range.start && visitorDate <= range.end;
    });
  }, [visitors, range]);

  const sortedVisitors = useMemo(() => {
    const sorted = [...selectedVisitors];

    sorted.sort((a: any, b: any) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [selectedVisitors, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedVisitors.length / PAGE_SIZE));

  const paginatedVisitors = sortedVisitors.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleExportExcel = async () => {
    const XLSX = await import("xlsx");
    const sheet = XLSX.utils.aoa_to_sheet([EXPORT_COLUMNS, ...toExportRows(sortedVisitors)]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Visitors");
    XLSX.writeFile(workbook, `visitors-${period}.xlsx`);
  };

  const handleExportPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.text("Visitor Report", 14, 15);
    autoTable(doc, {
      head: [EXPORT_COLUMNS],
      body: toExportRows(sortedVisitors),
      startY: 20,
      styles: { fontSize: 8 },
    });
    doc.save(`visitors-${period}.pdf`);
  };

  const analytics = useMemo(() => {

    const checkedInVisitors = selectedVisitors.filter((v: any) => v.status === "Checked In");

    const employeeCount: any = {};
    selectedVisitors.forEach((v: any) => {
      const employee = v.person_to_meet?.trim();
      if (!employee) return;
      employeeCount[employee] = (employeeCount[employee] || 0) + 1;
    });

    const frequentEmployee =
      Object.entries(employeeCount).reduce(
        (max: any, current: any) => (current[1] > (max[1] || 0) ? current : max),
        [null, 0]
      )[0] || "N/A";

    const visitorCount: any = {};
    selectedVisitors.forEach((v: any) => {
      const name = v.full_name?.trim().toLowerCase();
      const mobile = v.mobile_number?.trim();
      if (!name || !mobile) return;
      const key = `${name}-${mobile}`;
      if (!visitorCount[key]) visitorCount[key] = { displayName: v.full_name, count: 0 };
      visitorCount[key].count++;
    });

    const frequentVisitor =
      (Object.values(visitorCount).sort((a: any, b: any) => b.count - a.count)[0] as any)
        ?.displayName || "N/A";

    const reasonCount: any = {};
    selectedVisitors.forEach((v: any) => {
      const reason = v.purpose_of_visit || "Unknown";
      reasonCount[reason] = (reasonCount[reason] || 0) + 1;
    });

    const commonReason =
      Object.entries(reasonCount).reduce(
        (max: any, current: any) => (current[1] > (max[1] || 0) ? current : max),
        [null, 0]
      )[0] || "N/A";

    const hourCount: any = {};
    checkedInVisitors.forEach((v: any) => {
      if (v.check_in_time) {
        const hour = new Date(v.check_in_time).getHours();
        hourCount[hour] = (hourCount[hour] || 0) + 1;
      }
    });

    const peakHour = Object.entries(hourCount).reduce(
      (max: any, current: any) => (current[1] > (max[1] || 0) ? current : max),
      [null, 0]
    )[0];

    const peakHourDisplay =
      peakHour !== null && peakHour !== undefined ? `${String(peakHour).padStart(2, "0")}:00` : "N/A";

    return {
      total: selectedVisitors.length,
      checkedIn: checkedInVisitors.length,
      checkedOut: selectedVisitors.filter((v: any) => v.status === "Checked Out").length,
      frequentEmployee,
      frequentVisitor,
      commonReason,
      peakHour: peakHourDisplay,
    };

  }, [selectedVisitors]);

  const periodLabel = PERIODS.find((p) => p.key === period)?.label || "Total";

  return (
    <div style={{ minHeight: "100vh", background: "#eef4fb", fontFamily: "Arial, sans-serif", position: "relative" }}>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed", top: "20px", left: "20px", width: "44px", height: "44px",
          borderRadius: "12px", border: "none", background: "#0f172a", color: "white",
          fontSize: "20px", fontWeight: "700", cursor: "pointer", zIndex: 200,
          boxShadow: "0 4px 12px rgba(15,23,42,0.2)", display: sidebarOpen ? "none" : "block",
        }}
      >
        ☰
      </button>

      {sidebarOpen && (
        <>
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.28)", zIndex: 90 }} />

          <aside style={{
            position: "fixed", top: 0, left: 0, width: "260px", height: "100vh", background: "#020617",
            padding: "24px 16px", zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <div>
                  <h1 style={{ color: "white", fontSize: "26px", fontWeight: "800", marginBottom: "4px" }}>VisitorOS</h1>
                  <p style={{ color: "#94a3b8", fontSize: "12px" }}>Admin Portal</p>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", width: "36px", height: "36px", borderRadius: "10px", cursor: "pointer", fontSize: "18px" }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button onClick={() => scrollToSection("details", detailsRef)} style={activeSection === "details" ? sidebarActive : sidebarButton}>
                  Visitor Details
                </button>

                <button onClick={() => scrollToSection("analytics", analyticsRef)} style={activeSection === "analytics" ? sidebarActive : sidebarButton}>
                  Analytics
                </button>
              </div>
            </div>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                window.location.href = "/login";
              }}
              style={logoutButton}
            >
              Logout
            </button>

          </aside>
        </>
      )}

      <main style={{ padding: "80px 24px 30px", maxWidth: "1400px", margin: "0 auto" }}>

        <div ref={reportsRef} style={{ ...sectionCard, marginTop: "24px" }}>

          <h2 style={sectionTitle}>Reports</h2>
          <p style={sectionSub}>Visitor activity for the selected period</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "22px", marginBottom: "22px" }}>
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={period === p.key ? periodButtonActive : periodButton}
              >
                {p.label}
              </button>
            ))}
          </div>

          {period === "custom" && (
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "22px" }}>
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} style={filterInput} />
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} style={filterInput} />
            </div>
          )}

          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", marginBottom: "16px" }}>
            {periodLabel} Report
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "18px" }}>
            <div style={reportCard}>
              <p style={cardLabel}>Total Visitors</p>
              <h1 style={cardValue}>{analytics.total}</h1>
            </div>

            <div style={reportCard}>
              <p style={cardLabel}>Checked In</p>
              <h1 style={cardValue}>{analytics.checkedIn}</h1>
            </div>

            <div style={reportCard}>
              <p style={cardLabel}>Checked Out</p>
              <h1 style={cardValue}>{analytics.checkedOut}</h1>
            </div>
          </div>

        </div>

        <div ref={detailsRef} style={{ ...sectionCard, marginTop: "24px" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={sectionTitle}>Visitor Details</h2>
              <p style={sectionSub}>Finalized visitor records</p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleExportExcel} style={exportButton}>Export Excel</button>
              <button onClick={handleExportPDF} style={exportButton}>Export PDF</button>
            </div>
          </div>

          <div style={{ overflowX: "auto", marginTop: "22px" }}>

            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1400px" }}>

              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={tableHeader}>Photo</th>
                  {[
                    { key: "visitor_code", label: "Visitor's Code" },
                    { key: "full_name", label: "Visitor" },
                    { key: "mobile_number", label: "Mobile" },
                    { key: "purpose_of_visit", label: "Purpose" },
                    { key: "person_to_meet", label: "Person To Meet" },
                    { key: "status", label: "Status" },
                    { key: "check_in_time", label: "Check In" },
                    { key: "check_out_time", label: "Check Out" },
                  ].map((col) => (
                    <th key={col.key} style={tableHeader} onClick={() => handleSort(col.key)}>
                      <span style={{ cursor: "pointer", userSelect: "none" as const }}>
                        {col.label}{sortKey === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                      </span>
                    </th>
                  ))}
                  <th style={tableHeader}>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedVisitors.map((visitor: any) => (
                  <tr key={visitor.id}>
                    <td style={tableCell}>
                      {visitor.photo_url ? (
                        <img src={visitor.photo_url} alt={visitor.full_name} style={photoThumbnail} />
                      ) : "-"}
                    </td>
                    <td style={tableCell}>{visitor.visitor_code}</td>
                    <td style={tableCell}>{visitor.full_name}</td>
                    <td style={tableCell}>{visitor.mobile_number}</td>
                    <td style={tableCell}>{visitor.purpose_of_visit}</td>
                    <td style={tableCell}>{visitor.person_to_meet}</td>

                    <td style={tableCell}>
                      <span style={{
                        padding: "8px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700",
                        background: visitor.status === "Checked In" ? "#dcfce7" : "#fee2e2",
                        color: visitor.status === "Checked In" ? "#166534" : "#991b1b",
                      }}>
                        {visitor.status}
                      </span>
                    </td>

                    <td style={tableCell}>{fmt(visitor.check_in_time)}</td>
                    <td style={tableCell}>{fmt(visitor.check_out_time)}</td>

                    <td style={tableCell}>
                      {visitor.status === "Checked Out" ? (
                        <span style={{ color: "#64748b", fontWeight: "600" }}>Completed</span>
                      ) : (
                        <button onClick={() => handleCheckOut(visitor.id)} style={checkoutButton}>Check Out</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px", flexWrap: "wrap", gap: "10px" }}>
            <p style={{ color: "#64748b", fontSize: "13px" }}>
              Showing {sortedVisitors.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, sortedVisitors.length)} of {sortedVisitors.length}
            </p>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={currentPage === 1 ? pageButtonDisabled : pageButton}
              >
                Prev
              </button>

              <span style={{ fontSize: "13px", color: "#334155", fontWeight: "600" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={currentPage === totalPages ? pageButtonDisabled : pageButton}
              >
                Next
              </button>
            </div>
          </div>

        </div>

        {activeSection === "analytics" && (
          <div ref={analyticsRef} style={{ ...sectionCard, marginTop: "24px", marginBottom: "30px" }}>

            <h2 style={sectionTitle}>Analytics</h2>
            <p style={sectionSub}>Visitor behavior insights</p>

            <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "18px" }}>
              <div style={reportCard}>
                <h3 style={analyticsTitle}>Frequently Visited Person</h3>
                <p style={analyticsText}>{analytics.frequentEmployee}</p>
              </div>

              <div style={reportCard}>
                <h3 style={analyticsTitle}>Most Frequent Visitor</h3>
                <p style={analyticsText}>{analytics.frequentVisitor}</p>
              </div>

              <div style={reportCard}>
                <h3 style={analyticsTitle}>Common Reason</h3>
                <p style={analyticsText}>{analytics.commonReason}</p>
              </div>

              <div style={reportCard}>
                <h3 style={analyticsTitle}>Peak Hours</h3>
                <p style={analyticsText}>{analytics.peakHour}</p>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}

const sectionCard = { background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 8px rgba(15,23,42,0.06)" };
const sectionTitle = { fontSize: "26px", fontWeight: "700", color: "#0f172a", marginBottom: "4px", letterSpacing: "-0.3px" };
const sectionSub = { color: "#64748b", fontSize: "14px" };
const filterInput = { padding: "12px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#ffffff", fontSize: "14px", outline: "none" };

const periodButton = { padding: "10px 16px", borderRadius: "999px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155", fontSize: "13px", fontWeight: "600", cursor: "pointer" };
const periodButtonActive = { ...periodButton, background: "#008779", border: "1px solid #008779", color: "white" };

const exportButton = { padding: "11px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#0f172a", fontWeight: "700", fontSize: "13px", cursor: "pointer" };

const pageButton = { padding: "8px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155", fontSize: "13px", fontWeight: "600", cursor: "pointer" };
const pageButtonDisabled = { ...pageButton, opacity: 0.4, cursor: "not-allowed" as const };

const tableHeader = { textAlign: "left" as const, padding: "16px", color: "#475569", fontSize: "12px", fontWeight: "600", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" as const };
const tableCell = { padding: "14px", borderBottom: "1px solid #f1f5f9", color: "#334155", fontSize: "14px", verticalAlign: "middle" as const };

const reportCard = { background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px" };
const cardLabel = { color: "#64748b", fontSize: "12px", marginBottom: "12px", fontWeight: "500", textTransform: "uppercase" as const };
const cardValue = { fontSize: "42px", fontWeight: "700", color: "#0f172a", margin: 0 };

const analyticsTitle = { fontSize: "12px", fontWeight: "500", color: "#64748b", marginBottom: "12px", textTransform: "uppercase" as const };
const analyticsText = { color: "#0f172a", fontSize: "28px", fontWeight: "700", margin: 0 };

const sidebarButton = { background: "transparent", border: "none", color: "#cbd5e1", padding: "12px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500", textAlign: "left" as const, width: "100%" };
const sidebarActive = { ...sidebarButton, background: "rgba(255,255,255,0.15)", color: "white", fontWeight: "600" };

const photoThumbnail = { width: "44px", height: "44px", objectFit: "cover" as const, borderRadius: "8px" };
const checkoutButton = { padding: "11px 14px", border: "none", borderRadius: "10px", background: "#ef4444", color: "white", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" as const };
const logoutButton = { background: "rgba(255,255,255,0.08)", border: "none", color: "white", padding: "13px", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px" };
