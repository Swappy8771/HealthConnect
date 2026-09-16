import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type Props = {
  /** localStorage key holding this actor's token: "token" | "doctorToken" | "adminToken" */
  tokenKey: string;
  /** Where to send an unauthenticated visitor */
  loginPath: string;
};

/**
 * Route guard.
 *
 * The previous approach checked the token inside a layout's `useEffect`, which
 * runs *after* the first paint — so the dashboard rendered and fired its data
 * requests before the redirect. Redirecting during render means an
 * unauthenticated visitor never sees the protected page at all.
 *
 * `state.from` lets the login page send the user back where they were headed.
 */
const ProtectedRoute: React.FC<Props> = ({ tokenKey, loginPath }) => {
  const location = useLocation();

  let token: string | null = null;
  try {
    token = localStorage.getItem(tokenKey);
  } catch {
    // Private mode / blocked storage — treat as signed out.
    token = null;
  }

  if (!token) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
