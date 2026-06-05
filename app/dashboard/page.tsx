"use client";

import { useEffect, useState } from "react";

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
  ] = useState(false);

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

  return (

    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #dbeafe, #f8fafc)",
        fontFamily:
          "Arial, sans-serif"
      }}
    >

      <aside
        style={{
          width:

            sidebarCollapsed

            ? "90px"

            : "240px",

          background:
            "#2563eb",

          color:
            "white",

          padding:
            "24px 18px",

          transition:
            "0.3s",

          display:
            "flex",

          flexDirection:
            "column",

          justifyContent:
            "space-between"
        }}
      >

        <div>

          <div
            style={{
              display:
                "flex",

              justifyContent:

                sidebarCollapsed

                ? "center"

                : "space-between",

              alignItems:
                "center",

              marginBottom:
                "40px"
            }}
          >

            {

              !sidebarCollapsed && (

                <div>

                  <h1
                    style={{
                      fontSize:
                        "32px",

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
                      color:
                        "#dbeafe",

                      fontSize:
                        "13px"
                    }}
                  >
                    Security Panel
                  </p>

                </div>

              )

            }

            <button

              onClick={() =>
                setSidebarCollapsed(
                  !sidebarCollapsed
                )
              }

              style={{
                background:
                  "rgba(255,255,255,0.18)",

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
                  "18px",

                fontWeight:
                  "700"
              }}
            >

              ☰

            </button>

          </div>

          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px"
            }}
          >

            <button
              style={
                sidebarButtonActive
              }
            >
              {
                sidebarCollapsed
                ? "D"
                : "Dashboard"
              }
            </button>

            <button
              style={
                sidebarButton
              }
            >
              {
                sidebarCollapsed
                ? "R"
                : "Registrations"
              }
            </button>

            <button
              style={
                sidebarButton
              }
            >
              {
                sidebarCollapsed
                ? "A"
                : "Active Visitors"
              }
            </button>

          </div>

        </div>

        <button
          style={logoutButton}
        >
          {
            sidebarCollapsed
            ? "↩"
            : "Logout"
          }
        </button>

      </aside>

      <main
        style={{
          flex: 1,
          padding: "24px",
          overflow: "auto"
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
              "22px"
          }}
        >

          <div>

            <h1
              style={{
                fontSize:
                  "42px",

                fontWeight:
                  "800",

                color:
                  "#0f172a",

                marginBottom:
                  "4px"
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                color:
                  "#64748b",

                fontSize:
                  "15px"
              }}
            >
              Visitor management overview
            </p>

          </div>

          <div
            style={{
              background:
                "white",

              padding:
                "12px 18px",

              borderRadius:
                "12px",

              border:
                "1px solid #dbe4f0",

              fontWeight:
                "600",

              color:
                "#475569"
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
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "12px",

            marginBottom:
              "20px",

            flexWrap:
              "wrap"
          }}
        >

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
                "320px",

              padding:
                "14px 16px",

              borderRadius:
                "14px",

              border:
                "1px solid #cbd5e1",

              background:
                "white",

              fontSize:
                "15px",

              outline:
                "none"
            }}
          />

          <div style={miniCard}>

            <p style={miniLabel}>
              Total
            </p>

            <h2 style={miniValue}>
              {
                visitors.length
              }
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

          <button

            onClick={() =>
              setShowActiveOnly(
                !showActiveOnly
              )
            }

            style={
              filterButton
            }
          >

            {
              showActiveOnly
              ? "Showing Active"
              : "Active Only"
            }

          </button>

        </div>

        <div
          style={{
            background:
              "white",

            borderRadius:
              "16px",

            border:
              "1px solid #dbe4f0",

            overflow:
              "hidden"
          }}
        >

          <div
            style={{
              overflowX:
                "auto"
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

                  <th style={tableHeader}>
                    Code
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
                    Person To Meet
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

                  <th style={tableHeader}>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredVisitors.map(
                  (visitor) => (

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

                          whiteSpace:
                            "nowrap",

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

                      <div
                        style={{
                          whiteSpace:
                            "nowrap"
                        }}
                      >

                        {
                          visitor.check_in_time

                          ? new Date(
                              visitor.check_in_time
                            ).toLocaleString()

                          : "-"
                        }

                      </div>

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
                                "13px",

                              outline:
                                "none"

                            }}

                          />

                        )

                        : (

                          "-"

                        )

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
                                "600",

                              whiteSpace:
                                "nowrap"
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

                ))}

              </tbody>

            </table>

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
    "14px 16px",

  borderRadius:
    "12px",

  fontSize:
    "15px",

  cursor:
    "pointer",

  whiteSpace:
    "nowrap"

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
    "14px",

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
    "10px 16px",

  minWidth:
    "90px",

  textAlign:
    "center" as const

};

const miniLabel = {

  fontSize:
    "12px",

  color:
    "#64748b",

  marginBottom:
    "2px"

};

const miniValue = {

  margin: 0,

  fontSize:
    "24px",

  fontWeight:
    "800",

  color:
    "#0f172a"

};

const filterButton = {

  padding:
    "14px 18px",

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

  whiteSpace:
    "nowrap"

};

const tableHeader = {

  textAlign:
    "left" as const,

  padding:
    "16px",

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
    "16px",

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
    "10px 16px",

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