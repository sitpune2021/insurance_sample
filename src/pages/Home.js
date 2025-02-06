// Code by Prajwal Punekar

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navBar";

function Home() {
  const [appointments, setAppointments] = useState([]);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [laboratoryCount, setLaboratoryCount] = useState(0);
  const [assignedAppointmentCount, setAssignedAppointmentCount] = useState(0);
  const [completedAppointmentCount, setCompletedAppointmentCount] = useState(0);
  const [unassignedAppointmentCount, setUnAssignedAppointmentCount] =
    useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/gettodayappointmentdashboard",
          { withCredentials: true }
        );
        setAppointments(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    const fetchAppointmentCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/getAppointmentCount",
          { withCredentials: true }
        );
        setAppointmentCount(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    const fetchLaboratoryCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/getLaboratoriesCount",
          { withCredentials: true }
        );
        setLaboratoryCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    const fetchAssignedAppintmentCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/getAssignedAppointmentCount",
          { withCredentials: true }
        );
        setAssignedAppointmentCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    const fetchUnAssignedAppintmentCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/getUnassignedAppointmentCount",
          { withCredentials: true }
        );
        setUnAssignedAppointmentCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    const fetchUnCompletedAppintmentCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/getcompletedAppointmentCount",
          { withCredentials: true }
        );
        setCompletedAppointmentCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    fetchAppointments();
    fetchAppointmentCount();
    fetchLaboratoryCount();
    fetchAssignedAppintmentCount();
    fetchUnAssignedAppintmentCount();
    fetchUnCompletedAppintmentCount();
  }, []);

  return (
    <div>
      <div className="main-wrapper">
        <Navbar />

        <div className="page-wrapper">
          <div className="content">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/Dashboard">Dashboard </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right"></i>
                    </li>
                    <li className="breadcrumb-item active">Admin Dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="good-morning-blk">
              <div className="row">
                <div className="col-md-6">
                  <div className="morning-user">
                    <h2>
                      Good Morning, <span>Admin</span>
                    </h2>
                    <p>Have a nice day at work</p>
                  </div>
                </div>
                <div className="col-md-6 position-blk">
                  <div className="morning-img">
                    <img src="assets/img/morning-img-01.png" alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/Appointment">
                  <div className="dash-widget">
                    <div className="dash-boxs comman-flex-center">
                      <img src="assets/img/icons/calendar.svg" alt="" />
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Appointments</h4>
                      <h2>
                        <span className="counter-up">{appointmentCount}</span>
                      </h2>
                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>40%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/assignedappointments/1">
                  <div className="dash-widget">
                    <div className="dash-boxs comman-flex-center">
                      <img src="assets/img/icons/empty-wallet.svg" alt="" />
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Assigned Appointment</h4>
                      <h2>
                        <span className="counter-up">
                          {assignedAppointmentCount}
                        </span>
                      </h2>
                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>30%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/assignedappointments/2">
                  <div className="dash-widget">
                    <div className="dash-boxs comman-flex-center">
                      <img src="assets/img/icons/empty-wallet.svg" alt="" />
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Unassigned Appointment</h4>
                      <h2>
                        <span className="counter-up">
                          {unassignedAppointmentCount}
                        </span>
                      </h2>
                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>30%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/assignedappointments/3">
                  <div className="dash-widget">
                    <div className="dash-boxs comman-flex-center">
                      <img src="assets/img/icons/empty-wallet.svg" alt="" />
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Completed Appointment</h4>
                      <h2>
                        <span className="counter-up">
                          {completedAppointmentCount}
                        </span>
                      </h2>
                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>30%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/laboratory">
                  <div className="dash-widget">
                    <div className="dash-boxs comman-flex-center">
                      <img src="assets/img/icons/calendar.svg" alt="" />
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Diagnostic Centre</h4>
                      <h2>
                        <span className="counter-up">{laboratoryCount}</span>
                      </h2>
                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>40%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <div className="dash-widget">
                  <div className="dash-boxs comman-flex-center">
                    <img src="assets/img/icons/profile-add.svg" alt="" />
                  </div>
                  <div className="dash-content dash-count">
                    <h4>Captive Client</h4>
                    <h2>
                      <span className="counter-up">0</span>
                    </h2>
                    {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>20%
                      </span>{" "}
                      vs last month
                    </p> */}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <div className="dash-widget">
                  <div className="dash-boxs comman-flex-center">
                    <img src="assets/img/icons/scissor.svg" alt="" />
                  </div>
                  <div className="dash-content dash-count">
                    <h4>TPA Client</h4>
                    <h2>
                      <span className="counter-up">0</span>
                    </h2>
                    {/* <p>
                      <span className="negative-view">
                        <i className="feather-arrow-down-right me-1"></i>15%
                      </span>{" "}
                      vs last month
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-xl-12">
                <div className="card">
                  <div className="card-header pb-0">
                    <h4 className="card-title d-inline-block">
                      Today Appointments{" "}
                    </h4>{" "}
                    <Link
                      to="/TodayAppointment"
                      className="float-end patient-views"
                    >
                      Show all
                    </Link>
                  </div>
                  <div className="card-block table-dash">
                    <div className="table-responsive">
                      <table className="table mb-0 border-0 datatable custom-table">
                        <thead>
                          <tr>
                            <th>Sr.No</th>
                            <th>Appointment No</th>
                            <th>Patient Name</th>
                            <th>Mobile No</th>
                            <th>Date of Birth</th>
                            <th>Medical test Details</th>
                            {/* <th>Triage</th> */}
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((appointment, index) => (
                            <tr key={appointment.appointment_no}>
                              <td>
                                <h2>{index + 1}</h2>
                              </td>
                              <td>
                                <h2>{appointment.appointment_no}</h2>
                              </td>
                              <td>
                                <h2>{appointment.name}</h2>
                              </td>
                              <td>
                                <h2>{appointment.mobileno}</h2>
                              </td>
                              <td>
                                <h2>
                                  {new Date(appointment.time).toLocaleString(
                                    "en-US",
                                    {
                                      timeZone: "Asia/Kolkata",
                                    }
                                  )}
                                </h2>
                              </td>
                              <td>
                                <h2>{appointment.treatment}</h2>
                              </td>
                              {/* <td>
                                <button className="custom-badge status-green">
                                  Non Urgent
                                </button>
                              </td> */}
                              <td className="text-end">
                                <div className="dropdown dropdown-action">
                                  <Link
                                    to="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <Link
                                      className="dropdown-item"
                                      to="edit-patient.html"
                                    >
                                      <i className="fa-solid fa-pen-to-square m-r-5"></i>{" "}
                                      Edit
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete_appointment"
                                    >
                                      <i className="fa fa-trash-alt m-r-5"></i>{" "}
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
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
      </div>
      <div className="sidebar-overlay" data-reff=""></div>
    </div>
  );
}

export default Home;
