"use client";
import {
  useEffect,
  useState
} from "react";

import QRCode from "qrcode";

export default function RegistrationQR() {

  const [qrCode, setQrCode] =
    useState("");

  useEffect(() => {

    const generateQR = async () => {

      try {

        const url =
          await QRCode.toDataURL(

            "http://192.168.1.55/register"

          );

        setQrCode(url);

      }

      catch (error) {

        console.log(error);

      }

    };

    generateQR();

  }, []);

  return (

    <div
      style={{
        background:
          "white",

        border:
          "1px solid #dbe4f0",

        borderRadius:
          "18px",

        padding:
          "20px",

        width:
          "fit-content"
      }}
    >

      <h2
        style={{
          marginBottom:
            "16px",

          color:
            "#0f172a",

          fontSize:
            "20px",

          fontWeight:
            "700"
        }}
      >
        Visitor Registration QR
      </h2>

      {

        qrCode && (

          <img
            src={qrCode}
            alt="Registration QR"
            style={{
              width:
                "220px",

              height:
                "220px"
            }}
          />

        )

      }

      <p
        style={{
          marginTop:
            "14px",

          color:
            "#64748b",

          fontSize:
            "13px"
        }}
      >
        Scan to open registration page
      </p>

    </div>

  );

}