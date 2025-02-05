// Code by Prajwal Punekar

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useEffect, useState } from "react";
import Navbar from "../navBar";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from "@mui/material";
import { Link } from "react-router-dom";

function Laboratory() {
  const [appointment, setAppointmentList] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false); // Track showing details
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Track delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [pincode, setPincode] = useState(""); // Track the search query

  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const getAppointmentList = async () => {
      const res = await fetch("http://103.165.118.71:8085/getAllLaboratories");
      const getData = await res.json();
      setAppointmentList(getData);
      setFilteredAppointments(getData);
    };
    getAppointmentList();
  }, []);

  useEffect(() => {
    // Ensure modal initializes correctly
    const modal = document.getElementById("viewAppointmentModal");
    if (modal) {
      const modalInstance = new window.bootstrap.Modal(modal);
      modal.addEventListener("hidden.bs.modal", () => {
        setSelectedAppointment(null); // Clear selected data
      });
    }
  }, []);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    const modal = document.getElementById("viewAppointmentModal");
    if (modal) {
      const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modal);
      modalInstance.show();
    }
  };

  const handleDownloadExcel = () => {
    window.open("http://103.165.118.71:8085/downloadAppointments", "_blank");
  };

  const handleImageClick = () => {
    setShowAppointmentDetails(true);
  };

  const handleCloseModal = () => {
    setShowAppointmentDetails(false);
  };

  // Function to handle pincode input change
  const handlePincodeChange = (event) => {
    setPincode(event.target.value);
  };

  const fetchAppointmentsByPincode = async () => {
    if (pincode) {
      const res = await fetch(
        `http://103.165.118.71:8085/getcentrebypincode?pincode=${pincode}`
      );
      const data = await res.json();
      setFilteredAppointments(data);
    }
  };

  // Pagination logic
  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Handle page change
  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  // Handle Delete Confirmation
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Confirm Deletion
  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `http://103.165.118.71:8085/deleteLaboratory/${deleteId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setAppointmentList((prev) =>
          prev.filter((item) => item.lab_id !== deleteId)
        );
        setShowDeleteModal(false);
        setDeleteId(null);
        console.log("Laboratory deleted successfully");
      } else {
        console.error("Failed to delete assistant");
      }
    } catch (error) {
      console.error("Error deleting assistant:", error);
    }
  };

  // Cancel Deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div>
      <div class="main-wrapper">
        <Navbar />

        <div class="page-wrapper">
          <div class="content">
            <div class="page-header">
              <div class="row">
                <div class="col-sm-12">
                  <ul class="breadcrumb">
                    <li class="breadcrumb-item">
                      <Link to="/diagnosticreport">Centres</Link>
                    </li>
                    <li class="breadcrumb-item">
                      <i class="feather-chevron-right"></i>
                    </li>
                    <li class="breadcrumb-item active">
                      Diagnostic Centre List
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12">
                <div class="card card-table show-entire">
                  <div class="card-body">
                    <div class="page-table-header mb-2">
                      <div class="row align-items-center">
                        <div class="col">
                          <div class="doctor-table-blk">
                            <h3>Diagnoastic Centre Report</h3>
                            <div class="doctor-search-blk">
                              <div class="top-nav-search table-search-blk">
                                <form>
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Enter Pincode"
                                    value={pincode}
                                    onChange={handlePincodeChange}
                                  />
                                  <a class="btn">
                                    <img
                                      src="assets/img/icons/search-normal.svg"
                                      alt=""
                                    />
                                  </a>
                                </form>
                              </div>
                              <div class="add-group">
                                <a
                                  //   href="add-appointment.html"
                                  onClick={fetchAppointmentsByPincode}
                                  class="btn btn-primary add-pluss ms-2"
                                >
                                  Search
                                </a>
                                <a
                                  // href="javascript:;"
                                  class="btn btn-primary doctor-refresh ms-2"
                                  onClick={() => window.location.reload()}
                                >
                                  <img
                                    src="assets/img/icons/re-fresh.svg"
                                    alt=""
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div class="col-auto text-end float-end ms-auto download-grp">
                          <a href="javascript:;" class=" me-2">
                            <img
                              src="assets/img/icons/pdf-icon-01.svg"
                              alt=""
                            />
                          </a>
                          <a href="javascript:;" class=" me-2">
                            <img
                              src="assets/img/icons/pdf-icon-02.svg"
                              alt=""
                            />
                          </a>
                          <a href="javascript:;" class=" me-2">
                            <img
                              src="assets/img/icons/pdf-icon-03.svg"
                              alt=""
                            />
                          </a>

                          <div>
                          
                            <a onClick={handleImageClick}>
                              <img
                                src="assets/img/icons/pdf-icon-04.svg"
                                alt="View Appointments"
                              />
                            </a>

                          
                            <Dialog
                              open={showAppointmentDetails}
                              onClose={handleCloseModal}
                              maxWidth="md"
                              fullWidth
                            >
                              <DialogTitle
                                sx={{
                                  backgroundColor: "#2E37A4",
                                  color: "white",
                                  fontWeight: "bold",
                                  padding: "16px",
                                }}
                              >
                                <Typography variant="h6">Centres</Typography>
                              </DialogTitle>

                              <DialogContent sx={{ padding: "16px" }}>
                               
                                <Table>
                                  <TableHead
                                    sx={{ backgroundColor: "#f4f6f9" }}
                                  >
                                    <TableRow>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Title
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Country
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        State
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        City
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Pincode
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Address
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Name
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Mobile No
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Email
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Username
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Password
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Client Name
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Client Email
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Client Address
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {appointment.map((appointment) => (
                                      <TableRow key={appointment.id}>
                                        <TableCell>
                                          {appointment.title}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.country}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.state}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.city}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.pincode}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.address}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.name}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.mobileno}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.email}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.username}
                                          <TableCell>
                                            {appointment.password}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.client_name}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.client_email}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.client_address}
                                          </TableCell>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </DialogContent>
                              <DialogActions sx={{ padding: "16px" }}>
                               
                                <Button
                                  onClick={handleDownloadExcel}
                                  color="primary"
                                  variant="contained"
                                >
                                  Download Excel
                                </Button>
                               
                                <Button
                                  onClick={handleCloseModal}
                                  color="secondary"
                                  variant="outlined"
                                >
                                  Close
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </div>
                        </div> */}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "10px",
                      }}
                    >
                      {/* <Link
                        to="/addLaboratory"
                        style={{ textDecoration: "none" }}
                      >
                        <Button variant="contained" color="primary">
                          Add Centre
                        </Button>
                      </Link> */}
                    </div>

                    <div class="table-responsive">
                      <table
                        className="table table-bordered custom-table comman-table datatable mb-0"
                        style={{
                          borderCollapse: "collapse",
                          width: "100%",
                          borderRadius: "8px", // Adding border radius to make it rounder
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Adding subtle shadow for depth
                        }}
                      >
                        <thead
                          style={{
                            backgroundColor: "#f4f6f9",
                            borderBottom: "2px solid #ddd",
                            borderTopLeftRadius: "8px", // Round the top-left corner
                            borderTopRightRadius: "8px", // Round the top-right corner
                          }}
                        >
                          <tr style={{ textAlign: "left" }}>
                            <th
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Sr.No
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Title
                            </th>
                            {/* <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Country
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              State
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              City
                            </th> */}

                            {/* <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Address
                            </th> */}
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Name
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Mobile No
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Email
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Pincode
                            </th>
                            {/* <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Username
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Password
                            </th> */}
                            {/* <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Clinet Name
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Client Email
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Client Address
                            </th> */}
                            <th
                              style={{
                                fontWeight: "bold",
                                textAlign: "center",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentAppointments.map((getcate, index) => (
                            <tr
                              key={getcate.id}
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                                borderBottom: "1px solid #ddd", // Adds border between rows
                              }}
                            >
                              <td
                                style={{
                                  textAlign: "center",
                                  padding: "12px 15px",
                                }}
                              >
                                {indexOfFirstAppointment + index + 1}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.title}
                              </td>
                              {/* <td style={{ padding: "12px 15px" }}>
                                {getcate.country}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.state}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.city}
                              </td> */}

                              {/* <td style={{ padding: "12px 15px" }}>
                                {getcate.address}
                              </td> */}
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.name}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.mobileno}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.email}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.pincode}
                              </td>
                              {/* <td style={{ padding: "12px 15px" }}>
                                {getcate.username}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.password}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.client_name}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.client_email}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.client_address}
                              </td> */}
                              <td
                                className="text-center"
                                style={{
                                  padding: "12px 15px",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <div className="dropdown dropdown-action">
                                  <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{
                                      fontSize: "16px",
                                      color: "#333",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <a
                                      className="dropdown-item"
                                      onClick={() => handleViewDetails(getcate)}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <VisibilityIcon
                                        style={{ marginRight: "8px" }}
                                      />
                                      View
                                    </a>
                                    <Link
                                      to={`/edit-laboratory/${getcate.lab_id}`}
                                      className="dropdown-item"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                    >
                                      <EditIcon
                                        style={{ marginRight: "8px" }}
                                      />
                                      Edit
                                    </Link>

                                    <a
                                      className="dropdown-item"
                                      // href="#"
                                      // data-bs-toggle="modal"
                                      // data-bs-target="#delete_patient"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                      onClick={() =>
                                        handleDeleteClick(getcate.lab_id)
                                      }
                                    >
                                      <DeleteIcon
                                        style={{ marginRight: "8px" }}
                                      />
                                      Delete
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Pagination Component */}
                      <div
                        className="pagination-container"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textAlign: "center",
                          marginTop: "20px",
                          padding: "10px",
                        }}
                      >
                        {/* Entry Range Display */}
                        <div
                          className="entry-range"
                          style={{ fontSize: "14px", color: "#555" }}
                        >
                          {filteredAppointments.length === 0
                            ? "No entries"
                            : `${indexOfFirstAppointment + 1} - ${Math.min(
                                indexOfLastAppointment,
                                filteredAppointments.length
                              )} of ${filteredAppointments.length} entries`}
                        </div>

                        {/* Pagination Component */}
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={paginate}
                          color="primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <Dialog open={showDeleteModal} onClose={cancelDelete}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this Assistant?
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete} color="secondary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <div class="notification-box">
            <div class="msg-sidebar notifications msg-noti">
              <div class="topnav-dropdown-header">
                <span>Messages</span>
              </div>
              <div class="drop-scroll msg-list-scroll" id="msg_list">
                <ul class="list-box">
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">R</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author">Richard Miles </span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item new-message">
                        <div class="list-left">
                          <span class="avatar">J</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author">John Doe</span>
                          <span class="message-time">1 Aug</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">T</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author"> Tarah Shropshire </span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">M</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author">Mike Litorus</span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">C</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author">
                            {" "}
                            Catherine Manseau{" "}
                          </span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">D</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author"> Domenic Houston </span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">B</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author"> Buster Wigton </span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">R</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author"> Rolland Webber </span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">C</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author"> Claire Mapes </span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">M</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author">Melita Faucher</span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">J</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author">Jeffery Lalor</span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">L</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author">Loren Gatlin</span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="chat.html">
                      <div class="list-item">
                        <div class="list-left">
                          <span class="avatar">T</span>
                        </div>
                        <div class="list-body">
                          <span class="message-author">Tarah Shropshire</span>
                          <span class="message-time">12:28 AM</span>
                          <div class="clearfix"></div>
                          <span class="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="topnav-dropdown-footer">
                <a href="chat.html">See all messages</a>
              </div>
            </div>
          </div>
          <footer
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#f1f1f1",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            © {new Date().getFullYear()}{" "}
            <a
              href="https://sitsolutions.co.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              S IT Solutions Pvt. Ltd.
            </a>{" "}
            All Rights Reserved.
          </footer>
        </div>
        <div id="delete_patient" class="modal fade delete-modal" role="dialog">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-body text-center">
                <img src="assets/img/sent.png" alt="" width="50" height="46" />
                <h3>Are you sure want to delete this ?</h3>
                <div class="m-t-20">
                  {" "}
                  <a href="#" class="btn btn-white" data-bs-dismiss="modal">
                    Close
                  </a>
                  <button type="submit" class="btn btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Viewing Appointment Details */}
        <div
          className="modal fade"
          id="viewAppointmentModal"
          tabIndex="-1"
          aria-labelledby="viewAppointmentModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            style={{
              maxWidth: "700px",
            }}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                border: "none",
              }}
            >
              {/* Header */}
              <div
                className="modal-header"
                style={{
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                  color: "#fff",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  padding: "15px 20px",
                }}
              >
                <h5
                  className="modal-title fw-bold"
                  style={{
                    fontSize: "1.5rem",
                  }}
                >
                  <i className="fa-solid fa-calendar-check me-2"></i>
                  laboratories Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              {/* Body */}
              <div
                className="modal-body"
                style={{
                  padding: "30px 25px",
                  fontSize: "1rem",
                  backgroundColor: "#fafbfc",
                }}
              >
                {selectedAppointment ? (
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>laboratory No:</strong>{" "}
                          {selectedAppointment.lab_id}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Title:</strong> {selectedAppointment.title}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Country:</strong>{" "}
                          {selectedAppointment.country}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>State:</strong> {selectedAppointment.state}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>City:</strong> {selectedAppointment.city}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Pincode:</strong>{" "}
                          {selectedAppointment.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Address:</strong>{" "}
                          {selectedAppointment.address}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Name:</strong> {selectedAppointment.address}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Mobile No:</strong>{" "}
                          {selectedAppointment.mobileno}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Email:</strong> {selectedAppointment.email}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Username:</strong>{" "}
                          {selectedAppointment.username}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Password:</strong>{" "}
                          {selectedAppointment.password}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Clinet Name:</strong>{" "}
                          {selectedAppointment.client_name}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>client Email:</strong>{" "}
                          {selectedAppointment.password}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Client Address:</strong>{" "}
                          {selectedAppointment.password}
                        </p>
                      </div>
                    </div>
                    {/* <div className="col-md-12 text-end mt-4">
                      <Link
                        to="/ReplyAppointment"
                        state={{ appointment: selectedAppointment }}
                        style={{
                          padding: "10px 20px",
                          fontSize: "1rem",
                          backgroundColor: "#4e73df",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          textDecoration: "none",
                        }}
                      >
                        Reply
                      </Link>
                    </div> */}
                  </div>
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#6c757d",
                      fontSize: "1.1rem",
                    }}
                  >
                    No details available.
                  </p>
                )}
              </div>

              {/* Footer */}
              <div
                className="modal-footer"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  backgroundColor: "#f8f9fa",
                  borderTop: "1px solid #e9ecef",
                  padding: "15px 20px",
                }}
              >
                {/* <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleViewDetails(selectedAppointment)}
                >
                  Take Action
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Laboratory;
