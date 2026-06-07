import { Footer } from "@/app/components/layout/Footer";
import { Header } from "@/app/components/layout/Header";
import { Outlet } from "react-router";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
