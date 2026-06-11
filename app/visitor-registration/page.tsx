"use client";

import { useState } from "react";

export default function VisitorRegistrationPage() {

  const [fullName, setFullName] =
    useState("");

  const [countryCode, setCountryCode] =
    useState("+91");

  const [mobileNumber, setMobileNumber] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [purposeOfVisit, setPurposeOfVisit] =
    useState("");

  const [personToMeet, setPersonToMeet] =
    useState("");

  const [idProofType, setIdProofType] =
    useState("");

  const [idProofNumber, setIdProofNumber] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const fetchVisitorDetails =
    async (
      number: string
    ) => {

      try {

        const response =
          await fetch(
            "/api/visitors/find",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                mobileNumber:
                  number
              })

            }
          );

        const data =
          await response.json();

        if (
          data.visitor
        ) {

          setFullName(
            data.visitor.full_name || ""
          );

          setEmail(
            data.visitor.email || ""
          );

          setIdProofType(
            data.visitor.id_proof_type || ""
          );

          setIdProofNumber(
            data.visitor.id_proof_number || ""
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  const handleRegister = async () => {

    if (!fullName || !mobileNumber) {

      alert(
        "Full name and mobile number are required"
      );

      return;

    }

    if (!/^\d{10}$/.test(mobileNumber)) {

      alert(
        "Mobile number must be exactly 10 digits"
      );

      return;

    }

    try {

      const response = await fetch(
        "/api/visitors/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            fullName,

            countryCode,

            mobileNumber,

            email,

            purposeOfVisit,

            personToMeet,

            idProofType,

            idProofNumber,

            remarks

          })

        }
      );

      const data =
        await response.json();

      if (response.ok) {

        alert(
          "Visitor registered successfully"
        );

        setFullName("");

        setCountryCode("+91");

        setMobileNumber("");

        setEmail("");

        setPurposeOfVisit("");

        setPersonToMeet("");

        setIdProofType("");

        setIdProofNumber("");

        setRemarks("");

      } else {

        alert(
          data.error ||
          "Registration failed"
        );

      }

    } catch (error) {

      alert(
        "Something went wrong"
      );

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
        padding: "40px",
        fontFamily:
          "Arial, sans-serif"
      }}
    >

      <div
        style={{
          width: "560px",
          background: "#ffffff",
          borderRadius: "28px",
          padding: "45px",
          boxShadow:
            "0 20px 45px rgba(0,0,0,0.12)",
          border:
            "1px solid #dbe4f0"
        }}
      >

        <h1
          style={{
            fontSize: "38px",
            fontWeight: "800",
            color: "#0f172a",
            textAlign: "center",
            marginBottom: "10px"
          }}
        >
          Visitor Management System
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: "18px",
            marginBottom: "35px"
          }}
        >
          Visitor Information
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => {

            const formattedName =
              e.target.value.replace(
                /\b\w/g,
                (char) =>
                  char.toUpperCase()
              );

            setFullName(
              formattedName
            );

          }}
          style={inputStyle}
        />

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
            alignItems: "center"
          }}
        >

          <select
            value={countryCode}
            onChange={(e) =>
              setCountryCode(
                e.target.value
              )
            }
            style={countryCodeStyle}
          >

            <option value="+91">
              IN +91
            </option>

            <option value="+1">
              US +1
            </option>

            <option value="+44">
              UK +44
            </option>

            <option value="+971">
              AE +971
            </option>

            <option value="+61">
              AU +61
            </option>

            <option value="+81">
              JP +81
            </option>

            <option value="+65">
              SG +65
            </option>

          </select>

          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobileNumber}
            maxLength={10}
            onChange={(e) => {

              const value =
                e.target.value.replace(
                  /\D/g,
                  ""
                );

              setMobileNumber(
                value
              );

              if (
                value.length === 10
              ) {

                fetchVisitorDetails(
                  value
                );

              }

            }}
            style={mobileInputStyle}
          />

        </div>

        <input
          type="email"
          placeholder="Email Address (Optional)"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Purpose Of Visit"
          value={purposeOfVisit}
          onChange={(e) =>
            setPurposeOfVisit(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Person To Meet"
          value={personToMeet}
          onChange={(e) =>
            setPersonToMeet(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <select
          value={idProofType}
          onChange={(e) =>
            setIdProofType(
              e.target.value
            )
          }
          style={inputStyle}
        >

          <option value="">
            ID Proof Type (Optional)
          </option>

          <option value="Aadhaar Card">
            Aadhaar Card
          </option>

          <option value="PAN Card">
            PAN Card
          </option>

          <option value="Passport">
            Passport
          </option>

          <option value="Driving License">
            Driving License
          </option>

          <option value="Student ID">
            Student ID
          </option>

          <option value="Employee ID">
            Employee ID
          </option>

          <option value="Voter ID">
            Voter ID
          </option>

        </select>

        <input
          type="text"
          placeholder="ID Proof Number (Optional)"
          value={idProofNumber}
          onChange={(e) => {

            let value =
              e.target.value;

            if (
              idProofType ===
              "Aadhaar Card"
            ) {

              value =
                value.replace(
                  /\D/g,
                  ""
                );

            }

            else if (

              idProofType ===
                "PAN Card"

              ||

              idProofType ===
                "Passport"

              ||

              idProofType ===
                "Driving License"

              ||

              idProofType ===
                "Voter ID"

            ) {

              value =
                value.replace(
                  /[^a-zA-Z0-9]/g,
                  ""
                );

            }

            setIdProofNumber(
              value.toUpperCase()
            );

          }}
          style={inputStyle}
        />

        <textarea
          placeholder="Remarks (Optional)"
          value={remarks}
          onChange={(e) =>
            setRemarks(e.target.value)
          }
          style={{
            ...inputStyle,
            minHeight: "110px",
            resize: "none"
          }}
        />

        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "18px",
            border: "none",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "white",
            fontSize: "19px",
            fontWeight: "700",
            cursor: "pointer",
            marginTop: "10px",
            boxShadow:
              "0 8px 20px rgba(37,99,235,0.35)"
          }}
        >
          Register Visitor
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            color: "#94a3b8",
            fontSize: "15px"
          }}
        >
          Secure Visitor Access & Tracking
        </p>

      </div>

    </div>

  );

}

const inputStyle = {

  width: "100%",

  padding: "18px",

  marginBottom: "20px",

  borderRadius: "14px",

  border: "1px solid #cbd5e1",

  background: "#f8fafc",

  fontSize: "17px",

  outline: "none",

  boxSizing: "border-box" as const

};

const countryCodeStyle = {

  width: "120px",

  height: "58px",

  borderRadius: "14px",

  border: "1px solid #cbd5e1",

  background: "#f8fafc",

  fontSize: "16px",

  fontWeight: "600",

  padding: "0 14px",

  outline: "none",

  boxSizing: "border-box" as const

};

const mobileInputStyle = {

  flex: 1,

  height: "58px",

  borderRadius: "14px",

  border: "1px solid #cbd5e1",

  background: "#f8fafc",

  padding: "0 18px",

  fontSize: "17px",

  outline: "none",

  boxSizing: "border-box" as const

};