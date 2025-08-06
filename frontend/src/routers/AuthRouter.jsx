import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginScreen from "@/screens/auth/LoginScreen.jsx";
import RegisterScreen from "@/screens/auth/RegisterScreen.jsx";

const AuthRouter = () => {
  return (
    <>
      <Routes>
        <Route path="login" element={<LoginScreen />} />
        <Route path="register" element={<RegisterScreen />} />
      </Routes>
    </>
  );
};

export default AuthRouter;
