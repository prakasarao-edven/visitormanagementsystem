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
          "/api/visitors/list"
        );

      const data =
        await response.json();

      setVisitors(
        data.visitors || []
      );

    }

    catch (error) {

      console.log(error);

    }

  };

  const scrollToSection = (
    section: string,
    ref: any
  ) => {

    setActiveSection(section);

    ref.current?.scrollIntoView({
      behavior: "smooth"
    });

    setSidebarOpen(false);

  };

  const filteredVisitors =
    visitors.filter(
      (visitor: any) => {

        const query =
          search.toLowerCase();

        const visitorDate =
          visitor.check_in_time
          ? new Date(
              visitor.check_in_time
            )
              .toISOString()
              .split("T")[0]
          : "";

        const matchesDate =
          !selectedDate ||
          visitorDate ===
            selectedDate;

        if (!query) {
          return matchesDate;
        }

        let matchesSearch =
          false;

        switch (filterType) {

          case "visitor":

            matchesSearch =
              visitor.full_name
                ?.toLowerCase()
                .includes(query);

            break;

          case "employee":

            matchesSearch =
              visitor.person_to_meet
                ?.toLowerCase()
                .includes(query);

            break;

          case "mobile":

            matchesSearch =
              visitor.mobile_number
                ?.toLowerCase()
                .includes(query);

            break;

          case "code":

            matchesSearch =
              visitor.visitor_code
                ?.toLowerCase()
                .includes(query);

            break;

          default:

            matchesSearch = (

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

        return (
          matchesSearch &&
          matchesDate
        );

      }
    );

  const checkedInVisitors =
    visitors.filter(
      (visitor) =>
        visitor.status ===
        "Checked In"
    );

  const checkedOutVisitors =
    visitors.filter(
      (visitor) =>
        visitor.status ===
        "Checked Out"
    );

  const todayVisitors =
    visitors.filter(
      (visitor) => {

        if (
          !visitor.check_in_time
        ) {
          return false;
        }

        return (

          new Date(
            visitor.check_in_time
          ).toDateString()

          ===

          new Date()
            .toDateString()

        );

      }
    );

  const analytics = useMemo(() => {

    const revisitMap: any = {};

    const employeeMap: any = {};

    const purposeMap: any = {};

    const hourMap: any = {};

    visitors.forEach(
      (visitor: any) => {

        const mobile =
          visitor.mobile_number || "-";

        if (
          !revisitMap[mobile]
        ) {

          revisitMap[mobile] = {

            count: 0,

            name:
              visitor.full_name || "-",

            mobile

          };

        }

        revisitMap[mobile]
          .count += 1;

        const employee =
          visitor.person_to_meet || "-";

        employeeMap[employee] =
          (employeeMap[employee] || 0) + 1;

        const purpose =
          visitor.purpose_of_visit || "-";

        purposeMap[purpose] =
          (purposeMap[purpose] || 0) + 1;

        if (
          visitor.check_in_time
        ) {

          const hour =
            new Date(
              visitor.check_in_time
            ).getHours();

          hourMap[hour] =
            (hourMap[hour] || 0) + 1;

        }

      }
    );

    const topVisitor =
      Object.values(
        revisitMap
      ).sort(
        (a: any, b: any) =>
          b.count - a.count
      )[0] as any;

    const topEmployee =
      Object.entries(
        employeeMap
      ).sort(
        (a: any, b: any) =>
          Number(b[1]) -
          Number(a[1])
      )[0];

    const topPurpose =
      Object.entries(
        purposeMap
      ).sort(
        (a: any, b: any) =>
          Number(b[1]) -
          Number(a[1])
      )[0];

    const peakHour =
      Object.entries(
        hourMap
      ).sort(
        (a: any, b: any) =>
          Number(b[1]) -
          Number(a[1])
      )[0];

    return {

      visitorName:
        topVisitor?.name || "-",

      visitorMobile:
        topVisitor?.mobile || "-",

      revisitCount:
        topVisitor?.count || 0,

      employee:
        topEmployee?.[0] || "-",

      purpose:
        topPurpose?.[0] || "-",

      peakHour:
        peakHour?.[0] || "-"

    };

  }, [visitors]);

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#eef4fb",
        fontFamily:
          "Arial, sans-serif",
        overflowX: "hidden"
      }}
    >

      <button
        onClick={() =>
          setSidebarOpen(
            !sidebarOpen
          )
        }
        style={{
          position: "fixed",
          top: "22px",
          left: "22px",
          width: "58px",
          height: "58px",
          borderRadius: "18px",
          border: "none",
          background: "#0f172a",
          color: "white",
          fontSize: "24px",
          fontWeight: "700",
          cursor: "pointer",
          zIndex: 200,
          boxShadow:
            "0 10px 30px rgba(15,23,42,0.18)"
        }}
      >

        {
          sidebarOpen
          ? "×"
          : "☰"
        }

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
                width: "270px",
                height: "100vh",
                background: "#020617",
                padding:
                  "100px 18px 24px",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                justifyContent:
                  "space-between"
              }}
            >

              <div>

                <div
                  style={{
                    marginBottom:
                      "36px"
                  }}
                >

                  <h1
                    style={{
                      color: "white",
                      fontSize: "28px",
                      fontWeight: "800",
                      marginBottom: "6px"
                    }}
                  >
                    VisitorOS
                  </h1>

                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "13px"
                    }}
                  >
                    Admin Portal
                  </p>

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

                  localStorage.clear();

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
          padding:
            "100px 24px 30px"
        }}
      >

        <div
          ref={detailsRef}
          style={sectionCard}
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

              onChange={(e) =>
                setFilterType(
                  e.target.value
                )
              }

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

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              style={searchInput}
            />

            <input
  type="text"

  placeholder="DD/MM/YYYY"

  value={selectedDate}

  onChange={(e) => {

    let value =
      e.target.value
        .replace(/\D/g, "");

    if (value.length >= 3) {

      value =
        value.slice(0, 2) +
        "/" +
        value.slice(2);

    }

    if (value.length >= 6) {

      value =
        value.slice(0, 5) +
        "/" +
        value.slice(5, 9);

    }

    setSelectedDate(value);

  }}

  maxLength={10}

  style={filterInput}
/>

          </div>

          <div
            style={{
              overflowX: "auto"
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                minWidth: "1200px"
              }}
            >

              <thead>

                <tr
                  style={{
                    background:
                      "#f8fafc"
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

                {

                  filteredVisitors.map(
                    (visitor: any) => (

                    <tr
                      key={visitor.id}
                    >

                      <td style={tableCell}>
                        {
                          visitor.visitor_code
                        }
                      </td>

                      <td style={tableCell}>
                        {
                          visitor.full_name
                        }
                      </td>

                      <td style={tableCell}>
                        {
                          visitor.mobile_number
                        }
                      </td>

                      <td style={tableCell}>
                        {
                          visitor.purpose_of_visit
                        }
                      </td>

                      <td style={tableCell}>
                        {
                          visitor.person_to_meet
                        }
                      </td>

                      <td style={tableCell}>

                        <span
                          style={{

                            background:

                              visitor.status ===
                              "Checked In"

                              ? "#dcfce7"

                              : "#fee2e2",

                            color:

                              visitor.status ===
                              "Checked In"

                              ? "#166534"

                              : "#991b1b",

                            padding:
                              "8px 12px",

                            borderRadius:
                              "999px",

                            fontSize: "12px",

                            fontWeight: "700"

                          }}
                        >

                          {
                            visitor.status
                          }

                        </span>

                      </td>

                      <td style={tableCell}>

                        {

                          visitor.check_in_time

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

                          : "-"

                        }

                      </td>

                      <td style={tableCell}>

                        {

                          visitor.check_out_time

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

                          : "-"

                        }

                      </td>

                    </tr>

                  ))

                }

              </tbody>

            </table>

          </div>

        </div>

        <div
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
            Operational visitor summaries
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "18px",
              marginTop: "22px"
            }}
          >

            <div style={reportCard}>

              <p style={cardLabel}>
                Total Visitors
              </p>

              <h1 style={cardValue}>
                {
                  visitors.length
                }
              </h1>

            </div>

            <div style={reportCard}>

              <p style={cardLabel}>
                Checked In
              </p>

              <h1 style={cardValue}>
                {
                  checkedInVisitors.length
                }
              </h1>

            </div>

            <div style={reportCard}>

              <p style={cardLabel}>
                Checked Out
              </p>

              <h1 style={cardValue}>
                {
                  checkedOutVisitors.length
                }
              </h1>

            </div>

            <div style={reportCard}>

              <p style={cardLabel}>
                Today's Visitors
              </p>

              <h1 style={cardValue}>
                {
                  todayVisitors.length
                }
              </h1>

            </div>

          </div>

        </div>

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
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(260px,1fr))",
              gap: "18px",
              marginTop: "22px"
            }}
          >

            <div style={reportCard}>

              <p style={cardLabel}>
                Most Frequent Visitor
              </p>

              <h3 style={analyticsTitle}>
                {
                  analytics.visitorName
                }
              </h3>

              <p style={analyticsText}>
                {
                  analytics.visitorMobile
                }
              </p>

              <p style={analyticsText}>
                {
                  analytics.revisitCount
                } revisits
              </p>

            </div>

            <div style={reportCard}>

              <p style={cardLabel}>
                Most Visited Employee
              </p>

              <h3 style={analyticsTitle}>
                {
                  analytics.employee
                }
              </h3>

            </div>

            <div style={reportCard}>

              <p style={cardLabel}>
                Top Purpose
              </p>

              <h3 style={analyticsTitle}>
                {
                  analytics.purpose
                }
              </h3>

            </div>

            <div style={reportCard}>

              <p style={cardLabel}>
                Peak Hour
              </p>

              <h3 style={analyticsTitle}>
                {
                  analytics.peakHour
                }:00
              </h3>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}

const sectionCard = {

  background: "white",

  border:
    "1px solid #dbe4f0",

  borderRadius: "24px",

  padding: "26px",

  boxShadow:
    "0 10px 30px rgba(15,23,42,0.04)"
};

const sectionTitle = {

  fontSize: "32px",

  fontWeight: "800",

  color: "#0f172a"
};

const sectionSub = {

  color: "#64748b",

  fontSize: "14px",

  marginTop: "8px"
};

const searchInput = {

  flex: 1,

  minWidth: "260px",

  padding: "15px 16px",

  borderRadius: "16px",

  border:
    "1px solid #dbe4f0",

  background: "#ffffff",

  fontSize: "14px",

  outline: "none"
};

const filterInput = {

  padding: "15px 16px",

  borderRadius: "16px",

  border:
    "1px solid #dbe4f0",

  background: "#ffffff",

  fontSize: "14px",

  outline: "none"
};

const tableHeader = {

  textAlign: "left" as const,

  padding: "18px",

  color: "#475569",

  fontSize: "12px",

  fontWeight: "800"
};

const tableCell = {

  padding: "18px",

  borderTop:
    "1px solid #f1f5f9",

  color: "#0f172a",

  fontSize: "14px"
};

const reportCard = {

  background: "#f8fafc",

  border:
    "1px solid #dbe4f0",

  borderRadius: "20px",

  padding: "24px"
};

const cardLabel = {

  color: "#64748b",

  fontSize: "13px",

  marginBottom: "14px"
};

const cardValue = {

  fontSize: "52px",

  fontWeight: "800",

  color: "#0f172a"
};

const analyticsTitle = {

  fontSize: "22px",

  fontWeight: "700",

  color: "#0f172a",

  marginBottom: "8px"
};

const analyticsText = {

  color: "#475569",

  fontSize: "14px",

  marginTop: "6px"
};

const sidebarButton = {

  background: "transparent",

  border: "none",

  color: "#cbd5e1",

  padding: "14px 16px",

  borderRadius: "14px",

  cursor: "pointer",

  fontSize: "14px",

  fontWeight: "600",

  textAlign: "left" as const,

  width: "100%",

  transition:
    "0.2s ease"
};

const sidebarActive = {

  ...sidebarButton,

  background:
    "rgba(255,255,255,0.12)",

  color: "white"
};

const logoutButton = {

  background:
    "rgba(255,255,255,0.08)",

  border: "none",

  color: "white",

  padding: "15px",

  borderRadius: "16px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "14px"
};