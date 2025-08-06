import React from "react";
import MainLayout from "@/layouts/MainLayout.jsx";
import LoginForm from "@/features/auth/LoginForm.jsx";

const LoginScreen = () => {
  return (
    <MainLayout>
      <LoginForm />
    </MainLayout>
  );
};

export default LoginScreen;
