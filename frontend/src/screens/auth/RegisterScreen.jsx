import React from "react";
import MainLayout from "@/layouts/MainLayout.jsx";
import RegisterForm from "@/features/auth/RegisterForm.jsx";

const RegisterScreen = () => {
  return (
    <MainLayout>
      <RegisterForm />
    </MainLayout>
  );
};

export default RegisterScreen;
