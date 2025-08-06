import React from "react";
import MainLayout from "@/layouts/MainLayout.jsx";
import { Title } from "@/components";

const HomeScreen = () => {
  return (
    <MainLayout>
      <section className="min-h-[60vh] flex items-center justify-center">
        <Title level={2} className="text-center">
          Welcome to the Auction Platform
        </Title>
      </section>
    </MainLayout>
  );
};

export default HomeScreen;
