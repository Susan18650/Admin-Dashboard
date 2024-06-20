import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const isAuthorized = Cookies.get('isAuthorized') === 'true';

    return isAuthorized ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
