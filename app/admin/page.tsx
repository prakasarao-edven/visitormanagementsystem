"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

export default function AdminPage() {

  const [visitors, setVisitors] =
    useState<any[]>([]);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("details");

  const [search, setSearch] =
    useState("");

  const [filterType, setFilterType] =
    useState("all");

  const [selectedDate, setSelectedDate] =
    useState("");

  const detailsRef =
    useRef<HTMLDivElement>(null);

  const reportsRef =
    useRef<HTMLDivElement>(null);

  const analyticsRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    fetchVisitors();

  }, []);

  const fetchVisitors = async () => {

    try {

      const response =
        await fetch(
          "/api/visitors/list",
          {
            credentials:
              "include"
          }
        );

      const data =
        await response.json();

      setVisitors(
        Array.isArray(
          data.visitors
        )
          ? data.visitors
          : []
      );

    }

    catch (error) {

      console.log(error);

    }

  };

  function scrollToSection(
    section: string,
    ref: any
  ) {

    setActiveSection(section);

    ref.current?.scrollIntoView({
      behavior: "smooth"
    });

    setSidebarOpen(false);

  }

  const selectedVisitors =

    selectedDate

    ?

    visitors.filter(
      (visitor: any) => {

        if (
          !visitor.check_in_time
        ) {

          return false;

        }

        const visitorDate =
          new Date(
            visitor.check_in_time
          )
            .toISOString()
            .split("T")[0];

        return (
          visitorDate ===
          selectedDate
        );

      }
    )

    :

    visitors;

  const filteredVisitors =
    selectedVisitors.filter(
      (visitor: any) => {

        const query =
          search.toLowerCase();

        if (!query) {

          return true;

        }

        switch (filterType) {

          case "visitor":

            return visitor.full_name
              ?.toLowerCase()
              .includes(query);

          case "employee":

            return visitor.person_to_meet
              ?.toLowerCase()
              .includes(query);

          case "mobile":

            return visitor.mobile_number
              ?.toLowerCase()
              .includes(query);

          case "code":

            return visitor.visitor_code
              ?.toLowerCase()
              .includes(query);

          default:

            return (

              visitor.full_name
                ?.toLowerCase()
                .includes(query)

              ||

              visitor.person_to_meet
                ?.toLowerCase()
                .includes(query)

              ||

              visitor.mobile_number
                ?.toLowerCase()
                .includes(query)

              ||

              visitor.visitor_code
                ?.toLowerCase()
                .includes(query)

            );

        }

      }
    );

  const analytics = useMemo(() => {

    const checkedInVisitors = selectedVisitors.filter(
      (visitor: any) => visitor.status === "Checked In"
    );

    // Get frequently visited employee
    const employeeCount: any = {};
    selectedVisitors.forEach((visitor: any) => {
      const employee = visitor.person_to_meet || "Unknown";
      employeeCount[employee] = (employeeCount[employee] || 0) + 1;
    });
    const frequentEmployee = Object.entries(employeeCount).reduce(
      (max: any, current: any) => 
        current[1] > (max[1] || 0) ? current : max,
      [null, 0]
    )[0] || "N/A";

    // Get frequently visited visitor
    const visitorCount: any = {};
    selectedVisitors.forEach((visitor: any) => {
      const name = visitor.full_name || "Unknown";
      visitorCount[name] = (visitorCount[name] || 0) + 1;
    });
    const frequentVisitor = Object.entries(visitorCount).reduce(
      (max: any, current: any) => 
        current[1] > (max[1] || 0) ? current : max,
      [null, 0]
    )[0] || "N/A";

    // Get common reason
    const reasonCount: any = {};
    selectedVisitors.forEach((visitor: any) => {
      const reason = visitor.purpose_of_visit || "Unknown";
      reasonCount[reason] = (reasonCount[reason] || 0) + 1;
    });
    const commonReason = Object.entries(reasonCount).reduce(
      (max: any, current: any) => 
        current[1] > (max[1] || 0) ? current : max,
      [null, 0]
    )[0] || "N/A";

    // Get peak hours
    const hourCount: any = {};
    checkedInVisitors.forEach((visitor: any) => {
      if (visitor.check_in_time) {
        const hour = new Date(visitor.check_in_time).getHours();
        hourCount[hour] = (hourCount[hour] || 0) + 1;
      }
    });
    const peakHour = Object.entries(hourCount).reduce(
      (max: any, current: any) => 
        current[1] > (max[1] || 0) ? current : max,
      [null, 0]
    )[0];
    const peakHourDisplay = peakHour !== null && peakHour !== undefined 
      ? `${String(peakHour).padStart(2, '0')}:00` 
      : "N/A";

    return {

      total:
        selectedVisitors.length,

      checkedIn: checkedInVisitors.length,

      checkedOut:
        selectedVisitors.filter(
          (visitor: any) =>
            visitor.status ===
            "Checked Out"
        ).length,

      frequentEmployee,
      frequentVisitor,
      commonReason,
      peakHour: peakHourDisplay

    };

  }, [selectedVisitors]);

 return (

  <div style={{
    minHeight: "100vh",
    background: "#eef4fb",
    fontFamily: "Arial, sans-serif",
    position: "relative"
  }}>
    <button
       onClick={() => setSidebarOpen(
         !sidebarOpen
       )}
       style={{
         position: "fixed",
         top: "20px",
         left: "20px",
         width: "44px",
         height: "44px",
         borderRadius: "12px",
         border: "none",
         background: "#0f172a",
         color: "white",
         fontSize: "20px",
         fontWeight: "700",
         cursor: "pointer",
         zIndex: 200,
         boxShadow: "0 4px 12px rgba(15,23,42,0.2)",
         display: sidebarOpen ? "none" : "block"
       }}
     >

       ☰

     </button>
      
            

      {

        sidebarOpen && (

          <>

            <div
              onClick={() =>
                setSidebarOpen(false)
              }
              style={{
                position: "fixed",
                inset: 0,
                background:
                  "rgba(0,0,0,0.28)",
                zIndex: 90
              }}
            />

            <aside
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "260px",
                height: "100vh",
                background: "#020617",
                padding:
                  "24px 16px",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                justifyContent:
                  "space-between",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}
            >

              <div>

                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    marginBottom:
                      "28px"
                  }}
                >

                  <div>

                    <h1
                      style={{
                        color: "white",
                        fontSize: "26px",
                        fontWeight: "800",
                        marginBottom: "4px"
                      }}
                    >
                      VisitorOS
                    </h1>

                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px"
                      }}
                    >
                      Admin Portal
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    style={{
                      background:
                        "rgba(255,255,255,0.1)",

                      border:
                        "none",

                      color:
                        "white",

                      width:
                        "36px",

                      height:
                        "36px",

                      borderRadius:
                        "10px",

                      cursor:
                        "pointer",

                      fontSize:
                        "18px"
                    }}
                  >
                    ✕
                  </button>

                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >

                  <button
                    onClick={() =>
                      scrollToSection(
                        "reports",
                        reportsRef
                      )
                    }
                    style={
                      activeSection ===
                      "reports"
                      ? sidebarActive
                      : sidebarButton
                    }
                  >
                    Reports
                  </button>

                  <button
                    onClick={() =>
                      scrollToSection(
                        "details",
                        detailsRef
                      )
                    }
                    style={
                      activeSection ===
                      "details"
                      ? sidebarActive
                      : sidebarButton
                    }
                  >
                    Visitor Details
                  </button>

                  <button
                    onClick={() =>
                      scrollToSection(
                        "analytics",
                        analyticsRef
                      )
                    }
                    style={
                      activeSection ===
                      "analytics"
                      ? sidebarActive
                      : sidebarButton
                    }
                  >
                    Analytics
                  </button>

                </div>

              </div>

              <button
                onClick={() => {

                  window.location.href =
                    "/login";

                }}
                style={logoutButton}
              >
                Logout
              </button>

            </aside>

          </>

        )

      }

      <main
        style={{
          padding: "80px 24px 30px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}
      ><div
    ref={reportsRef}
    style={{
      ...sectionCard,
      marginTop: "24px"
    }}
  >

      <h2 style={sectionTitle}>
        Reports
      </h2>

      <p style={sectionSub}>
        Total and date-based visitor reports
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "22px",
          marginBottom: "22px",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >

        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#0f172a"
          }}
        >

          {selectedDate

            ?

            `Reports for ${selectedDate}`

            :

            "Total Reports"}

        </h3>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(
            e.target.value
          )}
          style={filterInput} />

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "18px"
        }}
      >

        <div style={reportCard}>

          <p style={cardLabel}>
            Total Visitors
          </p>

          <h1 style={cardValue}>
            {analytics.total}
          </h1>

        </div>

        <div style={reportCard}>

          <p style={cardLabel}>
            Checked In
          </p>

          <h1 style={cardValue}>
            {analytics.checkedIn}
          </h1>

        </div>

        <div style={reportCard}>

          <p style={cardLabel}>
            Checked Out
          </p>

          <h1 style={cardValue}>
            {analytics.checkedOut}
          </h1>

        </div>

      </div>

    </div><div
      ref={detailsRef}
      style={{
        ...sectionCard,
        marginTop: "24px"
      }}
    >

      <h2 style={sectionTitle}>
        Visitor Details
      </h2>

      <p style={sectionSub}>
        Finalized visitor records
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginTop: "22px",
          marginBottom: "22px"
        }}
      >

        <select
          value={filterType}
          onChange={(e) => setFilterType(
            e.target.value
          )}
          style={filterInput}
        >

          <option value="all">
            All Fields
          </option>

          <option value="visitor">
            Visitor Name
          </option>

          <option value="employee">
            Employee
          </option>

          <option value="mobile">
            Mobile
          </option>

          <option value="code">
            Visitor Code
          </option>

        </select>

        <input
          type="text"
          placeholder={`Search ${filterType}`}
          value={search}
          onChange={(e) => setSearch(
            e.target.value
          )}
          style={searchInput} />

      </div>

      <div
        style={{
          overflowX: "auto"
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "1200px"
          }}
        >

          <thead>

            <tr
              style={{
                background: "#f8fafc"
              }}
            >

              <th style={tableHeader}>
                Visitor Code
              </th>

              <th style={tableHeader}>
                Visitor
              </th>

              <th style={tableHeader}>
                Mobile
              </th>

              <th style={tableHeader}>
                Purpose
              </th>

              <th style={tableHeader}>
                Employee
              </th>

              <th style={tableHeader}>
                Status
              </th>

              <th style={tableHeader}>
                Check In
              </th>

              <th style={tableHeader}>
                Check Out
              </th>

            </tr>

          </thead>

          <tbody>
            {filteredVisitors.map(
              (visitor: any) => (

              <tr
                key={visitor.id}
              >

                <td style={tableCell}>
                  {visitor.visitor_code}
                </td>

                <td style={tableCell}>
                  {visitor.full_name}
                </td>

                <td style={tableCell}>
                  {visitor.mobile_number}
                </td>

                <td style={tableCell}>
                  {visitor.purpose_of_visit}
                </td>

                <td style={tableCell}>
                  {visitor.person_to_meet}
                </td>

                <td style={tableCell}>

                  <span
                    style={{
                      background: visitor.status ===
                        "Checked In"

                        ? "#dcfce7"

                        : "#fee2e2",

                      color: visitor.status ===
                        "Checked In"

                        ? "#166534"

                        : "#991b1b",

                      padding: "8px 12px",

                      borderRadius: "999px",

                      fontSize: "12px",

                      fontWeight: "700"
                    }}
                  >

                    {visitor.status}

                  </span>

                </td>

                <td style={tableCell}>

                  {visitor.check_in_time

                    ? new Date(
                      visitor.check_in_time
                    ).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )

                    : "-"}

                </td>

                <td style={tableCell}>

                  {visitor.check_out_time

                    ? new Date(
                      visitor.check_out_time
                    ).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )

                    : "-"}

                </td>

              </tr>

              )
            )}

          </tbody>

      </table>

    </div>

        </div>

        {activeSection === "analytics" && (
          <div
            ref={analyticsRef}
            style={{
              ...sectionCard,
              marginTop: "24px",
              marginBottom: "30px"
            }}
          >

            <h2 style={sectionTitle}>
              Analytics
            </h2>

            <p style={sectionSub}>
              Visitor behavior insights
            </p>

            <div
              style={{
                marginTop: "24px",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(260px,1fr))",
                gap: "18px"
              }}
            >

              <div style={reportCard}>

                <h3 style={analyticsTitle}>
                  Frequently Visited Employee
                </h3>

                <p style={analyticsText}>
                  {analytics.frequentEmployee}
                </p>

              </div>

              <div style={reportCard}>

                <h3 style={analyticsTitle}>
                  Frequently Visited Visitor
                </h3>

                <p style={analyticsText}>
                  {analytics.frequentVisitor}
                </p>

              </div>

              <div style={reportCard}>

                <h3 style={analyticsTitle}>
                  Common Reason
                </h3>

                <p style={analyticsText}>
                  {analytics.commonReason}
                </p>

              </div>

              <div style={reportCard}>

                <h3 style={analyticsTitle}>
                  Peak Hours
                </h3>

                <p style={analyticsText}>
                  {analytics.peakHour}
                </p>

              </div>

            </div>

          </div>
        )}

      </main>

  </div>

  );

}
const sectionCard = {

  background: "white",

  border:
    "1px solid #e2e8f0",

  borderRadius: "16px",

  padding: "32px",

  boxShadow:
    "0 2px 8px rgba(15,23,42,0.06)"
};

const sectionTitle = {

  fontSize: "26px",

  fontWeight: "700",

  color: "#0f172a",

  marginBottom: "12px",

  letterSpacing: "-0.3px"
};

const sectionSub = {

  color: "#64748b",

  fontSize: "14px",

  marginTop: "8px"
};

const searchInput = {

  flex: 1,

  minWidth: "260px",

  padding: "12px 14px",

  borderRadius: "10px",

  border:
    "1px solid #cbd5e1",

  background: "#ffffff",

  fontSize: "14px",

  outline: "none",

  transition: "border-color 0.2s ease"
};

const filterInput = {

  padding: "12px 14px",

  borderRadius: "10px",

  border:
    "1px solid #cbd5e1",

  background: "#ffffff",

  fontSize: "14px",

  outline: "none",

  transition: "border-color 0.2s ease"
};

const tableHeader = {

  textAlign: "left" as const,

  padding: "16px",

  color: "#475569",

  fontSize: "12px",

  fontWeight: "600",

  borderBottom: "1px solid #e2e8f0",

  whiteSpace: "nowrap" as const,

  letterSpacing: "0.2px"
};

const tableCell = {

  padding: "14px",

  borderBottom:
    "1px solid #f1f5f9",

  color: "#334155",

  fontSize: "14px",

  verticalAlign: "middle" as const
};

const reportCard = {

  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",

  border:
    "1px solid #e2e8f0",

  borderRadius: "14px",

  padding: "24px"
};

const cardLabel = {

  color: "#64748b",

  fontSize: "12px",

  marginBottom: "12px",

  fontWeight: "500",

  letterSpacing: "0.3px",

  textTransform: "uppercase"
};

const cardValue = {

  fontSize: "42px",

  fontWeight: "700",

  color: "#0f172a",

  margin: 0,

  letterSpacing: "-0.5px"
};

const analyticsTitle = {

  fontSize: "12px",

  fontWeight: "500",

  color: "#64748b",

  marginBottom: "12px",

  letterSpacing: "0.3px",

  textTransform: "uppercase"
};

const analyticsText = {

  color: "#0f172a",

  fontSize: "28px",

  fontWeight: "700",

  margin: 0,

  letterSpacing: "-0.3px"
};

const sidebarButton = {

  background: "transparent",

  border: "none",

  color: "#cbd5e1",

  padding: "12px 14px",

  borderRadius: "8px",

  cursor: "pointer",

  fontSize: "14px",

  fontWeight: "500",

  textAlign: "left" as const,

  width: "100%",

  transition: "all 0.2s ease"
};

const sidebarActive = {

  ...sidebarButton,

  background:
    "rgba(255,255,255,0.15)",

  color: "white",

  fontWeight: "600"
};

const logoutButton = {

  background:
    "rgba(255,255,255,0.08)",

  border: "none",

  color: "white",

  padding: "13px",

  borderRadius: "10px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "14px"
};