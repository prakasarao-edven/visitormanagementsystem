"use client";

import { useEffect, useRef, useState } from "react";

export default function VisitorRegistrationPage() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState("");

  const startCamera = async () => {
    setCameraError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setCameraOn(true);
    } catch (error) {
      setCameraError("Camera access denied or unavailable");
    }
  };

  useEffect(() => {

    if (cameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }

  }, [cameraOn]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    setPhoto(canvas.toDataURL("image/jpeg", 0.85));
    stopCamera();
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const [associates, setAssociates] =
    useState<{ id: number; name: string }[]>([]);

  useEffect(() => {

    fetch("/api/associates/list")
      .then((res) => res.json())
      .then((data) =>
        setAssociates(
          Array.isArray(data.associates) ? data.associates : []
        )
      )
      .catch((error) => console.log(error));

  }, []);

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

  const typedNameTokens =
    personToMeet
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((token) => token.length > 1);

  const isKnownAssociate =
    !personToMeet ||
    associates.some((associate) => {

      const associateTokens =
        associate.name
          .trim()
          .toLowerCase()
          .split(/\s+/)
          .filter((token) => token.length > 1);

      return typedNameTokens.some((token) =>
        associateTokens.includes(token)
      );

    });

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

    if (!purposeOfVisit) {

      alert(
        "Please select a purpose of visit"
      );

      return;

    }

    if (!photo) {

      alert(
        "Please take a photo to continue"
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

            remarks,

            photo

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

        setPhoto(null);

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
          Self Check-In
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
            onChange={(e) =>
              setMobileNumber(
                e.target.value.replace(/\D/g, "")
              )
            }
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

        <select
          value={purposeOfVisit}
          onChange={(e) =>
            setPurposeOfVisit(
              e.target.value
            )
          }
          style={inputStyle}
        >

          <option value="">
            Purpose Of Visit
          </option>

          <option value="Interview">
            Interview
          </option>

          <option value="Meet HR">
            Meet HR
          </option>

          <option value="Meet Admin">
            Meet Admin
          </option>

          <option value="Meet Family Members">
            Meet Family Members
          </option>

          <option value="Meeting">
            Meeting
          </option>

          <option value="Delivery">
            Delivery
          </option>

          <option value="Vendor Visit">
            Vendor Visit
          </option>

          <option value="Other">
            Other
          </option>

        </select>

        <input
          type="text"
          placeholder="Person To Meet"
          value={personToMeet}
          onChange={(e) =>
            setPersonToMeet(
              e.target.value
            )
          }
          style={{
            ...inputStyle,
            marginBottom:
              personToMeet && !isKnownAssociate
                ? "8px"
                : "20px"
          }}
        />

        {personToMeet && !isKnownAssociate && (

          <p
            style={{
              color: "#b45309",
              fontSize: "13px",
              fontWeight: "600",
              marginTop: "0",
              marginBottom: "20px"
            }}
          >
            This person was not found in our employee list. Please double check the name.
          </p>

        )}

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

        <div
          style={{
            marginBottom: "20px",
            padding: "16px",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            background: "#f8fafc",
            textAlign: "center"
          }}
        >

          <p
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#64748b",
              marginBottom: "12px"
            }}
          >
            Photo (Required)
          </p>

          {photo ? (

            <>
              <img
                src={photo}
                alt="Captured visitor"
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "12px"
                }}
              />

              <div>
                <button
                  onClick={retakePhoto}
                  style={secondaryButtonStyle}
                >
                  Retake
                </button>
              </div>
            </>

          ) : cameraOn ? (

            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  maxWidth: "320px",
                  borderRadius: "12px",
                  marginBottom: "12px"
                }}
              />

              <div>
                <button
                  onClick={capturePhoto}
                  style={secondaryButtonStyle}
                >
                  Capture
                </button>
              </div>
            </>

          ) : (

            <button
              onClick={startCamera}
              style={secondaryButtonStyle}
            >
              Enable Camera
            </button>

          )}

          {cameraError && (
            <p style={{ color: "#dc2626", fontSize: "13px", marginTop: "10px" }}>
              {cameraError}
            </p>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />

        </div>

        <button
          onClick={handleRegister}
          style={{
            display: "block",
            width: "220px",
            margin: "10px auto 0",
            padding: "18px",
            border: "none",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, #2ce1d2, #043e3e)",
            color: "white",
            fontSize: "19px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow:
              "0 8px 20px #25ebdb59"
          }}
        >
          Register
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            color: "#64748b",
            fontSize: "15px"
          }}
        >
          Secure Visitor Access & Tracking
        </p>

        <a
          href="/checkout"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "10px",
            color: "#0b6756",
            fontSize: "14px",
            fontWeight: "700",
            textDecoration: "none"
          }}
        >
          Already visited? Check out here
        </a>

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

  color: "#0f172a",

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

  color: "#0f172a",

  fontSize: "16px",

  fontWeight: "600",

  padding: "0 14px",

  outline: "none",

  boxSizing: "border-box" as const

};

const secondaryButtonStyle = {

  padding: "10px 20px",

  border: "none",

  borderRadius: "10px",

  background: "#008779",

  color: "white",

  fontSize: "14px",

  fontWeight: "700",

  cursor: "pointer"

};

const mobileInputStyle = {

  flex: 1,

  height: "58px",

  borderRadius: "14px",

  border: "1px solid #cbd5e1",

  background: "#f8fafc",

  color: "#0f172a",

  padding: "0 18px",

  fontSize: "17px",

  outline: "none",

  boxSizing: "border-box" as const

};