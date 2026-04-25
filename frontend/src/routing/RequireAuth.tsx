import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHook";

const RequireAuth = () => {
  const user = useAppSelector((s) => s.userReducer);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;

