import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHook";

function hasRole(userRoles: string[] | undefined, required: string) {
  if (!userRoles) return false;
  const req = required.toLowerCase();
  return userRoles.some((r) => r.toLowerCase() === req);
}

const RequireRole = (props: { role: string }) => {
  const user = useAppSelector((s) => s.userReducer);

  if (!user) return <Navigate to="/auth" replace />;

  if (!hasRole(user.roles, props.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireRole;

