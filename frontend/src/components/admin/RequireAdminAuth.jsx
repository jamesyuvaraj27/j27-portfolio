import { Navigate } from "react-router";

import { useAdminAuth } from "../../lib/useAdminAuth";

const RequireAdminAuth = ({ children }) => {
  const { user, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-light border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default RequireAdminAuth;
