import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginScreen from "@/screens/auth/LoginScreen.jsx";
import RegisterScreen from "@/screens/auth/RegisterScreen.jsx";
import ResetPasswordScreen from "@/screens/auth/ResetPasswordScreen.jsx";
import OtpVerificationScreen from "@/screens/auth/OtpVerificationScreen.jsx";
import ForgotPasswordScreen from "@/screens/auth/ForgotPasswordScreen.jsx";

const AuthRouter = () => {
  return (
    <>
      <Routes>
        <Route path="login" element={<LoginScreen />} />
        <Route path="register" element={<RegisterScreen />} />
        <Route path="forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="verify-otp" element={<OtpVerificationScreen />} />
        <Route path="reset-password" element={<ResetPasswordScreen />} />
      </Routes>
    </>
  );
};

export default AuthRouter;
