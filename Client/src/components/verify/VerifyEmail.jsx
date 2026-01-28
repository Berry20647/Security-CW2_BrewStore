import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../../api/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const doVerify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified! You can now log in with this email.");
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Verification failed. The link may have expired.");
      }
    };
    doVerify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-10">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-[#c6a27e] uppercase mb-4 tracking-wide">
          Verify Email
        </h2>

        {status === "verifying" && (
          <div className="text-gray-300 text-sm animate-pulse">Verifying your email...</div>
        )}

        {status === "success" && (
          <>
            <div className="text-[#c6a27e] font-medium mb-4">{message}</div>
            <Link
              to="/login"
              className="inline-block mt-2 text-sm text-black bg-[#c6a27e] px-5 py-2 rounded hover:opacity-90 transition"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 font-medium mb-4">{message}</div>
            <Link
              to="/profile"
              className="inline-block mt-2 text-sm text-black bg-[#c6a27e] px-5 py-2 rounded hover:opacity-90 transition"
            >
              Go to Profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
