// Code by Prajwal Punekar

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

// Function to highlight the matched text
const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: "#ff0", fontWeight: "bold" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

const EventDetailsPage = () => {
  const { date } = useParams(); // Extract date from URL params
  const [events, setEvents] = useState([]); // State to store appointment details
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate(); // Navigation hook

  // Fetch appointments when the component mounts or date changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/getallappointment",
          { withCredentials: true }
        );

        // Filter appointments based on selected date
        const eventsOnDate = response.data.filter((event) =>
          moment(event.time).isSame(date, "day")
        );

        // Sort appointments by time in 24-hour format
        const sortedEvents = eventsOnDate.sort((a, b) =>
          moment(a.time, "HH:mm").isBefore(moment(b.time, "HH:mm")) ? -1 : 1
        );

        setEvents(sortedEvents); // Set state with sorted appointments
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [date]);

  // Filter events based on search term, including mobile number
  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.appointment_no.toString().includes(searchTerm) ||
      event.mobileno.includes(searchTerm) // Include mobile number in the search
  );

  return (
    <div
      style={{
        padding: "40px 20px",
        fontFamily: "'Poppins', sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Appointments on {moment(date).format("MMMM Do, YYYY")}
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "12px 24px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#4caf50")}
        >
          Go Back
        </button>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search by Name, Treatment, Appointment No, or Mobile No."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "50px",
            border: "1px solid #ddd",
            width: "300px",
            marginLeft: "20px",
            outline: "none",
          }}
        />
      </div>

      {filteredEvents.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          {filteredEvents.map((event) => (
            <div
              key={event.appointment_no}
              style={{
                marginBottom: "20px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                transition: "transform 0.2s ease, box-shadow 0.3s ease",
              }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Name: {highlightText(event.name, searchTerm)}
              </h3>
              <p style={{ margin: "8px 0", fontSize: "16px" }}>
                <strong>Time:</strong> {moment(event.time).format("hh:mm A")}{" "}
                {/* Display in AM/PM */}
              </p>
              <p style={{ margin: "8px 0", fontSize: "16px" }}>
                <strong>Treatment:</strong>{" "}
                {highlightText(event.treatment, searchTerm)}
              </p>
              <p style={{ margin: "8px 0", fontSize: "16px" }}>
                <strong>Mobile No:</strong>{" "}
                {highlightText(event.mobileno, searchTerm)}
              </p>
              <p style={{ margin: "8px 0", fontSize: "16px" }}>
                <strong>Appointment No:</strong>{" "}
                {highlightText(event.appointment_no.toString(), searchTerm)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "#888",
            fontSize: "18px",
            fontStyle: "italic",
          }}
        >
          No appointments for this day.
        </p>
      )}
    </div>
  );
};

export default EventDetailsPage;
