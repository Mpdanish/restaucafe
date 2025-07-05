import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import User from "../../assets/user.svg";
import Lock from "../../assets/lock.svg";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const Login = () => {
  const { login, checkAuth } = useAuth();
  const isAuth = checkAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/home");
    }
  }, [isAuth, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    const result = await api.login({ username, password });
    if (result.error) {
      setError("Invalid credentials");
    } else {
      setError("")
      login()
      navigate("/home");
    }
  };
  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-[#4b4b4d] overflow-hidden">
      {/* Left section with the logo */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-4">
        <img src={Logo} alt="Sea Land Car Care" className="w-3/4 max-w-xs" />
      </div>

      {/* Divider line */}
      <div className="hidden md:block w-px h-4/5 bg-gray-500"></div>

      {/* Right section with the login form */}
      <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center">
        <h2 className="text-white text-3xl font-bold mb-4">WELCOME</h2>
        <p className="text-white mb-8">PLEASE LOGIN TO ADMIN DASHBOARD</p>

        {/* Display error message */}
        {error && (
          <div className="mb-4 w-full max-w-md text-red-500 font-semibold">
            {error}
          </div>
        )}

        {/* Username Input */}
        <div className="mb-6 w-full max-w-md">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="username"
          >
            <div className="flex items-center">
              <img src={User} alt="user svg" className="mr-2" />
              Username
            </div>
          </label>
          <input
            className="w-full p-3 text-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-white"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="mb-6 w-full max-w-md">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="password"
          >
            <div className="flex items-center">
              <img src={Lock} alt="lock svg" className="mr-2" />
              Password
            </div>
          </label>
          <input
            className="w-full p-3 text-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-white"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="bg-white w-full max-w-md text-[#23346c] font-bold py-3 rounded-full hover:bg-[#c1c1cb] focus:outline-none focus:ring-2 focus:ring-[#c1c1cb]"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
};

export default Login;
