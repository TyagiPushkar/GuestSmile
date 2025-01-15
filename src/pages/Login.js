import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import image from "../assets/images/login.png";
import "../assets/css/Login.css";

const Login = ({setIsAuthenticated}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

const handleLogin = async (event) => {
  event.preventDefault();

  setLoading(true);
  setErrorMessage("");

  try {
    const response = await fetch("https://namami-infotech.com/GuestSmile/src/auth/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        companyName
      }),
    });

    const data = await response.json();

    if (data.message === "Login successful") {
      console.log("Login successful", data);
      localStorage.setItem("user", JSON.stringify(data.user)); // Save user info in localStorage
      localStorage.setItem("tenant", JSON.stringify(data.tenant));
      setIsAuthenticated(true); // Update authentication state
      navigate("/"); // Redirect to the dashboard
    } else {
      setErrorMessage(data.message || "Something went wrong!");
    }
  } catch (error) {
    setErrorMessage("Network error. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="body">
    <div className="signup-page">
      <div className="left-section">
        <img src={image} alt="Person at desk" className="illustration" />
      </div>
      <div className="right-section">
        <div className="form-container">
          <h1>Welcome Back</h1>
          <p>Login to GuestSmile</p>
            <form onSubmit={handleLogin}>
              <div className="form-group">
              <label htmlFor="companyName">Company</label>
              <input
                type="text"
                id="companyName"
                placeholder="Namami"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginId">Login ID</label>
              <input
                type="text"
                id="loginId"
                placeholder="Enter your Login ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group password-field">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="icon"
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        </div>
      </div>
      </div>
      </div>
  );
};

export default Login;
