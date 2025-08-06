import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginScreen from "@/screens/auth/LoginScreen.jsx";

const AuthRouter = () => {
  return (
    <>
      <Routes>
        <Route path="login" element={<LoginScreen />} />
      </Routes>
    </>
  );
};

export default AuthRouter;
