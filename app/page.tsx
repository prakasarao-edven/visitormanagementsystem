"use client";

import QRCode from "qrcode";

import {
  useEffect,
  useState
} from "react";

export default function HomePage() {

  const [qrCode, setQrCode] =
    useState("");

  useEffect(() => {

    const generateQR = async () => {

      try {

       const qr =
  await QRCode.toDataURL(
    "https://fled-reprimand-ipod.ngrok-free.dev/visitor-registration"
  );

        setQrCode(qr);

      }

      catch (error) {

        console.log(error);

      }

    };

    generateQR();

  }, []);

  return (

    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #dbeafe 100%)",
        padding: "24px",
        fontFamily:
          "Inter, Arial, sans-serif"
      }}
    >

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto"
        }}
      >

        <nav
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom: "70px",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >

          <div>

            <h1
              style={{
                fontSize: "38px",
                fontWeight: "800",
                color: "#0f172a",
                marginBottom: "6px"
              }}
            >
              VisitorOS
            </h1>

            <p
              style={{
                color: "#64748b",
                fontSize: "15px"
              }}
            >
              Smart Visitor Management
            </p>

          </div>

          <button
            onClick={() => {

              window.location.href =
                "/login";

            }}
            style={{
              padding:
                "14px 26px",
              borderRadius:
                "14px",
              border:
                "none",
              background:
                "#008779",
              color:
                "white",
              fontWeight:
                "700",
              cursor:
                "pointer",
              fontSize:
                "15px",
              boxShadow:
                "0 10px 20px rgba(0,75,135,0.2)"
            }}
          >
            Staff Login
          </button>

        </nav>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(340px,1fr))",
            gap: "40px",
            alignItems:
              "center",
            marginBottom: "50px"
          }}
        >

          <div>

            <div
              style={{
                display:
                  "inline-flex",
                alignItems:
                  "center",
                gap: "10px",
                padding:
                  "10px 18px",
                borderRadius:
                  "999px",
                background:
                  "rgba(255,255,255,0.7)",
                border:
                  "1px solid rgba(255,255,255,0.8)",
                backdropFilter:
                  "blur(12px)",
                marginBottom:
                  "26px",
                fontSize:
                  "14px",
                color:
                  "#1fafa3",
                fontWeight:
                  "700"
              }}
            >
              Secure Visitor Access
            </div>

            <h2
              style={{
                fontSize:
                  "clamp(46px,8vw,78px)",
                lineHeight:
                  "1.05",
                fontWeight:
                  "900",
                color:
                  "#0f172a",
                marginBottom:
                  "24px"
              }}
            >
              Visitor
              Management
              System
            </h2>

            <p
              style={{
                fontSize:
                  "18px",
                lineHeight:
                  "34px",
                color:
                  "#475569",
                maxWidth:
                  "620px",
                marginBottom:
                  "34px"
              }}
            >
              Fast secure and intelligent
              visitor management system
              designed for offices campuses
              institutions and enterprises.
            </p>

          </div>

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "center"
            }}
          >

            <div
              style={{
                background:
                  "rgba(255,255,255,0.75)",
                backdropFilter:
                  "blur(18px)",
                border:
                  "1px solid rgba(255,255,255,0.9)",
                borderRadius:
                  "32px",
                padding:
                  "34px",
                width:
                  "100%",
                maxWidth:
                  "420px",
                boxShadow:
                  "0 25px 50px rgba(71, 228, 239, 0.47)"
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
                    "24px"
                }}
              >

                <div>

                  <h3
                    style={{
                      fontSize:
                        "28px",
                      fontWeight:
                        "800",
                      color:
                        "#0f172a",
                      marginBottom:
                        "6px"
                    }}
                  >
                    Quick Access
                  </h3>

                  <p
                    style={{
                      color:
                        "#64748b",
                      fontSize:
                        "15px"
                    }}
                  >
                    Scan to register visitors
                  </p>

                </div>

                <div
                  style={{
                    width:
                      "14px",
                    height:
                      "14px",
                    borderRadius:
                      "999px",
                    background:
                      "#22c5a5"
                  }}
                />

              </div>

              {

                qrCode && (

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "center",
                      marginBottom:
                        "24px"
                    }}
                  >

                    <img
                      src={qrCode}
                      alt="QR Code"
                      style={{
                        width:
                          "100%",
                        maxWidth:
                          "250px",
                        borderRadius:
                          "24px"
                      }}
                    />

                  </div>

                )

              }

              <button
                onClick={() => {

                  window.location.href =
                    "/visitor-registration";

                }}
                style={{
                  width:
                    "100%",
                  padding:
                    "18px 34px",
                  borderRadius:
                    "16px",
                  border:
                    "none",
                  background:
                    "#007e87",
                  color:
                    "white",
                  fontWeight:
                    "700",
                  fontSize:
                    "16px",
                  cursor:
                    "pointer",
                  boxShadow:
                    "0 12px 30px rgba(5, 100, 105, 0.6)"
                }}
              >
                Register Manually
              </button>

            </div>

          </div>

        </section>

      </div>

    </main>

  );

}
