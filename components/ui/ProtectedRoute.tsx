import { View, Text } from "react-native";
import React from "react";

const ProtectedRoute = () => {
  return (
    <View>
      <Text>ProtectedRoute</Text>
    </View>
  );
};

export default ProtectedRoute;

// // components/ProtectedRoute.jsx
// import React, { useEffect } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { useSelector } from 'react-redux';
// import { useRouter } from 'expo-router';

// const ProtectedRoute = ({ children }) => {
//   const { token, isLoading } = useSelector((state) => state.auth);
//   const router = useRouter();

//   useEffect(() => {
//     if (!token && !isLoading) {
//       router.replace('/login'); // Adjust to your login route
//     }
//   }, [token, isLoading]);

//   if (isLoading || !token) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return children;
// };

// export default ProtectedRoute;
