import React from "react";
import { Container } from "@/components/index.js";
import { useLocation } from "react-router-dom";

const AuthHeader = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/auth/forgot-password":
        return "Recover Password";
      case "/auth/check-email":
        return "Verify Your Email";
      case "/auth/reset-password":
        return "Set New Password";
      case "/auth/verify-otp":
        return "Verify OTP";
      default:
        return "";
    }
  };

  return (
    <header className="bg-gray-500 shadow-md py-4 border-b border-green-200">
      <Container>
        <h1 className="text-center text-2xl font-semibold text-green-800">
          {getTitle()}
        </h1>
      </Container>
    </header>
  );
};

export default AuthHeader;
