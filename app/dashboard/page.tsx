"use client";

import { useEffect, useRef, useState } from "react";

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
          "/api/visitors/list"
        );

      const data =
        await response.json();

      setVisitors(data.visitors);

    } catch (error) {

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

    } catch (error) {

      console.log(error);

    }

  };

  const handleCheckoutUpdate =
    async (
      visitorId: number,
      checkOutTime: string
    ) => {

      try {

        await fetch(

          "/api/visitors/update-checkout",

          {

            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              visitorId,

              checkOutTime

            })

          }

        );

        fetchVisitors();

      } catch (error) {

        console.log(error);

      }

    };

  const filteredVisitors =
    visitors.filter((visitor) => {

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

    });

  const mostCommonPurpose =

    visitors.length > 0

    ? Object.entries(

        visitors.reduce(
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
            "#2563eb",

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

                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth"
                      });

                    }}
                    style={
                      sidebarButtonActive
                    }
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => {

                      visitorsRef.current
                        ?.scrollIntoView({
                          behavior:
                            "smooth"
                        });

                    }}
                    style={
                      sidebarButton
                    }
                  >
                    Registrations
                  </button>

                  <button
                    onClick={() => {

                      setShowActiveOnly(true);

                      visitorsRef.current
                        ?.scrollIntoView({
                          behavior:
                            "smooth"
                        });

                    }}
                    style={
                      sidebarButton
                    }
                  >
                    Active Visitors
                  </button>

                  <button
                    onClick={() => {

                      analyticsRef.current
                        ?.scrollIntoView({
                          behavior:
                            "smooth"
                        });

                    }}
                    style={
                      sidebarButton
                    }
                  >
                    Analytics
                  </button>

                </div>

              </div>

              <button

                onClick={() => {

                  document.cookie =
                    "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

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
                "#2563eb",

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
              Total
            </p>
            <h2 style={miniValue}>
              {visitors.length}
            </h2>
          </div>

          <div style={miniCard}>
            <p style={miniLabel}>
              Active
            </p>
            <h2 style={miniValue}>
              {
                visitors.filter(
                  (v) =>
                    v.status ===
                    "Checked In"
                ).length
              }
            </h2>
          </div>

          <div style={miniCard}>
            <p style={miniLabel}>
              Out
            </p>
            <h2 style={miniValue}>
              {
                visitors.filter(
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

                            visitor.status ===
                            "Checked Out"

                            ? (

                              <input

                                type="datetime-local"

                                defaultValue={

                                  visitor.check_out_time

                                  ? new Date(
                                      visitor.check_out_time
                                    )
                                      .toISOString()
                                      .slice(0, 16)

                                  : ""
                                }

                                onBlur={(e) =>
                                  handleCheckoutUpdate(

                                    visitor.id,

                                    e.target.value

                                  )
                                }

                                style={{

                                  padding:
                                    "8px 10px",

                                  borderRadius:
                                    "10px",

                                  border:
                                    "1px solid #cbd5e1",

                                  fontSize:
                                    "13px"

                                }}

                              />

                            )

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
            Operational insights and visitor statistics
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
                Checked In Visitors
              </p>

              <h3 style={analyticsValueText}>

                {

                  visitors.filter(
                    (v) =>
                      v.status === "Checked In"
                  ).length

                }

              </h3>

            </div>

            <div style={analyticsBox}>

              <p style={analyticsTitle}>
                Checked Out Visitors
              </p>

              <h3 style={analyticsValueText}>

                {

                  visitors.filter(
                    (v) =>
                      v.status === "Checked Out"
                  ).length

                }

              </h3>

            </div>

          </div>

        </div>

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
    "rgba(255,255,255,0.18)",

  fontWeight:
    "700"

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
    "1px solid #dbe4f0",

  borderRadius:
    "14px",

  padding:
    "16px",

  textAlign:
    "center" as const

};

const miniLabel = {

  fontSize:
    "12px",

  color:
    "#64748b",

  marginBottom:
    "6px"

};

const miniValue = {

  margin: 0,

  fontSize:
    "28px",

  fontWeight:
    "800",

  color:
    "#0f172a"

};

const filterButton = {

  padding:
    "13px 16px",

  border:
    "none",

  borderRadius:
    "14px",

  background:
    "#2563eb",

  color:
    "white",

  fontWeight:
    "700",

  cursor:
    "pointer",

  fontSize:
    "14px"
};

const tableHeader = {

  textAlign:
    "left" as const,

  padding:
    "14px",

  fontSize:
    "14px",

  color:
    "#334155",

  borderBottom:
    "1px solid #dbe4f0",

  whiteSpace:
    "nowrap"

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

  background: "#f8fafc",

  border: "1px solid #e2e8f0",

  borderRadius: "16px",

  padding: "20px"

};

const analyticsTitle = {

  color: "#64748b",

  fontSize: "13px",

  marginBottom: "10px"

};

const analyticsValueText = {

  fontSize: "24px",

  fontWeight: "800",

  color: "#0f172a",

  margin: 0

};