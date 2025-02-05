import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../navBar";
import { InputLabel } from "@mui/material";

const AddLaboratory = () => {
  const [formData, setFormData] = useState({
    title: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    name: "",
    mobileno: "",
    email: "",
    username: "",
    password: "",
    client_name: "",
    client_email: "",
    client_address: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

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
    const {
      title,
      country,
      state,
      city,
      pincode,
      address,
      name,
      mobileno,
      email,
      username,
      password,
      client_name,
      client_email,
      client_address,
    } = formData;

    const newErrors = {};

    // Name validation (letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name) {
      newErrors.name = "Name is required!";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Name must contain only letters and spaces.";
    }

    // Client Name validation (letters and spaces only)
    if (!client_name) {
      newErrors.client_name = "Client name is required!";
    } else if (!nameRegex.test(client_name)) {
      newErrors.client_name =
        "Client name must contain only letters and spaces.";
    }

    // Mobile number validation
    if (!mobileno) {
      newErrors.mobileno = "Mobile number is required!";
    } else if (!/^[0-9]{10}$/.test(mobileno)) {
      newErrors.mobileno = "Mobile number must be 10 digits.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required!";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Client email validation
    if (!client_email) {
      newErrors.client_email = "Client email is required!";
    } else if (!emailRegex.test(client_email)) {
      newErrors.client_email = "Please enter a valid client email address.";
    }

    // Username and password validation
    if (!username) newErrors.username = "Username is required!";
    if (!password) newErrors.password = "Password is required!";

    // Pincode validation
    if (!pincode) {
      newErrors.pincode = "Pincode is required!";
    } else if (isNaN(pincode) || pincode.length !== 6) {
      newErrors.pincode = "Pincode must be a 6-digit number.";
    }

    // Address validation
    if (!address) {
      newErrors.address = "Address is required!";
    }

    // Title validation (no special characters)
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!title) {
      newErrors.title = "Title is required!";
    } else if (specialCharRegex.test(title)) {
      newErrors.title = "Title should not contain special characters.";
    }

    // Client address validation (no special characters)
    if (!client_address) {
      newErrors.client_address = "Client address is required!";
    } else if (specialCharRegex.test(client_address)) {
      newErrors.client_address =
        "Client address should not contain special characters.";
    }

    // Country, State, City validation (required)
    if (!country) newErrors.country = "Country is required!";
    if (!state) newErrors.state = "State is required!";
    if (!city) newErrors.city = "City is required!";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validateForm();
    console.log(validationErrors); // Log the validation errors to the console
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Get the tokenKey from sessionStorage
    const tokenKey = sessionStorage.getItem("tokenKey");

    if (!tokenKey) {
      setErrors({ form: "Token key is missing!" });
      return;
    }

    // Include the tokenKey in the formData before submitting
    const formDataWithToken = { ...formData, token_key: tokenKey };

    try {
      const response = await axios.post(
        "http://103.165.118.71:8085/addLaboratory",
        formDataWithToken
      );
      setMessage(response.data);

      // Show modal after success
      setShowModal(true);

      // Reset the form after submission
      setFormData({
        title: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        address: "",
        name: "",
        mobileno: "",
        email: "",
        username: "",
        password: "",
        client_name: "",
        client_email: "",
        client_address: "",
      });

      // Navigate to the Laboratory page after 2 seconds
      setTimeout(() => {
        navigate("/laboratory");
      }, 4000);
    } catch (err) {
      setMessage("");
      setErrors({
        form: err.response?.data || "Failed to add Diagnostic Centre",
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/laboratory");
  };

  return (
    <div className="main-wrapper">
      <Navbar />

      <div className="page-wrapper" style={{ marginTop: "50px" }}>
        <div style={{ flex: 1, padding: "20px", backgroundColor: "#fff" }}>
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "20px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
            }}
          >
            Add Diagnostic Centre
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
            {/* Laboratory Details */}
            {[
              {
                name: "title",
                type: "text",
                placeholder: "Title",
                label: "Title",
              },
              {
                name: "country",
                type: "text",
                placeholder: "Country",
                label: "Country",
              },
              {
                name: "state",
                type: "text",
                placeholder: "State",
                label: "State",
              },
              {
                name: "city",
                type: "text",
                placeholder: "City",
                label: "City",
              },
              {
                name: "pincode",
                type: "number",
                placeholder: "Pincode",
                label: "Pincode",
              },
              {
                name: "address",
                type: "textarea",
                placeholder: "Address",
                label: "Address",
              },
              {
                name: "name",
                type: "text",
                placeholder: "Name",
                label: "Name",
              },
              {
                name: "mobileno",
                type: "number",
                placeholder: "Mobile Number",
                label: "Mobile Number",
              },
              {
                name: "email",
                type: "email",
                placeholder: "Email",
                label: "Email",
              },
              {
                name: "username",
                type: "text",
                placeholder: "Username",
                label: "Username",
              },
              {
                name: "password",
                type: "password",
                placeholder: "Password",
                label: "Password",
              },
            ].map((field) => (
              <div
                key={field.name}
                style={{
                  flex:
                    field.name === "address"
                      ? "1 1 100%"
                      : "1 1 calc(33.33% - 20px)",
                  minWidth: field.name === "address" ? "100%" : "200px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <label htmlFor={field.name} style={{ fontWeight: "bold" }}>
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      resize: "none",
                      fontSize: "14px",
                      height: "80px",
                    }}
                  ></textarea>
                ) : (
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
                )}
                {errors[field.name] && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}

            {/* Client Information Section */}
            <h3 style={{ width: "100%", marginTop: "20px" }}>
              Client Information
            </h3>
            {[
              {
                name: "client_name",
                type: "text",
                placeholder: "Client Name",
                label: "Client Name",
              },
              {
                name: "client_email",
                type: "email",
                placeholder: "Client Email",
                label: "Client Email",
              },
              {
                name: "client_address",
                type: "textarea",
                placeholder: "Client Address",
                label: "Client Address",
              },
            ].map((field) => (
              <div
                key={field.name}
                style={{
                  flex: "1 1 calc(33.33% - 20px)",
                  minWidth: "200px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <label htmlFor={field.name} style={{ fontWeight: "bold" }}>
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      resize: "none",
                      fontSize: "14px",
                      height: "80px",
                    }}
                  ></textarea>
                ) : (
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
                )}
                {errors[field.name] && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}

            {/* Submit Button */}
            <div>
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
                Add Diagnostic Centre
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <h3>Diagnostic Centre Added Successfully!</h3>
            <button
              onClick={handleCloseModal}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
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

export default AddLaboratory;
