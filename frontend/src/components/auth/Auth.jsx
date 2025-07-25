import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "../services/api";
import "./Auth.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true })
    }
  }, [])


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data?.data?.token)
      navigate("/dashboard")
      toast.success(data?.data?.message || "Login")
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Login failed.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data?.message || "Registered")
      setIsLogin(true);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Signup failed.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    if (isLogin) {
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ username, email, password });
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        {isLogin ? (
          <div className="login form">
            <header>Login</header>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="submit"
                className="button"
                value={loginMutation.isPending ? "Logging in..." : "Login"}
                disabled={loginMutation.isPending}
              />
            </form>
            <div className="signup">
              <span>
                Don't have an account?{" "}
                <button onClick={toggleForm} className="link-button">
                  Signup
                </button>
              </span>
            </div>
          </div>
        ) : (
          <div className="registration form">
            <header>Signup</header>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="submit"
                className="button"
                value={registerMutation.isPending ? "Signing up..." : "Signup"}
                disabled={registerMutation.isPending}
              />
            </form>
            <div className="signup">
              <span>
                Already have an account?{" "}
                <button onClick={toggleForm} className="link-button">
                  Login
                </button>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function toggleForm() {
    setIsLogin((prev) => !prev);
    setFormData({ username: "", email: "", password: "" });
  }
};

export default Auth;
