import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Temporarily bypass authentication
  const bypassAuth = true; // Set to true to allow accessing all pages

  if (!bypassAuth) {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;



// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//   const accessToken = localStorage.getItem('accessToken');
//   if (!accessToken) {

//     // If no token, redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;



// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import jwt_decode from 'jwt-decode';  // Fix: Ensure correct import without curly braces.

// const PrivateRoute = ({ children }) => {
//   const accessToken = localStorage.getItem('accessToken');

//   if (!accessToken) {
//     return <Navigate to="/login" replace />;
//   }

//   try {
//     const decodedToken = jwt_decode(accessToken);
//     const currentTime = Date.now() / 1000;

//     if (decodedToken.exp && decodedToken.exp < currentTime) {
//       alert('Session expired. Please log in again.');
//       localStorage.removeItem('accessToken');
//       return <Navigate to="/login" replace />;
//     }
//   } catch (error) {
//     console.error('Token decoding error:', error);
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;
