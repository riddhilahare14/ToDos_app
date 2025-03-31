import React, { useEffect, useState } from 'react'
import './App.css'
import Tasks from './screens/tasks'
import LoginSignup from './screens/LoginSignup'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   localStorage.removeItem('currentUser'); // Clears stored user data on restart
  //   setIsAuthenticated(false);
  //   setCurrentUser(null);
  //   setIsLoading(false);
  // }, []);
  
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem('currentUser');
    });
    return () => {
      window.removeEventListener('beforeunload', () => {
        localStorage.removeItem('currentUser');
      });
    };
  }, []);
  

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.token) {
          console.log("Found valid user with token in localStorage");
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } else {
          console.error("User data missing token, clearing localStorage");
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log("Authentication state changed:", { 
      isAuthenticated, 
      currentUser: currentUser ? { ...currentUser, token: "TOKEN_EXISTS" } : null 
    });
  }, [isAuthenticated, currentUser]);

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return isAuthenticated && currentUser ? (
    <Tasks user={currentUser}/>
  ) : (
    <LoginSignup setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser}/>
  );
};
export default App;
