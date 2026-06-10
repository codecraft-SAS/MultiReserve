import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layouts/MainLayout";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageBusinesses from "./pages/admin/ManageBusinesses";
import CreateBusinessForm from "./pages/admin/CreateBusinessForm";
import EditBusinessForm from "./pages/admin/EditBusinessForm";
import CreateResourceForm from "./pages/admin/CreateResourceForm";
import UserManagement from "./pages/admin/UserManagement";
import ReportsManagement from "./pages/admin/ReportsManagement";

import ResourceManagement from "./pages/ResourceManagement";
import ReservationManagement from "./pages/ReservationManagement";
import EmployeePanel from "./pages/EmployeePanel";

import BusinessCatalog from "./pages/BusinessCatalog";
import ClientReservations from "./pages/ClientReservations";
import { ProfilePage } from "./pages/ProfilePage";

function getPageFromHash() {
  const hash = window.location.hash.replace("#", "");
  return hash || "/admin/dashboard";
}

function App() {
  const { user } = useAuth();
  const [page, setPage] = useState(getPageFromHash());
  const [showLogin, setShowLogin] = useState(true);
  const [editBusinessId, setEditBusinessId] = useState<number | null>(null);

  const role = user?.role?.toUpperCase();

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function handleLoginSuccess(userRole: string) {
    setShowLogin(false);
    const defaultPage = userRole === "ADMIN"
      ? "/admin/dashboard"
      : userRole === "EMPLOYEE"
        ? "/employee/dashboard"
        : "/client/catalog";
    setPage(defaultPage);
    window.location.hash = defaultPage;
  }

  function navigateTo(p: string, editId?: number) {
    if (editId !== undefined) setEditBusinessId(editId);
    setPage(p);
    window.location.hash = p;
  }

  if (!user) {
    if (window.location.hash) window.location.hash = "";
    return (
      <>
        <Toaster position="top-right" toastOptions={{ style: { background: "#1f2937", color: "#fff" } }} />
        {showLogin ? (
          <LoginPage onSuccess={handleLoginSuccess} onGoToRegister={() => setShowLogin(false)} />
        ) : (
          <RegisterPage
            onSuccess={(r) => {
              if (r === "LOGIN") setShowLogin(true);
              else handleLoginSuccess(r);
            }}
          />
        )}
      </>
    );
  }

  function renderContent() {
    const route = page.split("/").slice(2).join("/");
    switch (route) {
      case "dashboard":
        return role === "ADMIN" ? <AdminDashboard /> : <EmployeePanel />;
      case "businesses":
        return <ManageBusinesses onNavigate={(p, id) => navigateTo(p, id)} />;
      case "create-business":
        return <CreateBusinessForm onNavigate={() => navigateTo("/admin/businesses")} />;
      case "edit-business":
        return <EditBusinessForm businessId={editBusinessId} onNavigate={() => navigateTo("/admin/businesses")} />;
      case "resources":
        return <ResourceManagement onNavigate={(p) => navigateTo(p)} />;
      case "create-resource":
        return <CreateResourceForm onNavigate={(p) => navigateTo(p)} />;
      case "reservations":
        return <ReservationManagement />;
      case "users":
        return <UserManagement />;
      case "reports":
        return <ReportsManagement />;
      case "catalog":
        return <BusinessCatalog />;
      case "my-reservations":
        return <ClientReservations />;
      case "profile":
        return <ProfilePage />;
      default:
        return role === "ADMIN"
          ? <AdminDashboard />
          : role === "EMPLOYEE"
            ? <EmployeePanel />
            : <BusinessCatalog />;
    }
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: "#1f2937", color: "#fff" } }} />
      <MainLayout currentPage={page} onNavigate={setPage}>
        {renderContent()}
      </MainLayout>
    </>
  );
}

export default App;
