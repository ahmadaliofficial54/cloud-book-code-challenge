import { Spin } from "antd";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ component: Component, isPublic, ...rest }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const location = useLocation();
  if (isPublic && isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} />;
  }
  if (!isPublic && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return isAuthenticated || isPublic ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
