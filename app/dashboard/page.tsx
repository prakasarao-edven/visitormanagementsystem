"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";

export default function DashboardPage() {

  const [visitors, setVisitors] =
    useState<any[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showActiveOnly, setShowActiveOnly] =
    useState(false);

  const [
    sidebarCollapsed,
    setSidebarCollapsed
  ] = useState(true);

  const [isMobile, setIsMobile] =
    useState(false);

  const [
    activeSection,
    setActiveSection
  ] = useState("dashboard");

  const analyticsRef =
    useRef<HTMLDivElement>(null);

  const visitorsRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    const checkMobile = () => {

      setIsMobile(
        window.innerWidth < 768
      );

    };

    checkMobile();

    window.addEventListener(
      "resize",
      checkMobile
    );

    return () =>
      window.removeEventListener(
        "resize",
        checkMobile
      );

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

      if (
        response.ok &&
        Array.isArray(data.visitors)
      ) {

        setVisitors(
          data.visitors
        );

      }

      else {

        setVisitors([]);

      }

    }

    catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchVisitors();

  }, []);

  const handleCheckOut = async (
    visitorId: number
  ) => {

    try {

      const response =
        await fetch(
          "/api/visitors/checkout",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              visitorId
            })

          }
        );

      if (response.ok) {

        fetchVisitors();

      }

    }

    catch (error) {

      console.log(error);

    }

  };

  const today =
    new Date()
      .toDateString();

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

          today

        );

      }
    );

  const filteredVisitors =
    todayVisitors.filter(
      (visitor) => {

        const matchesSearch =

          visitor.full_name
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )

          ||

          visitor.mobile_number
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )

          ||

          visitor.visitor_code
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesActive =

          showActiveOnly

          ? visitor.status ===
            "Checked In"

          : true;

        return (
          matchesSearch &&
          matchesActive
        );

      }
    );

  const mostCommonPurpose =

    todayVisitors.length > 0

    ? Object.entries(

        todayVisitors.reduce(
          (acc: any, visitor: any) => {

            const purpose =
              visitor.purpose_of_visit || "Unknown";

            acc[purpose] =
              (acc[purpose] || 0) + 1;

            return acc;

          },
          {}
        )

      ).sort(
        (a: any, b: any) =>
          b[1] - a[1]
      )[0][0]

    : "-";

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #dbeafe, #f8fafc)",
        fontFamily:
          "Arial, sans-serif",
        position: "relative"
      }}
    >
      {

        isMobile &&
        !sidebarCollapsed && (

          <div
            onClick={() =>
              setSidebarCollapsed(true)
            }
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "rgba(0,0,0,0.3)",
              zIndex: 20
            }}
          />

        )

      }

      <aside
        style={{
          width:
            sidebarCollapsed
            ? "0px"
            : "240px",

          background:
            "#004B87",

          color:
            "white",

          padding:
            sidebarCollapsed
            ? "0px"
            : "22px 16px",

          overflow:
            "hidden",

          transition:
            "0.25s",

          position:
            "fixed",

          top: 0,

          left: 0,

          height:
            "100vh",

          zIndex: 30,

          display:
            "flex",

          flexDirection:
            "column",

          justifyContent:
            "space-between"
        }}
      >

        {

          !sidebarCollapsed && (

            <>

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
                        fontSize:
                          "26px",

                        fontWeight:
                          "800",

                        marginBottom:
                          "4px"
                      }}
                    >
                      VisitorOS
                    </h1>

                    <p
                      style={{
                        fontSize:
                          "12px",

                        color:
                          "#dbeafe"
                      }}
                    >
                      Security Panel
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setSidebarCollapsed(true)
                    }
                    style={{
                      background:
                        "rgba(255,255,255,0.18)",

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
                        "16px"
                    }}
                  >
                    ✕
                  </button>

                </div>

                <div
                  style={{
                    display:
                      "flex",

                    flexDirection:
                      "column",

                    gap:
                      "8px"
                  }}
                >

                  <button
                    onClick={() => {

                      setActiveSection(
                        "dashboard"
                      );

                      setShowActiveOnly(false);

                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth"
                      });

                    }}
                    style={
                      activeSection ===
                      "dashboard"

                      ?

                      sidebarButtonActive

                      :

                      sidebarButton
                    }
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => {

                      setActiveSection(
                        "registrations"
                      );

                      setShowActiveOnly(false);

                      visitorsRef.current
                        ?.scrollIntoView({
                          behavior:
                            "smooth"
                        });

                    }}
                    style={
                      activeSection ===
                      "registrations"

                      ?

                      sidebarButtonActive

                      :

                      sidebarButton
                    }
                  >
                    Registrations
                  </button>

                  <button
                    onClick={() => {

                      setActiveSection(
                        "active"
                      );

                      setShowActiveOnly(true);

                      visitorsRef.current
                        ?.scrollIntoView({
                          behavior:
                            "smooth"
                        });

                    }}
                    style={
                      activeSection ===
                      "active"

                      ?

                      sidebarButtonActive

                      :

                      sidebarButton
                    }
                  >
                    Active Visitors
                  </button>

                  <button
                    onClick={() => {

                      setActiveSection(
                        "analytics"
                      );

                      analyticsRef.current
                        ?.scrollIntoView({
                          behavior:
                            "smooth"
                        });

                    }}
                    style={
                      activeSection ===
                      "analytics"

                      ?

                      sidebarButtonActive

                      :

                      sidebarButton
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

            </>

          )

        }

      </aside>

      <main
        style={{
          flex: 1,
          padding:
            isMobile
            ? "12px"
            : "24px"
        }}
      >
        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            marginBottom:
              "16px"
          }}
        >

          <button
            onClick={() =>
              setSidebarCollapsed(
                !sidebarCollapsed
              )
            }
            style={{
              background:
                "#004B87",

              border:
                "none",

              color:
                "white",

              width:
                "40px",

              height:
                "40px",

              borderRadius:
                "10px",

              cursor:
                "pointer",

              fontSize:
                "18px"
            }}
          >
            ☰
          </button>

          <div
            style={{
              fontSize:
                isMobile
                ? "14px"
                : "15px",

              color:
                "#64748b",

              fontWeight:
                "600"
            }}
          >
            {
              new Date()
                .toLocaleDateString()
            }
          </div>

        </div>

        <div
          style={{
            marginBottom:
              "18px"
          }}
        >

          <h1
            style={{
              fontSize:
                isMobile
                ? "28px"
                : "40px",

              fontWeight:
                "800",

              color:
                "#0f172a",

              marginBottom:
                "4px"
            }}
          >
            Security Dashboard
          </h1>

          <p
            style={{
              color:
                "#64748b",

              fontSize:
                isMobile
                ? "13px"
                : "15px"
            }}
          >
            Live operational visitor monitoring
          </p>

        </div>

        <input
          type="text"
          placeholder="Search visitors"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          style={{
            width:
              "100%",

            padding:
              "13px 14px",

            borderRadius:
              "14px",

            border:
              "1px solid #cbd5e1",

            background:
              "white",

            fontSize:
              "14px",

            outline:
              "none",

            marginBottom:
              "14px",

            boxSizing:
              "border-box"
          }}
        />

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              isMobile
              ? "1fr"
              : "repeat(3, 1fr)",

            gap:
              "10px",

            marginBottom:
              "14px"
          }}
        >

          <div style={miniCard}>
            <p style={miniLabel}>
              Headcount
            </p>
            <h2 style={miniValue}>
              {todayVisitors.length}
            </h2>
          </div>

          <div style={miniCard}>
            <p style={miniLabel}>
              Check Ins
            </p>
            <h2 style={miniValue}>
              {
                todayVisitors.filter(
                  (v) =>
                    v.status ===
                    "Checked In"
                ).length
              }
            </h2>
          </div>

          <div style={miniCard}>
            <p style={miniLabel}>
              Check Outs
            </p>
            <h2 style={miniValue}>
              {
                todayVisitors.filter(
                  (v) =>
                    v.status ===
                    "Checked Out"
                ).length
              }
            </h2>
          </div>

        </div>

        <button
          onClick={() =>
            setShowActiveOnly(
              !showActiveOnly
            )
          }
          style={{
            ...filterButton,
            width: "100%",
            marginBottom: "16px"
          }}
        >

          {
            showActiveOnly
            ? "Showing Active Visitors"
            : "Show Active Only"
          }

        </button>

        <div ref={visitorsRef}>

          <div
            style={{
              background:
                "white",

              borderRadius:
                "18px",

              border:
                "1px solid #dbe4f0",

              overflow:
                "hidden"
            }}
          >

            <div
              style={{
                overflowX:
                  "auto",

                maxHeight:
                  "75vh"
              }}
            >

              <table
                style={{
                  width:
                    "100%",

                  borderCollapse:
                    "collapse",

                  minWidth:
                    "1200px"
                }}
              >

                <thead>

                  <tr
                    style={{
                      background:
                        "#eff6ff"
                    }}
                  >

                    <th style={tableHeader}>Code</th>
                    <th style={tableHeader}>Visitor</th>
                    <th style={tableHeader}>Mobile</th>
                    <th style={tableHeader}>Purpose</th>
                    <th style={tableHeader}>Person To Meet</th>
                    <th style={tableHeader}>Status</th>
                    <th style={tableHeader}>Check In</th>
                    <th style={tableHeader}>Check Out</th>
                    <th style={tableHeader}>Action</th>

                  </tr>

                </thead>

                <tbody>
                  {

                    filteredVisitors.map(
                      (visitor) => (

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
                          {
                            visitor.purpose_of_visit
                            || "-"
                          }
                        </td>

                        <td style={tableCell}>
                          {
                            visitor.person_to_meet
                            || "-"
                          }
                        </td>

                        <td style={tableCell}>

                          <span
                            style={{

                              padding:
                                "6px 12px",

                              borderRadius:
                                "999px",

                              fontSize:
                                "13px",

                              fontWeight:
                                "700",

                              background:

                                visitor.status ===
                                "Checked In"

                                ? "#dcfce7"

                                : "#fee2e2",

                              color:

                                visitor.status ===
                                "Checked In"

                                ? "#166534"

                                : "#991b1b"

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
                              ).toLocaleString()

                            : "-"
                          }

                        </td>

                        <td style={tableCell}>

                          {

                            visitor.check_out_time

                            ? new Date(
                                visitor.check_out_time
                              ).toLocaleString()

                            : "-"
                          }

                        </td>

                        <td style={tableCell}>

                          {

                            visitor.status ===
                            "Checked Out"

                            ? (

                              <span
                                style={{
                                  color:
                                    "#64748b",

                                  fontWeight:
                                    "600"
                                }}
                              >
                                Completed
                              </span>

                            )

                            : (

                              <button
                                onClick={() =>
                                  handleCheckOut(
                                    visitor.id
                                  )
                                }
                                style={
                                  checkoutButton
                                }
                              >
                                Check Out
                              </button>

                            )

                          }

                        </td>

                      </tr>

                    ))

                  }

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {

          activeSection ===
          "analytics"

          && (

            <div
              ref={analyticsRef}
              style={{
                marginTop: "24px",
                background: "white",
                borderRadius: "18px",
                border: "1px solid #dbe4f0",
                padding: "24px"
              }}
            >

              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "#0f172a",
                  marginBottom: "8px"
                }}
              >
                Visitor Analytics
              </h2>

              <p
                style={{
                  color: "#64748b",
                  marginBottom: "24px"
                }}
              >
                Daily visitor insights
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    isMobile
                    ? "1fr"
                    : "repeat(3, 1fr)",
                  gap: "16px"
                }}
              >

                <div style={analyticsBox}>

                  <p style={analyticsTitle}>
                    Most Common Purpose
                  </p>

                  <h3 style={analyticsValueText}>
                    {mostCommonPurpose}
                  </h3>

                </div>

                <div style={analyticsBox}>

                  <p style={analyticsTitle}>
                    Checked In
                  </p>

                  <h3 style={analyticsValueText}>

                    {

                      todayVisitors.filter(
                        (v) =>
                          v.status === "Checked In"
                      ).length

                    }

                  </h3>

                </div>

                <div style={analyticsBox}>

                  <p style={analyticsTitle}>
                    Checked Out
                  </p>

                  <h3 style={analyticsValueText}>

                    {

                      todayVisitors.filter(
                        (v) =>
                          v.status === "Checked Out"
                      ).length

                    }

                  </h3>

                </div>

              </div>

            </div>

          )

        }

      </main>

    </div>

  );

}

const sidebarButton = {

  background:
    "transparent",

  border:
    "none",

  color:
    "white",

  textAlign:
    "left" as const,

  padding:
    "12px 14px",

  borderRadius:
    "12px",

  fontSize:
    "14px",

  cursor:
    "pointer"

};

const sidebarButtonActive = {

  ...sidebarButton,

  background:
    "rgba(255,255,255,0.15)",

  fontWeight:
    "600"

};

const logoutButton = {

  background:
    "rgba(255,255,255,0.18)",

  border:
    "none",

  color:
    "white",

  padding:
    "13px",

  borderRadius:
    "12px",

  cursor:
    "pointer",

  fontWeight:
    "700"

};

const miniCard = {

  background:
    "white",

  border:
    "1px solid #e2e8f0",

  borderRadius:
    "12px",

  padding:
    "20px",

  textAlign:
    "center" as const,

  boxShadow:
    "0 2px 8px rgba(15,23,42,0.04)"

};

const miniLabel = {

  fontSize:
    "11px",

  color:
    "#64748b",

  marginBottom:
    "10px",

  fontWeight: "500",

  letterSpacing: "0.3px",

  textTransform: "uppercase"

};

const miniValue = {

  margin: 0,

  fontSize:
    "32px",

  fontWeight:
    "700",

  color:
    "#0f172a",

  letterSpacing: "-0.3px"

};

const filterButton = {

  padding:
    "12px 16px",

  border:
    "none",

  borderRadius:
    "10px",

  background:
    "#004B87",

  color:
    "white",

  fontWeight:
    "600",

  cursor:
    "pointer",

  fontSize:
    "14px",

  transition:
    "all 0.2s ease",

  boxShadow:
    "0 2px 8px rgba(0,75,135,0.2)"
};

const tableHeader = {

  textAlign:
    "left" as const,

  padding:
    "16px",

  fontSize:
    "12px",

  color:
    "#475569",

  borderBottom:
    "1px solid #e2e8f0",

  whiteSpace:
    "nowrap",

  fontWeight: "600",

  letterSpacing: "0.2px"

};

const tableCell = {

  padding:
    "14px",

  borderBottom:
    "1px solid #f1f5f9",

  color:
    "#334155",

  fontSize:
    "14px",

  verticalAlign:
    "middle" as const

};

const checkoutButton = {

  padding:
    "11px 14px",

  border:
    "none",

  borderRadius:
    "10px",

  background:
    "#ef4444",

  color:
    "white",

  fontWeight:
    "700",

  cursor:
    "pointer",

  whiteSpace:
    "nowrap"

};

const analyticsBox = {

  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",

  border: "1px solid #e2e8f0",

  borderRadius: "12px",

  padding: "24px",

  boxShadow: "0 2px 8px rgba(15,23,42,0.04)"

};

const analyticsTitle = {

  color: "#64748b",

  fontSize: "12px",

  marginBottom: "12px",

  fontWeight: "500",

  letterSpacing: "0.3px",

  textTransform: "uppercase"

};

const analyticsValueText = {

  fontSize: "28px",

  fontWeight: "700",

  color: "#0f172a",

  margin: 0,

  letterSpacing: "-0.3px"

};