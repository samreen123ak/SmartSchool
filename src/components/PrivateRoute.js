import React from "react";  
import { Navigate, Outlet } from "react-router-dom";  

const PrivateRoute = ({ children }) => { 
    const isAuthenticated=localStorage.getItem("authtoken");
     
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;  
};  

export default PrivateRoute;

