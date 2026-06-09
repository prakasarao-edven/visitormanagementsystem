"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {

    if (!email || !password) {

      alert(
        "Email and password are required"
      );

      return;

    }

    try {

      setLoading(true);

      const response =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              email,

              password

            })

          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(
          data.error
        );

        return;

      }

      document.cookie =
        `user=${JSON.stringify(data.user)}; path=/`;

      if (
        data.user.role ===
        "ADMIN"
      ) {

        router.push(
          "/admin"
        );

      }

      else if (

        data.user.role ===
        "SECURITY"

      ) {

        router.push(
          "/dashboard"
        );

      }

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #dbeafe, #f8fafc)",
        padding: "20px",
        fontFamily:
          "Arial, sans-serif"
      }}
    >

      <div
        style={{
          width: "420px",
          background: "white",
          padding: "42px",
          borderRadius: "24px",
          boxShadow:
            "0 20px 45px rgba(0,0,0,0.08)",
          border:
            "1px solid #dbe4f0"
        }}
      >

        <h1
          style={{
            fontSize: "42px",
            fontWeight: "800",
            color: "#0f172a",
            textAlign: "center",
            marginBottom: "10px"
          }}
        >
          VisitorOS
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "36px",
            fontSize: "16px"
          }}
        >
          Secure Access Portal
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "14px",
            background:
              "#2563eb",
            color: "white",
            fontSize: "17px",
            fontWeight: "700",
            cursor: "pointer",
            marginTop: "8px"
          }}
        >

          {

            loading

            ? "Signing In..."

            : "Login"

          }

        </button>

      </div>

    </div>

  );

}

const inputStyle = {

  width: "100%",

  padding: "16px",

  marginBottom: "18px",

  borderRadius: "14px",

  border: "1px solid #cbd5e1",

  background: "#f8fafc",

  fontSize: "16px",

  outline: "none",

  boxSizing:
    "border-box" as const

};