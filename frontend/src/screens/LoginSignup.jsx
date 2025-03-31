import React, { useEffect, useState } from 'react'
import { signupUser, loginUser } from '../services/auth_api.js';

const LoginSignup = ({ setIsAuthenticated, setCurrentUser }) => {

  const [hasAccount, setHasAccount] = useState(false);
  const [hSentence, setHSentence] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setHSentence(hasAccount ? "Login" : "Sign Up");
  }, [hasAccount])

  const handleSignup = async () => {
    setError("");
    try {
      const response = await signupUser(username, email, password);      
      if (response && response.success && response.token) {
        console.log("Token received:", response.token.substring(0, 10) + "...");
        const userWithToken = {
          ...response.user,
          token: response.token
        };
        localStorage.setItem('currentUser', JSON.stringify(userWithToken));
        setCurrentUser(userWithToken);
        setIsAuthenticated(true);
      } else {
        setError(response?.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Signup failed. Please try again.");
    }
  }
  
  const handleLogin = async () => {
    setError("");
    try {
      const response = await loginUser(email, password);
      if (response && response.success) {
        const userWithToken = {
          ...response.user,
          token: response.token
        };
        localStorage.setItem('currentUser', JSON.stringify(userWithToken));
        setCurrentUser(userWithToken);
        setIsAuthenticated(true);
      } else {
        alert(response?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  }
  
  return (
    <div className='min-h-screen flex justify-center items-center bg-[#ffffff]'>
      <div className='w-full max-w-md shadow-2xl rounded-lg bg-[#fee9e8] p-6'>
        <h1 className='text-3xl font-bold text-center text-[#453837]'>
          {hSentence}
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className='flex flex-col gap-4 my-4'>
          { !hasAccount &&
            <input 
              type="text"
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full border-2 border-[#685654] rounded-lg px-3 py-2 text-1xl focus:outline-none focus:ring-1 focus:ring-[#453837]'
            />
          }
          <input 
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full border-2 border-[#685654] rounded-lg px-3 py-2 text-1xl focus:outline-none focus:ring-1 focus:ring-[#453837]'
          />
          <input 
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full border-2 border-[#685654] rounded-lg px-3 py-2 text-1xl focus:outline-none focus:ring-1 focus:ring-[#453837]'
          />
          <button
            onClick={hasAccount ? handleLogin : handleSignup}
            className='bg-[#b29bb8] text-[#ffffff] px-5 h-10 rounded-lg text-1xl transition-transform duration-300 hover:scale-105 hover:bg-[#79627e] shadow-[2px_2px_5px_#332936] active:bg-[#b29bb8]'
          >
            {hSentence}
          </button>
          <div
            onClick={() => setHasAccount(!hasAccount)}
            className='text-center cursor-pointer'
          >
            {hasAccount ? (
              "Don't have an account? Create One!"
              
            ) : (
              "Already have an account? Login!"
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginSignup;
