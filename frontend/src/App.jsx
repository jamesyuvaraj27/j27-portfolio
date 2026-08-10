import { Route, Routes } from "react-router";

import ErrorBoundary from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RequireAdminAuth from "./components/admin/RequireAdminAuth";

const App = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAdminAuth>
                <AdminDashboardPage />
              </RequireAdminAuth>
            }
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;
