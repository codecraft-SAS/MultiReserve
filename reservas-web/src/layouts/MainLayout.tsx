import { useState, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export default function MainLayout({
  currentPage,
  onNavigate,
  children,
}: {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        backgroundColor: "#09090b",
        color: "#e4e4e7",
        overflow: "hidden",
        userSelect: "none",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <Sidebar isOpen={sidebarOpen} currentPage={currentPage} onNavigate={onNavigate} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#09090b",
        }}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            width: "100%",
            backgroundColor: "#09090b",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: "1280px",
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto",
              padding: window.innerWidth < 768 ? "24px 16px" : "32px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
