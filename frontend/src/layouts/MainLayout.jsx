import React from "react";
import Header from "@/features/Header.jsx";
import Footer from "@/features/Footer.jsx";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="mt-20">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;