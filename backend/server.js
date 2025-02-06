const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const ExcelJS = require("exceljs");
const multer = require("multer");
const path = require("path");
const { default: axios } = require("axios");

const app = express();
app.use(
  cors({
    // origin: ["http://103.165.119.60:3000"],
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "insuerence",
});

//  const db = mysql.createConnection({
//    host: "103.165.119.60",
//    user: "sitsolutionsco_insurance_db",
//    password: "insurance_db@2024#",
//    database: "sitsolutionsco_insurance_db"
//  });

app.get("/getallappointment", (req, res) => {
  const sql = "SELECT * FROM appointment ORDER BY time DESC"; // Order by time in descending order
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch", error: err });
    }
    return res.json(data);
  });
});

app.get("/gettodayappointmentdashboard", (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  const sql = "SELECT * FROM appointment WHERE DATE(date_) = ?"; // Assuming 'date' is the name of the date field

  db.query(sql, [today], (err, data) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch today's appointments." });
    }
    return res.json(data);
  });
});

app.get("/getappointmentbypincode", (req, res) => {
  const { pincode } = req.query; // Get the pincode from the query parameter
  const sql = "SELECT * FROM appointment WHERE pincode = ?";

  db.query(sql, [pincode], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Fail to fetch data" });
    }
    return res.json(data);
  });
});

app.get("/getcentrebypincode", (req, res) => {
  const { pincode } = req.query; // Get the pincode from the query parameter
  const sql = "SELECT * FROM laboratory WHERE pincode = ?";

  db.query(sql, [pincode], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Fail to fetch data" });
    }
    return res.json(data);
  });
});

app.get("/getassistantbypincode", (req, res) => {
  const { pincode } = req.query; // Get the pincode from the query parameter
  const sql = "SELECT * FROM assistant WHERE pincode = ?";

  db.query(sql, [pincode], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Fail to fetch data" });
    }
    return res.json(data);
  });
});

app.post("/checkLogin", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM admin_login WHERE `email` = ? AND `password` = ?";

  db.query(sql, [username, password], (err, data) => {
    if (err) {
      console.error("Login Error:", err);
      return res
        .status(500)
        .json({ status: "0", message: "Failed to fetch user data" });
    }

    if (data.length > 0) {
      const { post, token_key, username, id } = data[0];
      return res.status(200).json({
        status: "1",
        message: "Login successful",
        post: post, // Send the post (role) here
        token_key: token_key,
        username: username,
        id,
      });
    } else {
      return res.status(401).json({
        status: "0",
        message: "Invalid credentials",
      });
    }
  });
});

app.get("/getUserDetails", (req, res) => {
  const tokenKey = req.query.tokenKey;

  if (!tokenKey) {
    return res.status(400).json({
      status: "0",
      message: "Token key is required",
    });
  }

  const sql = "SELECT * FROM admin_login WHERE `token_key` = ?";
  db.query(sql, [tokenKey], (err, data) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({
        status: "0",
        message: "Failed to fetch user details",
      });
    }

    if (data.length > 0) {
      return res.status(200).json({
        status: "1",
        userDetails: data[0],
      });
    } else {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }
  });
});

app.get("/getAdressMasterDetails", (req, res) => {
  const tokenKey = req.query.tokenKey;

  if (!tokenKey) {
    return res.status(400).json({
      status: "0",
      message: "Token key is required",
    });
  }

  const sql = "SELECT * FROM address_master WHERE `token_key` = ?";
  db.query(sql, [tokenKey], (err, data) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({
        status: "0",
        message: "Failed to fetch user details",
      });
    }

    if (data.length > 0) {
      return res.status(200).json({
        status: "1",
        userDetails: data[0],
      });
    } else {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }
  });
});

app.get("/getProfileById/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM address_master WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error("Error fetching address:", err);
      return res.status(500).json("Failed to fetch address");
    }
    if (data.length === 0) {
      return res.status(404).json("Address not found");
    }
    return res.status(200).json(data[0]);
  });
});

// Below code by Prajwal Punekar

// app.post("/saveProfile", (req, res) => {
//   const { tokenKey, address, country, state, city, pincode, mobileno } =
//     req.body;

//   if (
//     !tokenKey ||
//     !address ||
//     !country ||
//     !state ||
//     !city ||
//     !pincode ||
//     !mobileno
//   ) {
//     return res.status(400).json({
//       status: "0",
//       message: "All fields are required",
//     });
//   }

//   // Check if address exists for the given tokenKey
//   const checkSql = "SELECT * FROM address_master WHERE `token_key` = ?";
//   db.query(checkSql, [tokenKey], (err, data) => {
//     if (err) {
//       console.error("Error checking user details:", err);
//       return res.status(500).json({
//         status: "0",
//         message: "Error checking address info",
//       });
//     }

//     if (data.length > 0) {
//       // If address exists, update it
//       const updateSql = `
//         UPDATE address_master
//         SET address = ?, country = ?, state = ?, city = ?, pincode = ?, mobileno = ?
//         WHERE token_key = ?
//       `;
//       db.query(
//         updateSql,
//         [address, country, state, city, pincode, mobileno, tokenKey],
//         (err, result) => {
//           if (err) {
//             console.error("SQL Error:", err);
//             return res.status(500).json({
//               status: "0",
//               message: "Failed to update address",
//             });
//           }
//           return res.status(200).json({
//             status: "1",
//             message: "Address updated successfully",
//           });
//         }
//       );
//     } else {
//       // If address doesn't exist, insert a new record
//       const insertSql = `
//         INSERT INTO address_master (token_key, address, country, state, city, pincode, mobileno)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;
//       db.query(
//         insertSql,
//         [tokenKey, address, country, state, city, pincode, mobileno],
//         (err, result) => {
//           if (err) {
//             console.error("SQL Error:", err);
//             return res.status(500).json({
//               status: "0",
//               message: "Failed to add address",
//             });
//           }
//           return res.status(200).json({
//             status: "1",
//             message: "Address added successfully",
//           });
//         }
//       );
//     }
//   });
// });

app.post("/saveProfile", (req, res) => {
  const { tokenKey, address, country, state, city, pincode, mobileno } =
    req.body;

  if (!tokenKey) {
    return res.status(400).json({
      status: "0",
      message: "Token key is required",
    });
  }

  // Check if an address exists for the given tokenKey
  const checkSql = "SELECT * FROM address_master WHERE `token_key` = ?";
  db.query(checkSql, [tokenKey], (err, data) => {
    if (err) {
      console.error("Error checking address info:", err);
      return res.status(500).json({
        status: "0",
        message: "Error checking address info",
      });
    }

    if (data.length > 0) {
      // If address exists, update only the provided fields
      const currentData = data[0]; // Existing data for the tokenKey
      const updatedAddress = address || currentData.address;
      const updatedCountry = country || currentData.country;
      const updatedState = state || currentData.state;
      const updatedCity = city || currentData.city;
      const updatedPincode = pincode || currentData.pincode;
      const updatedMobileno = mobileno || currentData.mobileno;

      const updateSql = `
        UPDATE address_master 
        SET address = ?, country = ?, state = ?, city = ?, pincode = ?, mobileno = ?
        WHERE token_key = ?
      `;
      db.query(
        updateSql,
        [
          updatedAddress,
          updatedCountry,
          updatedState,
          updatedCity,
          updatedPincode,
          updatedMobileno,
          tokenKey,
        ],
        (err, result) => {
          if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({
              status: "0",
              message: "Failed to update address",
            });
          }
          return res.status(200).json({
            status: "1",
            message: "Address updated successfully",
          });
        }
      );
    } else {
      // If address doesn't exist, insert a new record
      const insertSql = `
        INSERT INTO address_master (token_key, address, country, state, city, pincode, mobileno)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertSql,
        [tokenKey, address, country, state, city, pincode, mobileno],
        (err, result) => {
          if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({
              status: "0",
              message: "Failed to add address",
            });
          }
          return res.status(200).json({
            status: "1",
            message: "Address added successfully",
          });
        }
      );
    }
  });
});

// app.get("/getAddressInfo", (req, res) => {
//   const tokenKey = req.body.tokenKey;

//   if (!tokenKey) {
//     return res.status(400).json({
//       status: "0",
//       message: "Token key is required",
//     });
//   }

//   const sql = "SELECT * FROM address_master WHERE `token_key` = ?";
//   db.query(sql, [tokenKey], (err, data) => {
//     if (err) {
//       console.error("Error fetching user details:", err);
//       return res.status(500).json({
//         status: "0",
//         message: "Failed to fetch user details",
//       });
//     }

//     if (data.length > 0) {
//       return res.status(200).json({
//         status: "1",
//         userDetails: data[0],
//       });
//     } else {
//       return res.status(404).json({
//         status: "0",
//         message: "User not found",
//       });
//     }
//   });
// });

// app.post("/addProfile", (req, res) => {
//   console.log("Request body:", req.body);

//   const { address, country, state, city, pincode, mobileno } = req.body;

//   if (!address || !country || !state || !city || !pincode || !mobileno) {
//     return res.status(400).json("All fields are required!");
//   }

//   const sql = `
//     INSERT INTO address_master
//     (address, country, state, city, pincode, mobileno)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;
//   console.log("SQL Query:", sql);
//   console.log("Values:", [address, country, state, city, pincode, mobileno]);

//   db.query(
//     sql,
//     [address, country, state, city, pincode, mobileno],
//     (err, result) => {
//       if (err) {
//         console.error("SQL Error:", err);
//         return res.status(500).json("Failed to add address");
//       }

//       console.log("SQL Result:", result);
//       return res.status(200).json("Address added successfully");
//     }
//   );
// });

// app.put("/updateProfile/:id", (req, res) => {
//   console.log("Request body:", req.body);

//   const { address, country, state, city, pincode, mobileno } = req.body;

//   if (!address || !country || !state || !city || !pincode || !mobileno) {
//     return res.status(400).json("All fields are required!");
//   }

//   const sql = `
//     UPDATE address_master
//     SET
//       address = ?,
//       country = ?,
//       state = ?,
//       city = ?,
//       pincode = ?,
//       mobileno = ?
//     WHERE id = ?
//   `;

//   const { id } = req.params;
//   console.log("SQL Query:", sql);
//   console.log("Values:", [
//     address,
//     country,
//     state,
//     city,
//     pincode,
//     mobileno,
//     id,
//   ]);

//   db.query(
//     sql,
//     [address, country, state, city, pincode, mobileno, id],
//     (err, result) => {
//       if (err) {
//         console.error("SQL Error:", err);
//         return res.status(500).json("Failed to update address");
//       }

//       console.log("SQL Result:", result);
//       return res.status(200).json("Appointment updated successfully");
//     }
//   );
// });

app.get("/getallappointment", (req, res) => {
  const sql = "SELECT * FROM appointment";
  db.query(sql, (err, data) => {
    if (err) {
      res.json("Fail to fetch");
    }
    res.send(data);
  });
});

app.get("/getallappointmentfortechnician", (req, res) => {
  const sql = "SELECT * FROM appointment where status = 'Unassigned'";
  db.query(sql, (err, data) => {
    if (err) {
      res.json("Fail to fetch");
    }
    res.send(data);
  });
});

app.get("/getAppointmentCountForAssistant", (req, res) => {
  // SQL query to count appointments based on the assistant's pincode and status 'Unassigned'
  const sql = `
    SELECT COUNT(DISTINCT appointment_id) AS appointmentCount
    FROM appointment
    JOIN assistant ON appointment.pincode = assistant.pincode
    WHERE appointment.status = 'Unassigned'
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching appointment count:", err);
      return res.status(500).json("Failed to fetch appointment count");
    }

    // Send the count of appointments as the response
    res.json( data[0].appointmentCount );
  });
});


app.get("/getallappointmentforAssistant", (req, res) => {
  // SQL query to join appointment and laboratory tables and filter by pincode
  const sql = `
  SELECT DISTINCT appointment.* 
  FROM appointment
  JOIN assistant ON appointment.pincode = assistant.pincode
  WHERE appointment.status = 'Unassigned'  
  `;

  db.query(sql, (err, data) => {
    if (err) {
      res.json("Fail to fetch");
    }
    res.send(data); // Send the filtered appointment data as response
  });
});

app.get("/getAppointmentByStatus/:status", (req, res) => {
  const { status } = req.params;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  // Set the condition based on the status value
  let statusCondition;
  if (status === "1") {
    statusCondition = "Assigned";
  } else if (status === "2") {
    statusCondition = "Unassigned";
  } else if (status === "3") {
    statusCondition = "Completed";
  } else {
    return res.status(400).json({ message: "Invalid status value" });
  }

  // Ensure the SQL query matches string values
  const sql = "SELECT * FROM appointment WHERE status = ?";
  db.query(sql, [statusCondition], (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch appointments by status" });
    }
    if (data.length === 0) {
      return res.status(404).json({
        message: `No appointments found with status ${statusCondition}`,
      });
    }
    res.status(200).send(data);
  });
});

app.get("/getlatestappointments", (req, res) => {
  const sql = "SELECT * FROM appointment ORDER BY time DESC LIMIT 5";
  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).json("Fail to fetch appointments");
    }
    return res.json(data); // Send the latest 5 appointments as JSON
  });
});

app.get("/getAppointmentCount", (req, res) => {
  const sql = "SELECT COUNT(*) AS count FROM appointment";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
});

// For Assigned appointment
app.get("/getAssignedAppointmentCount", (req, res) => {
  const sql =
    "SELECT COUNT(*) AS count FROM appointment where status = 'Assigned'";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
});

// For unassigned appointment
app.get("/getUnassignedAppointmentCount", (req, res) => {
  const sql =
    "SELECT COUNT(*) AS count FROM appointment where status = 'Unassigned'";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
});

app.get("/getcompletedAppointmentCount", (req, res) => {
  const sql =
    "SELECT COUNT(*) AS count FROM appointment where status = 'Completed'";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
}); 

app.put("/updateAppointment/:id", (req, res) => {
  const { id } = req.params;
  const { time, treatment, message } = req.body;

  const sql =
    "UPDATE appointment SET time = ?, treatment = ?, message = ? WHERE appointment_id = ?";

  db.query(sql, [time, treatment, message, id], (err, result) => {
    if (err) {
      console.error("Database error:", err); // More detailed logging here
      return res.status(500).send("Update failed");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Appointment not found");
    }
    res.status(200).send("Update successful");
  });
});

app.get("/getAppointmentById/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM appointment WHERE appointment_id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error("Database error:", err); // Log the error for debugging
      return res.status(500).json("Failed to fetch appointment details");
    }
    if (data.length === 0) {
      return res.status(404).json("Appointment not found");
    }
    res.json(data[0]);
  });
});

app.post("/addAppointment", (req, res) => {
  console.log("Request body:", req.body);

  const {
    name,
    date_,
    time_,
    treatment,
    mobileno,
    appointment_no,
    country,
    state,
    city,
    pincode,
    address,
    insurance_name,
    tpa_details,
  } = req.body;

  if (
    !name ||
    !date_ ||
    !time_ ||
    !treatment ||
    !mobileno ||
    !appointment_no ||
    !country ||
    !state ||
    !city ||
    !pincode ||
    !address ||
    !insurance_name ||
    !tpa_details
  ) {
    return res.status(400).json("All fields are required!");
  }

  const sql = `
    INSERT INTO appointment
    (name, date_, time_, treatment, mobileno, appointment_no, country, state, city, pincode, address, insurance_name, tpa_details) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  console.log("SQL Query:", sql);
  console.log("Values:", [
    name,
    date_,
    time_,
    treatment,
    mobileno,
    appointment_no,
    country,
    state,
    city,
    pincode,
    address,
    insurance_name,
    tpa_details,
  ]);

  db.query(
    sql,
    [
      name,
      date_,
      time_,
      treatment,
      mobileno,
      appointment_no,
      country,
      state,
      city,
      pincode,
      address,
      insurance_name,
      tpa_details,
    ],
    (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json("Failed to add appointment");
      }

      console.log("SQL Result:", result);
      return res.status(200).json("Appointment added successfully");
    }
  );
});

//Excel appointments

app.get("/previewAppointments", (req, res) => {
  const sql = "SELECT * FROM appointment";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Failed to fetch data");
    }
    return res.json(data); // Send data as JSON for preview
  });
});

app.get("/downloadAppointments", (req, res) => {
  const sql = "SELECT * FROM appointment";
  db.query(sql, async (err, data) => {
    if (err) {
      return res.status(500).json("Failed to fetch data");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Appointments");

    // Define columns
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Client Name", key: "name", width: 30 },
      { header: "Medical Test", key: "treatment", width: 30 },
      { header: "Contact No", key: "mobileno", width: 20 },
      { header: "Proposal No", key: "appointment_no", width: 20 },
      { header: "Appointment Time", key: "time", width: 25 },
    ];

    // Add rows
    data.forEach((appointment) => {
      worksheet.addRow({
        id: appointment.id,
        name: appointment.name,
        treatment: appointment.treatment,
        mobileno: appointment.mobileno,
        appointment_no: appointment.appointment_no,
        time: new Date(appointment.time).toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        }),
      });
    });

    // Set header for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=appointments.xlsx"
    );

    // Write Excel to response
    await workbook.xlsx.write(res);
    res.end();
  });
});

// Add Reply to Appointment and Store in Another Table
app.post("/addReply", (req, res) => {
  const { appointment_no, name, mobileno, treatment, time, reply } = req.body;

  if (!appointment_no || !name || !mobileno || !treatment || !time || !reply) {
    return res.status(400).json("All fields are required!");
  }

  const sql = `
    INSERT INTO appointment_replies 
    (appointment_no, name, mobileno, treatment, time, reply) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [appointment_no, name, mobileno, treatment, time, reply],
    (err, result) => {
      if (err) {
        console.error("Error adding reply:", err);
        return res.status(500).json("Failed to add reply");
      }

      return res.status(200).json("Reply added successfully");
    }
  );
});

// Get Replies for an Appointment
app.get("/getReplies/:appointment_no", (req, res) => {
  const { appointment_no } = req.params;

  const sql = `
    SELECT * FROM appointment_replies 
    WHERE appointment_no = ?
  `;

  db.query(sql, [appointment_no], (err, data) => {
    if (err) {
      console.error("Error fetching replies:", err);
      return res.status(500).json("Failed to fetch replies");
    }

    if (data.length === 0) {
      return res.status(404).json("No replies found for this appointment");
    }

    return res.status(200).json(data);
  });
});

//Laboratory

// Get All Laboratories
app.get("/getAllLaboratories", (req, res) => {
  const sql = "SELECT * FROM laboratory";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching laboratories:", err);
      return res.status(500).json("Failed to fetch laboratories");
    }
    return res.status(200).json(data);
  });
});

app.get("/getLaboratories", (req, res) => {
  const { token_key } = req.query; // Get token_key from the request query

  if (!token_key) {
    return res.status(400).json("Token key is required");
  }

  const sql = `SELECT * FROM laboratory WHERE token_key = ?`;

  db.query(sql, [token_key], (err, result) => {
    if (err) {
      console.error("Error fetching assistants:", err);
      return res.status(500).json("Failed to fetch assistants");
    }

    if (result.length === 0) {
      return res.status(404).json("No assistants found");
    }

    return res.status(200).json(result);
  });
});

app.get("/getLaboratoriesCount", (req, res) => {
  const sql = "SELECT COUNT(*) AS count FROM laboratory";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
});

// Get Laboratory by ID
app.get("/getLaboratoryById/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM laboratory WHERE lab_id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error("Error fetching laboratory:", err);
      return res.status(500).json("Failed to fetch laboratory");
    }
    if (data.length === 0) {
      return res.status(404).json("Laboratory not found");
    }
    return res.status(200).json(data[0]);
  });
});

// Add New Laboratory
// app.post("/addLaboratory", (req, res) => {
//   const {
//     title,
//     country,
//     state,
//     city,
//     pincode,
//     address,
//     name,
//     mobileno,
//     email,
//     username,
//     password,
//     client_name, // New field
//     client_email, // New field
//     client_address, // New field
//   } = req.body;

//   console.log("Received request to add laboratory:", req.body); // Log the incoming request

//   if (
//     !title ||
//     !country ||
//     !state ||
//     !city ||
//     !pincode ||
//     !address ||
//     !name ||
//     !mobileno ||
//     !email ||
//     !username ||
//     !password ||
//     !client_name || // Check for new fields
//     !client_email ||
//     !client_address
//   ) {
//     console.log("Validation error: All fields are required");
//     return res.status(400).json("All fields are required!");
//   }

//   const laboratorySql = `
//     INSERT INTO laboratory (title, country, state, city, pincode, address, name, mobileno, email, username, password, client_name, client_email, client_address)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;
//   console.log("SQL Query for laboratory:", laboratorySql);

//   const adminLoginSql = `
//     INSERT INTO admin_login (token_key, name, email, username, password, post)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;
//   console.log("SQL Query for admin login:", adminLoginSql);

//   // Generate a random token_key
//   const tokenKey = Math.random().toString(36).substr(2, 10);
//   console.log("Generated token key:", tokenKey);

//   // Start a transaction to ensure data consistency
//   db.beginTransaction((err) => {
//     if (err) {
//       console.error("Transaction Error:", err);
//       return res.status(500).json("Transaction Error");
//     }

//     // Insert into the laboratory table
//     db.query(
//       laboratorySql,
//       [
//         title,
//         country,
//         state,
//         city,
//         pincode,
//         address,
//         name,
//         mobileno,
//         email,
//         username,
//         password,
//         client_name, // Pass new field
//         client_email, // Pass new field
//         client_address, // Pass new field
//       ],
//       (err, labResult) => {
//         if (err) {
//           console.error("Error adding laboratory:", err);
//           return db.rollback(() => {
//             res.status(500).json("Failed to add laboratory");
//           });
//         }
//         console.log("Laboratory added successfully:", labResult);

//         // Insert into the admin_login table
//         db.query(
//           adminLoginSql,
//           [tokenKey, name, email, username, password, "laboratory"],
//           (err, adminResult) => {
//             if (err) {
//               console.error("Error adding admin login:", err);
//               return db.rollback(() => {
//                 res.status(500).json("Failed to add admin login");
//               });
//             }
//             console.log("Admin login added successfully:", adminResult);

//             // Commit the transaction
//             db.commit((err) => {
//               if (err) {
//                 console.error("Commit Error:", err);
//                 return db.rollback(() => {
//                   res.status(500).json("Failed to commit transaction");
//                 });
//               }

//               console.log("Transaction committed successfully");
//               res
//                 .status(201)
//                 .json("Laboratory and Admin Login added successfully");
//             });
//           }
//         );
//       }
//     );
//   });
// });

app.post("/addLaboratory", (req, res) => {
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
    client_name, // New field
    client_email, // New field
    client_address, // New field
    token_key, // New field for subadmin_key
  } = req.body;

  console.log("Received request to add laboratory:", req.body); // Log the incoming request

  if (
    !title ||
    !country ||
    !state ||
    !city ||
    !pincode ||
    !address ||
    !name ||
    !mobileno ||
    !email ||
    !username ||
    !password ||
    !client_name || // Check for new fields
    !client_email ||
    !client_address ||
    !token_key // Check for new subadmin_key field
  ) {
    console.log("Validation error: All fields are required");
    return res.status(400).json("All fields are required!");
  }

  // SQL query to insert into the laboratory table
  const laboratorySql = `
    INSERT INTO laboratory (title, country, state, city, pincode, address, name, mobileno, email, username, password, client_name, client_email, client_address, token_key)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  console.log("SQL Query for laboratory:", laboratorySql);

  // SQL query to insert into the admin_login table
  const adminLoginSql = `
    INSERT INTO admin_login (token_key, name, email, username, password, post)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  console.log("SQL Query for admin login:", adminLoginSql);

  // Generate a random token_key
  const tokenKey = Math.random().toString(36).substr(2, 10);
  console.log("Generated token key:", tokenKey);

  // Start a transaction to ensure data consistency
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction Error:", err);
      return res.status(500).json("Transaction Error");
    }

    // Insert into the laboratory table
    db.query(
      laboratorySql,
      [
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
        client_name, // Pass new field
        client_email, // Pass new field
        client_address, // Pass new field

        token_key, // Pass subadmin_key field
      ],
      (err, labResult) => {
        if (err) {
          console.error("Error adding laboratory:", err);
          return db.rollback(() => {
            res.status(500).json("Failed to add laboratory");
          });
        }
        console.log("Laboratory added successfully:", labResult);

        // Insert into the admin_login table
        db.query(
          adminLoginSql,
          [tokenKey, name, email, username, password, "laboratory"],
          (err, adminResult) => {
            if (err) {
              console.error("Error adding admin login:", err);
              return db.rollback(() => {
                res.status(500).json("Failed to add admin login");
              });
            }
            console.log("Admin login added successfully:", adminResult);

            // Commit the transaction
            db.commit((err) => {
              if (err) {
                console.error("Commit Error:", err);
                return db.rollback(() => {
                  res.status(500).json("Failed to commit transaction");
                });
              }

              console.log("Transaction committed successfully");
              res
                .status(201)
                .json("Laboratory and Admin Login added successfully");
            });
          }
        );
      }
    );
  });
});

// Update Laboratory by ID
app.put("/updateLaboratory/:id", (req, res) => {
  const { id } = req.params;
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
  } = req.body;

  // Validate that all required fields are provided
  if (
    !title ||
    !country ||
    !state ||
    !city ||
    !pincode ||
    !address ||
    !name ||
    !mobileno ||
    !email ||
    !username ||
    !password ||
    !client_name ||
    !client_email ||
    !client_address
  ) {
    return res.status(400).json("All fields are required!");
  }

  // Validate pincode
  if (isNaN(pincode) || pincode.length !== 6) {
    return res.status(400).json("Pincode must be a 6-digit number.");
  }

  const sql = `
    UPDATE laboratory
    SET title = ?, country = ?, state = ?, city = ?, pincode = ?, address = ?, 
        name = ?, mobileno = ?, email = ?, username = ?, password = ?, 
        client_name = ?, client_email = ?, client_address = ?
    WHERE lab_id = ?
  `;

  db.query(
    sql,
    [
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
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating laboratory:", err);
        return res.status(500).json("Failed to update laboratory");
      }
      if (result.affectedRows === 0) {
        return res.status(404).json("Laboratory not found");
      }
      return res.status(200).json("Laboratory updated successfully");
    }
  );
});

// Delete Laboratory by ID
app.delete("/deleteLaboratory/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM laboratory WHERE lab_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting laboratory:", err);
      return res.status(500).json("Failed to delete laboratory");
    }
    if (result.affectedRows === 0) {
      return res.status(404).json("Laboratory not found");
    }
    return res.status(200).json("Laboratory deleted successfully");
  });
});

// Assistant

// Get All Assistant
app.get("/getAllassistant", (req, res) => {
  const sql = "SELECT * FROM assistant";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching laboratories:", err);
      return res.status(500).json("Failed to fetch laboratories");
    }
    return res.status(200).json(data);
  });
});

app.get("/getAssistants", (req, res) => {
  const { token_key } = req.query; 

  if (!token_key) {
    return res.status(400).json("Token key is required");
  }

  const sql = `SELECT * FROM assistant WHERE token_key = ?`;

  db.query(sql, [token_key], (err, result) => {
    if (err) {
      console.error("Error fetching assistants:", err);
      return res.status(500).json("Failed to fetch assistants");
    }

    if (result.length === 0) {
      return res.status(404).json("No assistants found");
    }

    return res.status(200).json(result);
  });
});

app.get("/getAssistantsCount", (req, res) => {
  const { token_key } = req.query;

  if (!token_key) {
    return res.status(400).json("Token key is required");
  }

  const sql = `SELECT COUNT(*) AS assistantCount FROM assistant WHERE token_key = ?`;

  db.query(sql, [token_key], (err, result) => {
    if (err) {
      console.error("Error fetching assistant count:", err);
      return res.status(500).json("Failed to fetch assistant count");
    }

    return res.status(200).json({ assistantCount: result[0].assistantCount });
  });
});


// Get Assistant by ID
app.get("/getAssistantById/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM assistant WHERE assistant_id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error("Error fetching assistant:", err);
      return res.status(500).json("Failed to fetch assistant");
    }
    if (data.length === 0) {
      return res.status(404).json("Assistant not found");
    }
    return res.status(200).json(data[0]);
  });
});


app.post("/addAssistant", (req, res) => {
  const { name, mobileno, email, pincode, username, password, token_key } =
    req.body;

  if (
    !name ||
    !mobileno ||
    !email ||
    !pincode ||
    !username ||
    !password ||
    !token_key
  ) {
    return res.status(400).json("All fields are required!");
  }

  const sql = `
    INSERT INTO assistant (name, mobileno, email, pincode, username, password, token_key)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, mobileno, email, pincode, username, password, token_key], // Include token_key in the query
    (err, result) => {
      if (err) {
        console.error("Error adding assistant:", err);
        return res.status(500).json("Failed to add assistant");
      }
      return res.status(201).json("Assistant added successfully");
    }
  );
});

// Add New Assistant
// app.post("/addAssistant", (req, res) => {
//   const { name, mobileno, email, username, password } = req.body;

//   if (!name || !mobileno || !email || !username || !password) {
//     return res.status(400).json("All fields are required!");
//   }

//   const assistantSql = `
//     INSERT INTO assistant (name, mobileno, email, username, password)
//     VALUES (?, ?, ?, ?, ?)
//   `;

//   const adminLoginSql = `
//     INSERT INTO admin_login (token_key, name, email, username, password, post)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;

//   // Generate a random token_key
//   const tokenKey = Math.random().toString(36).substr(2, 10);

//   // Start a transaction to ensure data consistency
//   db.beginTransaction((err) => {
//     if (err) {
//       console.error("Transaction Error:", err);
//       return res.status(500).json("Transaction Error");
//     }

//     // Insert into the assistant table
//     db.query(
//       assistantSql,
//       [name, mobileno, email, username, password],
//       (err, assistantResult) => {
//         if (err) {
//           return db.rollback(() => {
//             console.error("Error adding assistant:", err);
//             res.status(500).json("Failed to add assistant");
//           });
//         }

//         // Insert into the admin_login table
//         db.query(
//           adminLoginSql,
//           [tokenKey, name, email, username, password, "assistant"],
//           (err, adminResult) => {
//             if (err) {
//               return db.rollback(() => {
//                 console.error("Error adding admin login:", err);
//                 res.status(500).json("Failed to add admin login");
//               });
//             }

//             // Commit the transaction
//             db.commit((err) => {
//               if (err) {
//                 return db.rollback(() => {
//                   console.error("Commit Error:", err);
//                   res.status(500).json("Failed to commit transaction");
//                 });
//               }

//               res
//                 .status(201)
//                 .json("Assistant and Admin Login added successfully");
//             });
//           }
//         );
//       }
//     );
//   });
// });

// Update Assistant by ID
app.put("/updateAssistant/:id", (req, res) => {
  const { id } = req.params;
  const { name, mobileno, email, pincode, username, password } = req.body;

  if (!name || !mobileno || !email || !pincode || !username || !password) {
    return res.status(400).json("All fields are required!");
  }

  const sql = `
    UPDATE assistant
    SET name = ?, mobileno = ?, email = ?, pincode = ?, username = ?, password = ?
    WHERE assistant_id = ?
  `;
  db.query(
    sql,
    [name, mobileno, email, pincode, username, password, id],
    (err, result) => {
      if (err) {
        console.error("Error updating assistant:", err);
        return res.status(500).json("Failed to update assistant");
      }
      if (result.affectedRows === 0) {
        return res.status(404).json("Assistant not found");
      }
      return res.status(200).json("Assistant updated successfully");
    }
  );
});

// Delete Assistant by ID
app.delete("/deleteAssistant/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM assistant WHERE assistant_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting assistant:", err);
      return res.status(500).json("Failed to delete assistant");
    }
    if (result.affectedRows === 0) {
      return res.status(404).json("Assistant not found");
    }
    return res.status(200).json("Assistant deleted successfully");
  });
});

//Roles & Permission

app.get("/getallRole", (req, res) => {
  const sql = "SELECT * FROM role_master";
  db.query(sql, (err, data) => {
    if (err) {
      res.json("Fail to fetch");
    }
    res.send(data);
  });
});

app.get("/getRoleCount", (req, res) => {
  const sql = "SELECT COUNT(*) AS count FROM role_master";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch role count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
});

app.put("/updateRole/:id", (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const sql = "UPDATE role_master SET role = ? WHERE role_id = ?";

  db.query(sql, [role, id], (err, result) => {
    if (err) {
      console.error("Database error:", err); // More detailed logging here
      return res.status(500).json({ message: "Update failed" }); // Return a JSON response
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Role not found" }); // Return a JSON response
    }
    res.status(200).json({ message: "Update successful" }); // Return a JSON response
  });
});

app.get("/getRoleById/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM role_master WHERE role_id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error("Database error:", err); // Log the error for debugging
      return res.status(500).json("Failed to fetch role details");
    }
    if (data.length === 0) {
      return res.status(404).json("Role not found");
    }
    res.json(data[0]);
  });
});

app.post("/addRole", (req, res) => {
  console.log("Request body:", req.body);

  const { role } = req.body;

  if (!role) {
    return res.status(400).json("All fields are required!");
  }

  const sql = `
    INSERT INTO role_master
    (role) 
    VALUES (?)
  `;
  console.log("SQL Query:", sql);
  console.log("Values:", [role]);

  db.query(sql, [role], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json("Failed to add appointment");
    }

    console.log("SQL Result:", result);
    return res.status(200).json("Role added successfully");
  });
});

app.delete("/deleteRole/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM role_master WHERE role_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting role:", err);
      return res.status(500).json("Failed to delete role");
    }
    if (result.affectedRows === 0) {
      return res.status(404).json("Role not found");
    }
    return res.status(200).json("Role deleted successfully");
  });
});

//Assign technician
app.post("/assignTechnicians", (req, res) => {
  console.log("Request body:", req.body);

  const { technicianId, appointmentIds } = req.body;

  // Check if both fields are provided
  if (!technicianId || !appointmentIds || !Array.isArray(appointmentIds)) {
    return res
      .status(400)
      .json("Technician ID and Appointment IDs are required!");
  }

  // Loop through all appointment IDs and prepare records for insertion
  const assignments = appointmentIds.map((appointmentId) => [
    appointmentId,
    technicianId,
  ]);

  // SQL query to insert assignments into the database
  const assignSql = `
    INSERT INTO assign_appointment (appointment_id, technician_id)
    VALUES ?
  `;

  console.log("SQL Query for Insert:", assignSql);
  console.log("Values for Insert:", [assignments]);

  // Execute the query to insert multiple assignments
  db.query(assignSql, [assignments], (err, result) => {
    if (err) {
      console.error("SQL Error on Insert:", err);
      return res
        .status(500)
        .json("Failed to assign technicians to appointments");
    }

    console.log("Insert Result:", result);

    // Update the status of the appointments to "Assigned"
    const updateSql = `
      UPDATE appointment
      SET status = 'Assigned'
      WHERE appointment_id IN (?)
    `;

    console.log("SQL Query for Update:", updateSql);
    console.log("Values for Update:", [appointmentIds]);

    // Execute the query to update the status
    db.query(updateSql, [appointmentIds], (updateErr, updateResult) => {
      if (updateErr) {
        console.error("SQL Error on Update:", updateErr);
        return res
          .status(500)
          .json("Failed to update appointment statuses to 'Assigned'");
      }

      console.log("Update Result:", updateResult);
      return res
        .status(200)
        .json(
          "Technician assigned to appointments and statuses updated successfully"
        );
    });
  });
});

//OTP By Email
const nodemailer = require("nodemailer");

// Send OTP API (Email Version)
app.post("/sendOTPEmail", async (req, res) => {
  const { email } = req.body;

  // Input Validation
  if (!email) {
    console.log("Email is missing in the request body!");
    return res.status(400).json({
      success: false,
      message: "Email is required!",
    });
  }

  try {
    // Check if the email exists in the "assistant" table
    console.log("Checking if email exists in the database:", email);
    const assistant = await db.query(
      "SELECT * FROM admin_login WHERE email = ?",
      [email]
    );

    if (assistant.length === 0) {
      // Email not found in the database
      console.log("Email not found in the assistant table:", email);
      return res.status(404).json({
        success: false,
        message: "Email not found in assistant table!",
      });
    }

    // If the email exists, generate OTP and expiration time
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const expirationTime = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use your email service provider
      auth: {
        user: "swayambhoodev@gmail.com", // Your email
        pass: "czdj jiyi fjme wcyh", // Your email password or app password
      },
    });

    // Email message details
    const mailOptions = {
      from: "swayambhoodev@gmail.com", // Sender email
      to: email, // Recipient email
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for the next 5 minutes.`,
    };

    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending OTP via email:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to send OTP via email",
          error: err.message,
        });
      }

      console.log("OTP sent successfully via email:", info.response);

      // Respond with success
      return res.status(201).json({
        success: true,
        message: "OTP sent successfully via email",
        data: {
          email,
          otp,
          expirationTime,
        },
      });
    });
  } catch (error) {
    console.error("Error in sendOTPEmail API:", error.message);

    // Respond with error
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
      error: error.message,
    });
  }
});
app.post("/forgetAdminPassword", async (req, res) => {
  const { email, newPassword } = req.body;

  // Input Validation
  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Mobile number and new password are required!",
    });
  }

  try {
    // Check if the mobile number exists in the "assistant" table
    const assistant = await db.query(
      "SELECT * FROM admin_login WHERE email = ?",
      [email]
    );

    if (assistant.length === 0) {
      // Mobile number not found in the database
      return res.status(404).json({
        success: false,
        message: "Mobile number not found!",
      });
    }

    // Update the password in the "assistant" table
    await db.query("UPDATE admin_login SET password = ? WHERE email = ?", [
      newPassword,
      email,
    ]);

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error.message);

    // Respond with error
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
});

//Sub-Admin Master API

app.get("/getAllSubadmin", (req, res) => {
  const sql = "SELECT * FROM subadminmaster";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching Subadmin:", err);
      return res.status(500).json("Failed to fetch Subadmin");
    }
    return res.status(200).json(data);
  });
});

app.get("/getSubadminCount", (req, res) => {
  const sql = "SELECT COUNT(*) AS count FROM subadminmaster";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
});

// Get Laboratory by ID
app.get("/getSubadminById/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM subadminmaster WHERE subadmin_id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error("Error fetching Subadmin:", err);
      return res.status(500).json("Failed to fetch Subadmin");
    }
    if (data.length === 0) {
      return res.status(404).json("Subadmin not found");
    }
    return res.status(200).json(data[0]);
  });
});

// Add New Laboratory
app.post("/addSubadmin", (req, res) => {
  const {
    name,
    mname,
    lname,
    country,
    state,
    city,
    pincode,
    address,

    mobileno,
    email,
    username,
    password,
  } = req.body;

  console.log("Received request to add laboratory:", req.body); // Log the incoming request

  if (
    !name ||
    !mname ||
    !lname ||
    !country ||
    !state ||
    !city ||
    !pincode ||
    !address ||
    !mobileno ||
    !email ||
    !username ||
    !password
  ) {
    console.log("Validation error: All fields are required");
    return res.status(400).json("All fields are required!");
  }

  const subadminSql = `
    INSERT INTO subadminmaster (name, mname, lname, country, state, city, pincode, address, mobileno, email, username, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  console.log("SQL Query for Subadmin:", subadminSql);

  const adminLoginSql = `
    INSERT INTO admin_login (token_key, name, email, username, password, post)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  console.log("SQL Query for admin login:", adminLoginSql);

  // Generate a random token_key
  const tokenKey = Math.random().toString(36).substr(2, 10);
  console.log("Generated token key:", tokenKey);

  // Start a transaction to ensure data consistency
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction Error:", err);
      return res.status(500).json("Transaction Error");
    }

    // Insert into the laboratory table
    db.query(
      subadminSql,
      [
        name,
        mname,
        lname,
        country,
        state,
        city,
        pincode,
        address,

        mobileno,
        email,
        username,
        password,
      ],
      (err, labResult) => {
        if (err) {
          console.error("Error adding laboratory:", err);
          return db.rollback(() => {
            res.status(500).json("Failed to add laboratory");
          });
        }
        console.log("Subadmin added successfully:", labResult);

        // Insert into the admin_login table
        db.query(
          adminLoginSql,
          [tokenKey, name, email, username, password, "subadmin"],
          (err, adminResult) => {
            if (err) {
              console.error("Error adding admin login:", err);
              return db.rollback(() => {
                res.status(500).json("Failed to add admin login");
              });
            }
            console.log("Admin login added successfully:", adminResult);

            // Commit the transaction
            db.commit((err) => {
              if (err) {
                console.error("Commit Error:", err);
                return db.rollback(() => {
                  res.status(500).json("Failed to commit transaction");
                });
              }

              console.log("Transaction committed successfully");
              res.status(201).json("Sub-Admin added successfully");
            });
          }
        );
      }
    );
  });
});

// Update Laboratory by ID
app.put("/updateSubadmin/:id", (req, res) => {
  const { id } = req.params;
  const {
    name,
    mname,
    lname,
    country,
    state,
    city,
    pincode,
    address,

    mobileno,
    email,
    username,
    password,
  } = req.body;

  // Validate that all required fields are provided
  if (
    !name ||
    !mname ||
    !lname ||
    !country ||
    !state ||
    !city ||
    !pincode ||
    !address ||
    !mobileno ||
    !email ||
    !username ||
    !password
  ) {
    return res.status(400).json("All fields are required!");
  }

  // Validate pincode
  if (isNaN(pincode) || pincode.length !== 6) {
    return res.status(400).json("Pincode must be a 6-digit number.");
  }

  const sql = `
    UPDATE subadminmaster
    SET name = ?, mname = ?, lname = ?, country = ?, state = ?, city = ?, pincode = ?, address = ?, 
         mobileno = ?, email = ?, username = ?, password = ?
        
    WHERE subadmin_id = ?
  `;

  db.query(
    sql,
    [
      name,
      mname,
      lname,
      country,
      state,
      city,
      pincode,
      address,

      mobileno,
      email,
      username,
      password,

      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating Subadmin:", err);
        return res.status(500).json("Failed to update Subadmin");
      }
      if (result.affectedRows === 0) {
        return res.status(404).json("Subadmin not found");
      }
      return res.status(200).json("Subadmin updated successfully");
    }
  );
});

// Delete Laboratory by ID
app.delete("/deleteSubadmin/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM subadminmaster WHERE subadmin_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting Subadmin:", err);
      return res.status(500).json("Failed to delete Subadmin");
    }
    if (result.affectedRows === 0) {
      return res.status(404).json("Subadmin not found");
    }
    return res.status(200).json("Subadmin deleted successfully");
  });
});

//Application API

app.post("/checkLoginAssistant", (req, res) => {
  const sql = "SELECT * FROM assistant WHERE `mobileno` = ? AND `password` = ?";
  db.query(sql, [req.body.mobileno, req.body.password], (err, data) => {
    if (err) {
      console.error("Login Error:", err);
      return res
        .status(500)
        .json({ status: "0", message: "Failed to fetch user data" });
    }

    if (data.length > 0) {
      return res.status(200).json({
        status: "1",
        message: "Login successful",
        user: data[0], // Send all user details from the first record
      });
    } else {
      return res.status(401).json({
        status: "0",
        message: "Invalid credentials",
      });
    }
  });
});

app.get("/gettodayappointment", (req, res) => {
  const technicianId = req.query.technician_id;

  if (!technicianId) {
    return res.status(400).json({ message: "technician_id is required" });
  }

  // First query to get the appointment_id(s) assigned to the technician
  const sql1 = "SELECT * FROM assign_appointment WHERE technician_id = ?";
  db.query(sql1, [technicianId], (err, assignData) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch assigned appointments", error: err });
    }

    if (assignData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the given technician" });
    }

    const appointmentIds = assignData.map((row) => row.appointment_id);
    console.log("----------" + appointmentIds.length);

    // Get today's date in DD/MM/YYYY format manually
    const todayDate = new Date();
    const dd = String(todayDate.getDate()).padStart(2, "0"); // Ensure 2-digit format
    const mm = String(todayDate.getMonth() + 1).padStart(2, "0"); // Month is 0-based, add 1
    const yyyy = todayDate.getFullYear();
    const today = `${dd}/${mm}/${yyyy}`;

    // Second query to fetch appointment details for the matched appointment_ids
    const sql2 =
      "SELECT * FROM appointment WHERE time LIKE ? AND appointment_id IN (?) AND status != 'Completed'";
    db.query(sql2, [`${today}%`, appointmentIds], (err, appointmentData) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch appointment details",
          error: err,
        });
      }

      return res.json(appointmentData);
    });
  });
});

// app.get("/gettodayappointment", (req, res) => {
//   const today = new Date().toISOString().split("T")[0];

//   const sql = "SELECT * FROM appointment const appointmentIds = assignData.map((row) => row.appointment_id);";

//   // Execute the query with today's date
//   db.query(sql, [today], (err, data) => {
//     if (err) {
//       console.error("Error fetching data:", err);
//       res
//         .status(500)
//         .json({ message: "Failed to fetch today's appointments." });
//       return;
//     }
//     res.json(data);
//   });
// });

app.get("/getscheduleappointment", (req, res) => {
  const technicianId = req.query.technician_id; // Get technician_id from query parameters

  if (!technicianId) {
    return res.status(400).json({ message: "technician_id is required" });
  }

  // First query to get the appointment_id(s) assigned to the technician
  const sql1 = "SELECT * FROM assign_appointment WHERE technician_id = ?";
  db.query(sql1, [technicianId], (err, assignData) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch assigned appointments", error: err });
    }

    if (assignData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the given technician" });
    }

    const appointmentIds = assignData.map((row) => row.appointment_id);
    console.log("----------" + appointmentIds.length);

    // Second query to fetch appointment details for the matched appointment_ids

    const sql2 =
      "SELECT * FROM appointment WHERE status = 'Assigned' AND appointment_id IN (?)";
    db.query(sql2, [appointmentIds], (err, appointmentData) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch appointment details",
          error: err,
        });
      }

      return res.json(appointmentData);
    });
  });
});
// app.get("/getscheduleappointment", (req, res) => {
//   const sql = "SELECT * FROM appointment where schedule = 'Schedule'";
//   db.query(sql, (err, data) => {
//     if (err) {
//       res.json("Fail to fetch");
//     }
//     return res.send(data);
//     f;
//   });
// });

app.get("/getpendingappointment", (req, res) => {
  const technicianId = req.query.technician_id; // Get technician_id from query parameters

  if (!technicianId) {
    return res.status(400).json({ message: "technician_id is required" });
  }

  // First query to get the appointment_id(s) assigned to the technician
  const sql1 = "SELECT * FROM assign_appointment WHERE technician_id = ?";
  db.query(sql1, [technicianId], (err, assignData) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch assigned appointments", error: err });
    }

    if (assignData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the given technician" });
    }

    const appointmentIds = assignData.map((row) => row.appointment_id);
    console.log("----------" + appointmentIds.length);

    // Second query to fetch appointment details for the matched appointment_ids

    const sql2 =
      "SELECT * FROM appointment WHERE status = 'Unassigned' AND appointment_id IN (?)";
    db.query(sql2, [appointmentIds], (err, appointmentData) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch appointment details",
          error: err,
        });
      }

      return res.json(appointmentData);
    });
  });
});

// app.get("/getpendingappointment", (req, res) => {
//   const sql = "SELECT * FROM appointment where status = 'Unassigned'";
//   db.query(sql, (err, data) => {
//     if (err) {
//       res.json("Fail to fetch");
//     }
//     return res.send(data);
//     f;
//   });
// });

app.get("/getassignappointment", (req, res) => {
  const sql = "SELECT * FROM appointment where status = 'Assigned'";
  db.query(sql, (err, data) => {
    if (err) {
      res.json("Fail to fetch");
    }
    return res.send(data);
    f;
  });
});

// PUT endpoint to update the appointment status to 'completed'
app.put("/updateAppointmentStatus/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE appointment
    SET status = 'Completed'
    WHERE appointment_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error updating appointment status:", err);
      return res
        .status(500)
        .json({ message: "Failed to update appointment status" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res
      .status(200)
      .json({ message: "Appointment status updated to completed" });
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads"); // Folder to store images
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // File name with a unique suffix
  },
});

const upload = multer({ storage });

// Add Appointment API
app.post("/addappointmentapp", upload.single("image"), (req, res) => {
  const { appointment_no, latitude, longitude, description, assistant_id } =
    req.body;
  const imagePath = req.file ? `uploads/${req.file.filename}` : null;

  if (
    !appointment_no ||
    !description ||
    !assistant_id ||
    !latitude ||
    !longitude ||
    !imagePath
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO appointment_replies (appointment_no, description, image, latitude, longitude, assistant_id) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [appointment_no, description, latitude, longitude, imagePath, assistant_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add appointment" });
      }
      res.status(200).json({ message: "Appointment added successfully" });
    }
  );
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Send OTP API
app.post("/sendOTP", (req, res) => {
  const { mobileno } = req.body;

  // Input Validation
  if (!mobileno) {
    console.log("Mobile number is missing in the request body!");
    return res.status(400).json({
      success: false,
      message: "Mobile number is required!",
    });
  }

  // Check if the mobile number exists in the "assistant" table
  console.log("Checking if mobileno exists in the database:", mobileno);
  db.query(
    "SELECT * FROM assistant WHERE mobileno = ?",
    [mobileno],
    (err, assistant) => {
      if (err) {
        console.error("Error querying the database:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error while checking mobile number",
          error: err.message,
        });
      }

      // Log the result of the query to help with debugging
      console.log("Assistant query result:", assistant);

      if (assistant.length === 0) {
        // Mobile number not found in the database
        console.log(
          "Mobile number not found in the assistant table:",
          mobileno
        );
        return res.status(404).json({
          success: false,
          message: "Mobile number not found in assistant table!",
        });
      } else {
        console.log("Mobile number found in the assistant table:", mobileno);

        // If the mobile number exists, generate OTP and expiration time
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const expirationTime = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

        // Send OTP via WhatsApp or SMS using your API
        const xmlData = `user=SITSol&key=b6b34d1d4dXX&mobile=${mobileno}&message=Your OTP is ${otp}&senderid=DALERT&accusage=10`;
        const URL = "http://redirect.ds3.in/submitsms.jsp"; // Replace with your WhatsApp API endpoint

        // Using .then() and .catch() instead of async/await
        axios
          .post(URL, xmlData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then((response) => {
            console.log("OTP sent successfully:", response.data);

            // Respond with success without including the API response
            return res.status(201).json({
              success: true,
              message: "OTP sent successfully",
              data: {
                mobileno,
                otp,
                expirationTime,
              },
            });
          })
          .catch((error) => {
            console.error("Error sending OTP:", error.message);

            // Respond with error
            return res.status(500).json({
              success: false,
              message: "Failed to send OTP",
              error: error.message,
            });
          });
      }
    }
  );
});

app.post("/forgetPassword", async (req, res) => {
  const { mobileno, newPassword } = req.body;

  // Input Validation
  if (!mobileno || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Mobile number and new password are required!",
    });
  }

  try {
    // Check if the mobile number exists in the "assistant" table
    const assistant = await db.query(
      "SELECT * FROM assistant WHERE mobileno = ?",
      [mobileno]
    );

    if (assistant.length === 0) {
      // Mobile number not found in the database
      return res.status(404).json({
        success: false,
        message: "Mobile number not found!",
      });
    }

    // Update the password in the "assistant" table
    await db.query("UPDATE assistant SET password = ? WHERE mobileno = ?", [
      newPassword,
      mobileno,
    ]);

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error.message);

    // Respond with error
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
});

app.get("/getassignappointmentfortechnician", (req, res) => {
  const technicianId = req.query.technician_id; // Get technician_id from query parameters

  if (!technicianId) {
    return res.status(400).json({ message: "technician_id is required" });
  }

  // First query to get the appointment_id(s) assigned to the technician
  const sql1 = "SELECT * FROM assign_appointment WHERE technician_id = ?";
  db.query(sql1, [technicianId], (err, assignData) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch assigned appointments", error: err });
    }

    if (assignData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the given technician" });
    }

    // Extract appointment_ids from the first query result
    const appointmentIds = assignData.map((row) => row.appointment_id);

    // Second query to fetch appointment details for the matched appointment_ids
    const sql2 =
      "SELECT * FROM appointment WHERE appointment_id IN (?) and status !='Completed'";
    db.query(sql2, [appointmentIds], (err, appointmentData) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to fetch appointment details", error: err });
      }

      return res.json(appointmentData);
    });
  });
});

app.get("/getcompletedappointmentfortechnician", (req, res) => {
  const technicianId = req.query.technician_id; // Get technician_id from query parameters

  if (!technicianId) {
    return res.status(400).json({ message: "technician_id is required" });
  }

  // First query to get the appointment_id(s) assigned to the technician
  const sql1 = "SELECT * FROM assign_appointment WHERE technician_id = ?";
  db.query(sql1, [technicianId], (err, assignData) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch assigned appointments", error: err });
    }

    if (assignData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the given technician" });
    }

    // Extract appointment_ids from the first query result
    const appointmentIds = assignData.map((row) => row.appointment_id);

    // Second query to fetch appointment details for the matched appointment_ids
    const sql2 =
      "SELECT * FROM appointment WHERE appointment_id IN (?) and status ='Completed'";
    db.query(sql2, [appointmentIds], (err, appointmentData) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to fetch appointment details", error: err });
      }

      return res.json(appointmentData);
    });
  });
});

app.get("/", (req, res) => {
  return res.json("From Backend");
});

app.listen(3005, () => {
  console.log("Listening");
});

const Imap = require("imap");
const { simpleParser } = require("mailparser");

// Email configuration
const imapConfig = {
  user: "prajwalsitsolutions@gmail.com",
  password: "fpvw pxjq ietk svdl", // Use an app password for Gmail
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to the database.");
});

// Email Pattern no 7

async function parseAndInsertEmail7(emailContent) {
  try {
    // Helper function to extract fields with regex
    const extractField = (pattern, text, defaultValue = null) => {
      const match = text.match(pattern);
      return match ? match[1].trim() : defaultValue;
    };

    // Extracting individual fields from the email content
    const tpaDetails = extractField(/sales number\s*:\s*(\d+)/i, emailContent);
    const name = extractField(
      /\*?Customer Full Name:\*?\s*([\w-]+)/i,
      emailContent
    );
    const appointmentNo = extractField(
      /\*?application Number:\*?\s*(\d+)/i,
      emailContent
    );
    const mobileno = extractField(
      /Contact No\.\s*\(.*?\)\s*\|\s*\d+\s*\|\s*(\d{10})/i,
      emailContent
    );
    const time = extractField(
      /\*?Appointment date & time:\*?\s*([\d-]+\s[\d:]+\s[APM]+)/i,
      emailContent
    );

    // Extracting address details
    const addressDetails = emailContent.match(
      /HOME Visit Address\s*\*?\s*([\s\S]+?),\s*([\w\s]+),\s*([\w\s]+)\s*[-.,\s]*\s*(\d{6})/i
    );
    const parsedAddress = addressDetails
      ? addressDetails[1].trim().replace(/\n/g, " ")
      : null;
    const city = addressDetails ? addressDetails[2].trim() : null;
    const state = addressDetails ? addressDetails[3].trim() : null;
    const pincode = addressDetails ? addressDetails[4] : null;

    const treatmentMatch = emailContent.match(
      /Medicals[\s\S]*?(Medical Examination Report[\s\S]*?)\nNote[\s\S]*?(In Biochemistry.*)/i
    );
    const treatmentDetails = treatmentMatch
      ? `${treatmentMatch[1]
          .trim()
          .replace(/\n/g, " ")}. Note - ${treatmentMatch[2]
          .trim()
          .replace(/\n/g, " ")}`
      : "No treatment details found";

    // Log the parsed data for verification
    console.log("Parsed Email Data Before Insert:");
    console.log({
      tpaDetails,
      name,
      appointmentNo,
      mobileno,
      time,
      address: parsedAddress,
      country: "India",
      state,
      city,
      pincode,
      treatment: treatmentDetails,
    });

    // Insert data into the database
    db.query(
      "INSERT INTO appointment (tpa_details, name, appointment_no, mobileno, time, address, country, state, city, pincode, treatment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        tpaDetails,
        name,
        appointmentNo,
        mobileno,
        time,
        parsedAddress,
        "India",
        state,
        city,
        pincode,
        treatmentDetails, // Storing only the relevant treatment details
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting data into the database:", err.message);
        } else {
          console.log("Data inserted successfully!", result);
        }
      }
    );
  } catch (error) {
    console.error("Error parsing email content:", error.message);
  }
}

// Read emails and process them
function readEmails7() {
  const imap = new Imap(imapConfig);

  imap.once("ready", () => {
    imap.openBox("INBOX", false, (err, box) => {
      if (err) throw err;

      imap.search(["UNSEEN"], (err, results) => {
        if (err || results.length === 0) {
          console.log("No new emails found.");
          imap.end();
          return;
        }

        const fetch = imap.fetch(results, { bodies: "" });
        fetch.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error("Error parsing email:", err.message);
                return;
              }

              const emailContent = parsed.text;
              console.log("Processing email content:\n", emailContent);

              // Parse and insert the email content into the database
              await parseAndInsertEmail7(emailContent);
            });
          });
        });

        fetch.once("end", () => {
          console.log("Done fetching all unseen emails.");
          imap.end();
        });
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP Error:", err);
  });

  imap.once("end", () => {
    console.log("Connection closed.");
  });

  imap.connect();
}

// Start reading emails
// readEmails7();

//Email Pattern no 8
async function parseAndInsertNewEmail8(emailContent) {
  try {
    // Helper function to extract fields using regex
    const extractField = (pattern, text, defaultValue = null) => {
      const match = text.match(pattern);
      if (match) {
        console.log(`Match for pattern ${pattern}:`, match[1].trim()); // Log matched data
        return match[1].trim();
      }
      return defaultValue; // Return default value if no match found
    };

    // Extracting individual fields from the email content
    const appointmentNo = extractField(
      /Appointment ID\s*\*?(\d+)\*?/i,
      emailContent
    );
    const name = extractField(/Customer Name\s*\*([^*]+)\*/i, emailContent);
    const mobileno = extractField(
      /Customer Contact\s*\*(\d{10})\*/i,
      emailContent
    );
    const insuranceName = extractField(
      /Corporate Name\s*\*([\w\s]+)\*/i,
      emailContent
    );
    let address = extractField(
      /Customer Address\s*\*([\s\S]+?)\*/i,
      emailContent
    );

    // Extract the pincode from the address
    const pincodeMatch = address ? address.match(/\b\d{6}\b/) : null;
    const pincode = pincodeMatch ? pincodeMatch[0] : null;

    const formattedAddress = address
      ? address
          .replace(/\n/g, " ")
          .replace(/\b\d{6}\b/, "")
          .trim() // Remove pincode from address
      : null;

    const dob = extractField(
      /Date of Birth\s*\*([\d\-a-zA-Z]+)\*/i,
      emailContent
    );
    const packageName = extractField(
      /PackageName\s*\*([\s\S]+?)\*/i,
      emailContent
    );
    const formattedPackageName = packageName.replace(/\n/g, " ").trim();
    const appointmentDate = extractField(
      /Date of Appointment\s*\*([\d\-a-zA-Z]+)\*/i,
      emailContent
    );
    const appointmentTime = extractField(
      /Appointment Time\s*\*([\d:APM\- ]+)\*/i,
      emailContent
    );

    const time =
      appointmentDate && appointmentTime
        ? `${appointmentDate} ${appointmentTime}`
        : null;

    let testDetailsStart =
      emailContent.indexOf("*Test Details*") + "*Test Details*".length;
    let testDetails = emailContent.slice(testDetailsStart).trim();

    // Clean up extra characters or unwanted lines
    let formattedTestDetails = testDetails
      .split("\n")
      .filter((item) => item.trim().length > 0) // Remove empty lines
      .map((item) => item.trim()) // Trim each line
      .join(", "); // Join with commas

    let cleanedTestDetails = formattedTestDetails
      .replace(/(\*Please find below SPOC details.*|Please note:.*)/gs, "")
      .trim();

    // Log the parsed data for verification before insertion
    console.log("Parsed Email Data Before Insert:", {
      appointmentNo,
      name,
      mobileno,
      insuranceName,
      formattedAddress,
      pincode,
      dob,
      formattedPackageName,
      time,
      cleanedTestDetails,
    });

    const formattedDob = dob ? new Date(dob).toISOString().split("T")[0] : null; // Date format YYYY-MM-DD

    // Insert data into the database
    const query = `
      INSERT INTO appointment 
      (appointment_no, name, mobileno, insurance_name, address, pincode, dob, package_name, time, treatment) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      appointmentNo,
      name,
      mobileno,
      insuranceName,
      formattedAddress,
      pincode,
      formattedDob, // Use formatted dob
      formattedPackageName,
      time,
      cleanedTestDetails,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting data into the database:", err.message);
        throw new Error("Database insertion failed");
      } else {
        console.log("Data inserted successfully!", result);
      }
    });
  } catch (error) {
    console.error("Error parsing new email content:", error.message);
  }
}

// Read emails and process them
function readNewEmails8() {
  const imap = new Imap(imapConfig);

  imap.once("ready", () => {
    imap.openBox("INBOX", false, (err, box) => {
      if (err) throw err;

      imap.search(["UNSEEN"], (err, results) => {
        if (err || results.length === 0) {
          console.log("No new emails found.");
          imap.end();
          return;
        }

        const fetch = imap.fetch(results, { bodies: "" });
        fetch.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error("Error parsing email:", err.message);
                return;
              }

              const emailContent = parsed.text;
              console.log("Processing new email content:\n", emailContent);

              // Parse and insert the new email content into the database
              await parseAndInsertNewEmail8(emailContent);
            });
          });
        });

        fetch.once("end", () => {
          console.log("Done fetching all unseen emails.");
          imap.end();
        });
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP Error:", err);
  });

  imap.once("end", () => {
    console.log("Connection closed.");
  });

  imap.connect();
}

// Start reading the new emails
// readNewEmails8();

//Email Pattern no 9

async function parseAndInsert9Email(emailContent) {
  try {
    // Helper function to extract fields with regex
    const extractField = (pattern, text, defaultValue = null) => {
      const match = text.match(pattern);
      return match ? match[1].trim() : defaultValue;
    };

    // Extracting individual fields from the email content
    const tpaDetails = extractField(/sales number\s*:\s*(\d+)/i, emailContent);
    const name = extractField(
      /\*?Customer Full Name:\*?\s*([\w\s.-]+)/i,
      emailContent
    );

    const appointmentNo = extractField(
      /\*?application Number:\*?\s*(\d+)/i,
      emailContent
    );
    const mobileno = extractField(/\b(\d{10})\b/, emailContent);
    const time = extractField(
      /\*?Appointment date & time:\*?\s*([\d-]+\s[\d:]+\s[APM]+)/i,
      emailContent
    );

    // Extracting address details
    const addressDetails = emailContent.match(
      /HOME Visit Address\s*\*?\s*([\s\S]+?),\s*([\w\s]+),\s*([\w\s]+)\s*[-.,\s]*\s*(\d{6})/i
    );
    const parsedAddress = addressDetails
      ? addressDetails[1].trim().replace(/\n/g, " ")
      : null;
    const city = addressDetails ? addressDetails[2].trim() : null;
    const state = addressDetails ? addressDetails[3].trim() : null;
    const pincode = addressDetails ? addressDetails[4] : null;

    const treatmentPattern = /\*Medicals\*\n\n([\s\S]*?)\n\n\*/;
    const treatmentMatch = emailContent.match(treatmentPattern);
    let treatment = treatmentMatch ? treatmentMatch[1].trim() : null;

    // Remove newlines and extra spaces to create a single-line string
    if (treatment) {
      treatment = treatment.replace(/\n+/g, " ").replace(/\s+/g, " ");
    }

    // Log the parsed data for verification
    console.log("Parsed Email Data Before Insert:");
    console.log({
      tpaDetails,
      name,
      appointmentNo,
      mobileno,
      time,
      address: parsedAddress,
      country: "India",
      state,
      city,
      pincode,
      treatment,
    });

    // Insert data into the database
    db.query(
      "INSERT INTO appointment (tpa_details, name, appointment_no, mobileno, time, address, country, state, city, pincode, treatment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        tpaDetails,
        name,
        appointmentNo,
        mobileno,
        time,
        parsedAddress,
        "India",
        state,
        city,
        pincode,
        treatment, // Storing only the relevant treatment details
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting data into the database:", err.message);
        } else {
          console.log("Data inserted successfully!", result);
        }
      }
    );
  } catch (error) {
    console.error("Error parsing email content:", error.message);
  }
}

// Read emails and process them
function readEmails9() {
  const imap = new Imap(imapConfig);

  imap.once("ready", () => {
    imap.openBox("INBOX", false, (err, box) => {
      if (err) throw err;

      imap.search(["UNSEEN"], (err, results) => {
        if (err || results.length === 0) {
          console.log("No new emails found.");
          imap.end();
          return;
        }

        const fetch = imap.fetch(results, { bodies: "" });
        fetch.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error("Error parsing email:", err.message);
                return;
              }

              const emailContent = parsed.text;
              console.log("Processing email content:\n", emailContent);

              // Parse and insert the email content into the database
              await parseAndInsert9Email(emailContent);
            });
          });
        });

        fetch.once("end", () => {
          console.log("Done fetching all unseen emails.");
          imap.end();
        });
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP Error:", err);
  });

  imap.once("end", () => {
    console.log("Connection closed.");
  });

  imap.connect();
}

// Start reading emails
// readEmails9();

// Email Pattern No 10
// Function to parse and insert email content into the database
async function parseAndInsertEmail10(emailContent) {
  try {
    // Helper function to extract fields using regex
    const extractField = (pattern, text, defaultValue = null) => {
      const match = text.match(pattern);
      return match ? match[1].trim() : defaultValue;
    };

    // Extracting fields from the email content
    const tpaDetails = extractField(/sales number\s*:\s*(\d+)/i, emailContent);

    // Extracting Customer Name
    const name = extractField(
      /\*Customer Name\*\s*([a-zA-Z\s.-]+)/i, // Regex for Customer Name
      emailContent
    );

    // Extracting Application ID as appointment_no
    const appointmentNo = extractField(
      /Application ID\s*[:*]\s*(\w+)/i, // Regex for Application ID
      emailContent
    );

    // Extracting 10-digit mobile number
    const mobileno = extractField(/\b(\d{10})\b/, emailContent);

    // Extracting Date of Appointment
    const dateOfAppointment = extractField(
      /Date Of Appointment\s*[:*]\s*([\d/]+)/i,
      emailContent
    );

    // Extracting Time of Appointment
    const timeOfAppointment = extractField(
      /Time Of Appointment\s*[:*]\s*([\d:]+\s*[APM]*)/i,
      emailContent
    );

    // Combining Date and Time
    const time =
      dateOfAppointment && timeOfAppointment
        ? `${dateOfAppointment} ${timeOfAppointment}`
        : null;

    const addressDetails = emailContent.match(
      /\*Customer Address\*\s*([a-zA-Z0-9\s,.-]+)\s*([\w\s]+)\s*([\w\s]+)\s*(\d{6})/i
    );

    // Parsing address, city, state, and pincode
    const parsedAddress = addressDetails
      ? addressDetails[1].trim().replace(/\n/g, " ")
      : null;
    const city = addressDetails ? addressDetails[2].trim() : null;
    const state = addressDetails ? addressDetails[3].trim() : null;
    const pincode = addressDetails ? addressDetails[4] : null;

    const packagePattern =
      /- \*Package Name: ([\s\S]*?)\*[\s\S]*?Tests Included: ([\s\S]*?)(?=\n\n|$)/g;
    let packageInfo = "";
    let match;

    while ((match = packagePattern.exec(emailContent)) !== null) {
      const packageName = match[1].trim();
      const testsIncluded = match[2]
        .trim()
        .replace(/\n+/g, ", ") // Replace newlines with commas
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .replace(/,\s*$/, ""); // Remove trailing comma if any

      packageInfo += `- *Package Name: ${packageName}*\n        Tests Included: ${testsIncluded},\n\n`;
    }

    // Now, set the treatment field to only include the package details
    let treatment = packageInfo.trim(); // Removing any extra spaces or newlines

    // Log or save the updated treatment field
    console.log(treatment);

    // Example of how you would update the database
    const updatedData = {
      treatment: treatment, // Updated treatment field with package details only
    };

    // Logging parsed data for debugging
    console.log("Parsed Email Data:");
    console.log({
      tpaDetails,
      name,
      appointmentNo,
      mobileno,
      time, // Combined date and time will be here
      address: parsedAddress,
      country: "India",
      state,
      city,
      pincode,
      treatment,
    });

    // Insert data into the database
    db.query(
      "INSERT INTO appointment (tpa_details, name, appointment_no, mobileno, time, address, country, state, city, pincode, treatment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        tpaDetails,
        name,
        appointmentNo,
        mobileno,
        time, // Insert the combined date and time into the database
        parsedAddress,
        "India",
        state,
        city,
        pincode,
        treatment,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting data into the database:", err.message);
        } else {
          console.log("Data inserted successfully:", result);
        }
      }
    );
  } catch (error) {
    console.error("Error parsing email content:", error.message);
  }
}

// Function to read emails and process them
function readEmails10() {
  const imap = new Imap(imapConfig);

  imap.once("ready", () => {
    imap.openBox("INBOX", false, (err, box) => {
      if (err) {
        console.error("Error opening inbox:", err.message);
        return;
      }

      imap.search(["UNSEEN"], (err, results) => {
        if (err || results.length === 0) {
          console.log("No new emails found.");
          imap.end();
          return;
        }

        const fetch = imap.fetch(results, { bodies: "" });
        fetch.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error("Error parsing email:", err.message);
                return;
              }

              const emailContent = parsed.text;
              console.log("Processing email content:\n", emailContent);

              // Parse and insert the email content into the database
              await parseAndInsertEmail10(emailContent);
            });
          });
        });

        fetch.once("end", () => {
          console.log("Done fetching all unseen emails.");
          imap.end();
        });
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP Error:", err.message);
  });

  imap.once("end", () => {
    console.log("Connection closed.");
  });

  imap.connect();
}

// Start reading emails
// readEmails10();

// Email Pattern No 11
// Function to parse and insert email content into the database
async function parseAndInsertEmail11(emailContent, emailSubject) {
  try {
    // Helper function to extract fields using regex
    const extractField = (pattern, text, defaultValue = null) => {
      const match = text.match(pattern);
      return match ? match[1].trim() : defaultValue;
    };

    // Extracting proposal number from the email subject
    const appointmentNo = extractField(
      /Proposal No[:\s]*([\w\d]+)/i, // Regex for Proposal No
      emailSubject
    );

    // Extracting tpaDetails (Test Location)
    const tpaDetails = extractField(
      /Test Location\s*:\s*([^\n]+)/i,
      emailContent
    );

    // Extracting the full address
    const addressMatch = emailContent.match(
      /Test Location\s*:\s*[^\n]+\n([\s\S]+?),\s*IND/i
    );
    const address = addressMatch
      ? addressMatch[1].replace(/\n/g, ", ").trim()
      : null;

    // Extracting city, state, and pincode directly from the address
    const addressDetails = emailContent.match(
      /Test Location\s*:[^\n]+\n[\s\S]+,\s*([a-zA-Z\s]+),\s*([a-zA-Z\s]+),\s*(\d{6})/i
    );

    const city = addressDetails ? addressDetails[1].trim() : null;
    const state = addressDetails ? addressDetails[2].trim() : null;
    const pincode = addressDetails ? addressDetails[3].trim() : null;

    // Extracting name
    const firstName = extractField(
      /First Name\s*:\s*([a-zA-Z\s]+?)(?=\s*Middle Name)/i,
      emailContent
    );
    const name = firstName || "Unknown";

    // Extracting mobile number
    const mobileno = extractField(/\b(\d{10})\b/, emailContent);

    // Extracting Date and Time of Appointment
    const dateOfAppointment = extractField(
      /Appointment scheduled date\s*:\s*([\d/]+)/i,
      emailContent
    );
    const timeOfAppointment = extractField(
      /Appointment scheduled time\s*:\s*([\d:]+\s*[APM]*)/i,
      emailContent
    );
    const time =
      dateOfAppointment && timeOfAppointment
        ? `${dateOfAppointment} ${timeOfAppointment}`
        : null;

    const treatmentPattern = /Reports Required\s*:\s*([\s\S]+?)(?=\n\*)/i; // Captures up to the next "*"
    const treatmentMatch = emailContent.match(treatmentPattern);

    const treatment = treatmentMatch
      ? treatmentMatch[1].trim().replace(/\n/g, ", ").replace(/\s+/g, " ")
      : "";

    console.log("Parsed Email Data:");
    console.log({
      tpaDetails,
      name,
      appointmentNo,
      mobileno,
      time,
      address,
      country: "India",
      state,
      city,
      pincode,
      treatment,
    });

    // Insert data into the database
    db.query(
      "INSERT INTO appointment (tpa_details, name, appointment_no, mobileno, time, address, country, state, city, pincode, treatment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        tpaDetails,
        name,
        appointmentNo,
        mobileno,
        time,
        address,
        "India",
        state,
        city,
        pincode,
        treatment,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting data into the database:", err.message);
        } else {
          console.log("Data inserted successfully:", result);
        }
      }
    );
  } catch (error) {
    console.error("Error parsing email content:", error.message);
  }
}

// Function to read emails and process them
function readEmails11() {
  const imap = new Imap(imapConfig);

  imap.once("ready", () => {
    imap.openBox("INBOX", false, (err, box) => {
      if (err) {
        console.error("Error opening inbox:", err.message);
        return;
      }

      imap.search(["UNSEEN"], (err, results) => {
        if (err || results.length === 0) {
          console.log("No new emails found.");
          imap.end();
          return;
        }

        const fetch = imap.fetch(results, { bodies: "" });
        fetch.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error("Error parsing email:", err.message);
                return;
              }

              // Accessing email content and subject
              const emailContent = parsed.text;
              const subject = parsed.subject;

              console.log("Processing email content:\n", emailContent);
              console.log("Subject:", subject);

              // Parse and insert the email content and subject into the database
              await parseAndInsertEmail11(emailContent, subject);
            });
          });
        });

        fetch.once("end", () => {
          console.log("Done fetching all unseen emails.");
          imap.end();
        });
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP Error:", err.message);
  });

  imap.once("end", () => {
    console.log("Connection closed.");
  });

  imap.connect();
}

// Start reading emails
readEmails11();
