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
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query

  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const getAppointmentList = async () => {
      const res = await fetch("http://localhost:3005/getAllSubadmin");
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
    window.open("http://localhost:3005/downloadAppointments", "_blank");
  };

  const handleImageClick = () => {
    setShowAppointmentDetails(true);
  };

  const handleCloseModal = () => {
    setShowAppointmentDetails(false);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter appointments based on search query
    const filtered = appointment.filter((appointment) => {
      return (
        appointment.name.toLowerCase().includes(query) ||
        appointment.mname.toLowerCase().includes(query) ||
        appointment.lname.toLowerCase().includes(query) ||
        appointment.country.toLowerCase().includes(query) ||
        appointment.state.toLowerCase().includes(query) ||
        appointment.city.toLowerCase().includes(query) ||
        appointment.pincode.toLowerCase().includes(query) ||
        appointment.address.toLowerCase().includes(query) ||
        appointment.state.toLowerCase().includes(query) ||
        appointment.mobileno.toLowerCase().includes(query) ||
        appointment.email.toLowerCase().includes(query) ||
        appointment.username.toLowerCase().includes(query)
      );
    });

    setFilteredAppointments(filtered);
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
        `http://localhost:3005/deleteSubadmin/${deleteId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setAppointmentList((prev) =>
          prev.filter((item) => item.subadmin_id !== deleteId)
        );
        setShowDeleteModal(false);
        setDeleteId(null);
        console.log("Subadmin deleted successfully");
        window.location.reload();
      } else {
        console.error("Failed to delete subadmin");
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
                      <Link to="/subadmin">Sub-Admin</Link>
                    </li>
                    <li class="breadcrumb-item">
                      <i class="feather-chevron-right"></i>
                    </li>
                    <li class="breadcrumb-item active">Sub-Admin List</li>
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
                        <div
                          class="col"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div class="doctor-table-blk">
                            <h3>Sub-Admin</h3>
                            <div class="doctor-search-blk">
                              <div class="top-nav-search table-search-blk">
                                <form>
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Search here"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
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
                                <Link
                                  to="/addSubadmin"
                                  style={{ textDecoration: "none" }}
                                  class="btn btn-primary add-pluss ms-2"
                                >
                                  <img src="assets/img/icons/plus.svg" alt="" />
                                </Link>
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
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              padding: "10px",
                            }}
                          >
                            <Link
                              to="/addSubadmin"
                              style={{ textDecoration: "none" }}
                            >
                              <Button variant="contained" color="primary">
                                Add Sub-Admin
                              </Button>
                            </Link>
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
                                <Typography variant="h6">Subadmin</Typography>
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
                                        First Name
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Middle Name
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Last Name
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
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {appointment.map((appointment) => (
                                      <TableRow key={appointment.id}>
                                        <TableCell>
                                          {appointment.name}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.mname}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.lname}
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
                              First Name
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Middle Name
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Last Name
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
                                {getcate.name}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.mname}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.lname}
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
                                      to={`/edit-subadmin/${getcate.subadmin_id}`}
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
                                        handleDeleteClick(getcate.subadmin_id)
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
              Are you sure you want to delete this Subadmin?
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
                  Sudadmin Details
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
                          {selectedAppointment.subadmin_id}
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
                          <strong>First Name:</strong>{" "}
                          {selectedAppointment.name}
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
                          <strong>Middle name:</strong>{" "}
                          {selectedAppointment.mname}
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
                          <strong>Last Name:</strong>{" "}
                          {selectedAppointment.lname}
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
