"use client";

import { useState } from "react";

export default function VisitorCheckoutPage() {

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [status, setStatus] = useState("");

  const handleCheckout = async () => {

    if (!fullName || !/^\d{10}$/.test(mobileNumber)) {
      setStatus("Enter your name and a valid 10 digit mobile number");
      return;
    }

    try {

      const response = await fetch("/api/visitors/self-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, mobileNumber }),
      });

      const data = await response.json();

      setStatus(
        response.ok
          ? "You have been checked out. Thank you for visiting!"
          : data.error || "Checkout failed"
      );

      if (response.ok) {
        setFullName("");
        setMobileNumber("");
      }

    } catch (error) {
      setStatus("Something went wrong");
    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #dbeafe, #f8fafc)",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >

      <div
        style={{
          width: "420px",
          background: "#ffffff",
          borderRadius: "28px",
          padding: "45px",
          boxShadow: "0 20px 45px rgba(0,0,0,0.12)",
          border: "1px solid #dbe4f0",
        }}
      >

        <h1
          style={{
            fontSize: "30px",
            fontWeight: "800",
            color: "#0f172a",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Visitor Check Out
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: "16px",
            marginBottom: "30px",
          }}
        >
          Enter your name and mobile number to check out
        </p>

        <input
          type="text"
          placeholder="Your Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{
            width: "100%",
            padding: "18px",
            marginBottom: "20px",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            background: "#f8fafc",
            fontSize: "17px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobileNumber}
          maxLength={10}
          onChange={(e) =>
            setMobileNumber(e.target.value.replace(/\D/g, ""))
          }
          style={{
            width: "100%",
            padding: "18px",
            marginBottom: "20px",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            background: "#f8fafc",
            fontSize: "17px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleCheckout}
          style={{
            width: "100%",
            padding: "18px",
            border: "none",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #2ce1d2, #043e3e)",
            color: "white",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Check Out
        </button>

        {
          status && (
            <p
              style={{
                textAlign: "center",
                marginTop: "18px",
                color: "#334155",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {status}
            </p>
          )
        }

      </div>

    </div>

  );

}
