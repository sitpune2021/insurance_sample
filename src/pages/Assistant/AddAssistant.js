import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../navBar";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import icons for password visibility toggle
import IconButton from "@mui/material/IconButton"; // Import IconButton from MUI

const AddAssistant = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobileno: "",
    email: "",
    username: "",
    password: "",
    pincode: "", // Added pincode field
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "", // Clear error for the field being edited
    });
  };

  const validateForm = () => {
    const { name, mobileno, email, username, password, pincode } = formData;
    const newErrors = {};

    // Name validation (letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name) {
      newErrors.name = "Name is required!";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Name must contain only letters and spaces.";
    }

    // Mobile number validation
    if (!mobileno) {
      newErrors.mobileno = "Mobile number is required!";
    } else if (!/^[0-9]{10}$/.test(mobileno)) {
      newErrors.mobileno = "Mobile number must be 10 digits.";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required!";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Username and password validation
    if (!username) newErrors.username = "Username is required!";
    if (!password) newErrors.password = "Password is required!";

    // Pincode validation
    if (!pincode) {
      newErrors.pincode = "Pincode is required!";
    } else if (!/^[0-9]{6}$/.test(pincode)) {
      newErrors.pincode = "Pincode must be 6 digits.";
    }

    return newErrors;
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Get token_key from sessionStorage
    const tokenKey = sessionStorage.getItem("tokenKey");

    try {
      // Add token_key to form data
      const response = await axios.post(
        "http://localhost:3005/addAssistant",
        { ...formData, token_key: tokenKey } // Include token_key
      );
      setMessage(response.data);

      setShowModal(true);

      setFormData({
        name: "",
        mobileno: "",
        email: "",
        username: "",
        password: "",
        pincode: "", // Reset pincode field
      });

      setTimeout(() => {
        navigate("/assistant");
      }, 4000);
    } catch (err) {
      setMessage("");
      setErrors({ form: err.response?.data || "Failed to add assistant" });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/assistant");
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  return (
    <div className="main-wrapper">
      <Navbar />

      <div className="page-wrapper" style={{ marginTop: "50px" }}>
        <div
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "#fff",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "20px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
            }}
          >
            Add Technician
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              maxWidth: "100%",
            }}
          >
            {[
              {
                name: "name",
                type: "text",
                placeholder: "Name",
                label: "Name",
              },
              {
                name: "mobileno",
                type: "text",
                placeholder: "Mobile No.",
                label: "Mobile No.",
              },
              {
                name: "email",
                type: "email",
                placeholder: "Email",
                label: "Email",
              },
              {
                name: "pincode",
                type: "text",
                placeholder: "Pincode",
                label: "Pincode",
              },
              {
                name: "username",
                type: "text",
                placeholder: "Username",
                label: "Username",
              },
              {
                name: "password",
                type: showPassword ? "text" : "password", // Toggle between text and password type
                placeholder: "Password",
                label: "Password",
                // icon: showPassword ? <VisibilityOff /> : <Visibility />, // Show the visibility icon
              },
            ].map((field) => (
              <div
                key={field.name}
                style={{
                  flex: "1 1 calc(50% - 20px)",
                  minWidth: "200px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <label
                  style={{
                    fontSize: "14px",
                    color: "#333",
                    fontWeight: "bold",
                  }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  style={{
                    padding: "12px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
                {field.name === "password" && (
                  <IconButton
                    onClick={handleClickShowPassword}
                    style={{ position: "absolute", right: "10px", top: "32px" }}
                  >
                    {field.icon}
                  </IconButton>
                )}
                {errors[field.name] && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}

            <div
              style={{ width: "100%", textAlign: "center", marginTop: "20px" }}
            >
              <button
                type="submit"
                style={{
                  padding: "12px 30px",
                  backgroundColor: "#2E37A4",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Add Technician
              </button>
            </div>
          </form>

          {message && (
            <p
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              {message}
            </p>
          )}
          {errors.form && (
            <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
              {errors.form}
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <h3>Technician Added Successfully!</h3>
           
            <button
              onClick={handleCloseModal}
              style={{  
                padding: "10px 20px",
                backgroundColor: "#2E37A4",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "20px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAssistant;
