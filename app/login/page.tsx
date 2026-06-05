"use client";

import { useState } from "react";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);

localStorage.setItem(
  "user",
  JSON.stringify(data.user)
);

window.location.href = "/dashboard";
    } else {
      alert(data.error);
    }
  };

  return (

    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #f8fafc 100%)",
        fontFamily: "Arial, sans-serif"
      }}
    >

      <div
        style={{
          width: "430px",
          background: "#ffffff",
          borderRadius: "28px",
          padding: "50px",
          border: "1px solid #dbe4f0",
          boxShadow:
            "0 20px 45px rgba(15,23,42,0.12)",
          backdropFilter: "blur(10px)"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            color: "#0f172a",
            fontSize: "38px",
            fontWeight: "800",
            marginBottom: "18px",
            lineHeight: "48px"
          }}
        >
          Visitor Management System
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: "18px",
            marginBottom: "42px",
            lineHeight: "28px"
          }}
        >
          Secure access for administrators and security staff
        </p>

        <div style={{ marginBottom: "24px" }}>

          <label
            style={{
              display: "block",
              marginBottom: "10px",
              color: "#1e293b",
              fontSize: "17px",
              fontWeight: "600"
            }}
          >
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "14px",
              border: "1px solid #cbd5e1",
              fontSize: "17px",
              outline: "none",
              boxSizing: "border-box",
              background: "#f8fafc"
            }}
          />

        </div>

        <div style={{ marginBottom: "34px" }}>

          <label
            style={{
              display: "block",
              marginBottom: "10px",
              color: "#1e293b",
              fontSize: "17px",
              fontWeight: "600"
            }}
          >
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "14px",
              border: "1px solid #cbd5e1",
              fontSize: "17px",
              outline: "none",
              boxSizing: "border-box",
              background: "#f8fafc"
            }}
          />

        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "18px",
            border: "none",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "white",
            fontSize: "19px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow:
              "0 8px 20px rgba(37,99,235,0.35)"
          }}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "28px",
            color: "#94a3b8",
            fontSize: "15px"
          }}
        >
          Visitor Security & Access Control Portal
        </p>

      </div>

    </div>
  );
}