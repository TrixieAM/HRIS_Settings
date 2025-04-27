import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/" />;
    }

    try {
        // Decode the JWT token to extract the user's role
        const decoded = JSON.parse(atob(token.split('.')[1]));

        // Check if the user's role is included in the allowedRoles
        if (allowedRoles.includes(decoded.role)) {
            return children;
        } else {
            // Redirect unauthorized users to a fallback page (e.g., unauthorized page)
            return <Navigate to="/unauthorized" />;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        return <Navigate to="/" />;
    }
};

export default ProtectedRoute;
