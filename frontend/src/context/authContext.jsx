// AuthContext.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock state; replace with your logic

  // Mock login function
  const login = () => {
    localStorage.setItem("authToken", true);
    setIsAuthenticated(true);
  };

  // Mock logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  // Check if the user is authenticated
  const checkAuth = () => Boolean(localStorage.getItem("authToken"));

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
