import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";

function Login_auth() {
  const navigate = useNavigate();
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Username:", username);
    // console.log("Password:", password);

    try {
      const result = await axios.post("http://localhost:3005/checkLogin", {
        username,
        password,
      });

      // console.log(result.data); // Log the API response

      if (result.data.status === "1") {
        // console.log("Token Key from API:", result.data.token_key); // Log token key from API

        sessionStorage.setItem("tokenKey", result.data.token_key); // Save token_key
        sessionStorage.setItem("userId", result.data.id);
        sessionStorage.setItem("post", result.data.post);

        toast.success("Login Successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Slide,
        });

        const userRole = result.data.post;

        if (userRole === "assistant") {
          toast.error("You are not authorized to access this site", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            transition: Slide,
          });
          navigate("/");
        } else if (userRole === "laboratory") {
          navigate("/LaboratoryDashboard");
        } else {
          navigate("/Dashboard");
        }
      } else {
        toast.error("Invalid credentials", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Slide,
        });
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Provide valid email and password. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Slide,
      });
    }
  };

  return (
    <div>
      <div className="main-wrapper login-body">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-6 login-wrap">
              <div className="login-sec">
                <div className="log-img">
                  <img
                    className="img-fluid"
                    src="assets/img/login-02.png"
                    alt="Logo"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6 login-wrap-bg">
              <div className="login-wrapper">
                <div className="loginbox">
                  <div className="login-right">
                    <div className="login-right-wrap">
                      <div className="account-logo">
                        <Link to="/">
                          <img src="assets/img/login-logo.png" alt="" />
                        </Link>
                      </div>
                      <h2>Login</h2>

                      <form onSubmit={handleSubmit}>
                        <div className="input-block">
                          <label>
                            Email <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="input-block">
                          <label>
                            Password <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control pass-input"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <span className="profile-views feather-eye-off toggle-password"></span>
                        </div>
                        <div className="forgotpass">
                          <div className="remember-me">
                            <label className="custom_check mr-2 mb-0 d-inline-flex remember-me">
                              Remember me
                              <input type="checkbox" name="radio" />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          {/* <a href="forgot-password.html">Password?</a> */}
                        </div>
                        <div className="input-block login-btn">
                          <button
                            className="btn btn-primary btn-block"
                            type="submit"
                          >
                            Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login_auth;
