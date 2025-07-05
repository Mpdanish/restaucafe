import React from 'react'

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
function PrivateRoutes() {
    const {isAuthenticated ,checkAuth} = useAuth()
    const authCheck = isAuthenticated || checkAuth();

  return authCheck ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoutes
