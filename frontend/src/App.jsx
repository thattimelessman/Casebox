import { useState } from "react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./components/ui";

import Layout from "./components/Layout";

import LoginPage from "./pages/LoginPage";
import { RegisterPage, PendingPage } from "./pages/AuthPages";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminCasesPage from "./pages/admin/CasesPage";
import { UsersPage, PendingApprovalsPage, AuditLogPage } from "./pages/admin/AdminPages";

import CaseDetail from "./pages/shared/CaseDetail";
import {
  AdvocateCasesPage, AdvocateDocumentsPage,
  JudgeCasesPage,
  ClientCasesPage, ClientDocumentsPage,
} from "./pages/RolePages";
import LandingPage from "./pages/LandingPage";
/* ════════════════════════════════════════
   INNER APP
════════════════════════════════════════ */
function InnerApp() {
  const { user, loading } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [authView, setAuthView]     = useState("login");
  const [page, setPage]             = useState(null);
  const [detailCase, setDetailCase] = useState(null);
  // Loading splash
  if (loading) return (
    <div style={{
      minHeight:"100vh", background:"#f8f4ed",
      display:"flex", alignItems:"center", justifyContent:"center",
      flexDirection:"column", gap:16,
    }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.6rem", color:"#1a2744", fontWeight:300 }}>
        Case<span style={{ color:"#4a7c6f", fontStyle:"italic" }}>Box</span>
      </div>
      <div style={{ fontSize:"0.82rem", color:"#b0a898" }}>Connecting…</div>
    </div>
  );

  // Auth flow
  if (!user && showLanding) return <LandingPage onLogin={() => setShowLanding(false)} />;
  if (!user) {
    if (authView === "register") return <RegisterPage onLogin={() => setAuthView("login")} />;
    return <LoginPage onRegister={() => setAuthView("register")} />;
  }

  // Unapproved client
  if (user.role === "client" && !user.is_approved) return <PendingPage />;

  // Default landing page per role
  const defaultPage = { admin:"dashboard", advocate:"cases", judge:"cases", client:"cases" }[user.role] || "cases";
  const activePage  = page || defaultPage;

  const nav = (p) => { setPage(p); if (p !== "case-detail") setDetailCase(null); };

  const renderPage = () => {
    if (activePage === "case-detail" && detailCase) {
      return <CaseDetail caseId={detailCase} onBack={() => nav("cases")} />;
    }

    if (user.role === "admin") {
      switch (activePage) {
        case "dashboard": return <AdminDashboard setPage={nav} />;
        case "cases":     return <AdminCasesPage setPage={nav} setDetailCase={setDetailCase} />;
        case "users":     return <UsersPage />;
        case "pending":   return <PendingApprovalsPage />;
        case "audit":     return <AuditLogPage />;
        default:          return <AdminDashboard setPage={nav} />;
      }
    }

    if (user.role === "advocate") {
      switch (activePage) {
        case "cases":     return <AdvocateCasesPage setPage={nav} setDetailCase={setDetailCase} />;
        case "documents": return <AdvocateDocumentsPage setPage={nav} setDetailCase={setDetailCase} />;
        default:          return <AdvocateCasesPage setPage={nav} setDetailCase={setDetailCase} />;
      }
    }

    if (user.role === "judge") {
      return <JudgeCasesPage setPage={nav} setDetailCase={setDetailCase} />;
    }

    if (user.role === "client") {
      switch (activePage) {
        case "cases":     return <ClientCasesPage setPage={nav} setDetailCase={setDetailCase} />;
        case "documents": return <ClientDocumentsPage setPage={nav} setDetailCase={setDetailCase} />;
        default:          return <ClientCasesPage setPage={nav} setDetailCase={setDetailCase} />;
      }
    }
    return null;
  };

  return (
    <Layout page={activePage} setPage={nav}>
      {renderPage()}
    </Layout>
  );
}

/* ════════════════════════════════════════
   ROOT
════════════════════════════════════════ */
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <InnerApp />
      </ToastProvider>
    </AuthProvider>
  );
}
