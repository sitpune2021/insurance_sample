import React from "react";
import Login from "./pages/Login_auth";
import Home from "./pages/Home";
import Appointment from "./pages/Appointment/Appointment";
import TodayAppointment from "./pages/Appointment/TodayAppointment";
import AddAppointment from "./pages/Appointment/AddAppointment";
import AppointmentReply from "./pages/Appointment/AppointmentReply";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventDetailsPage from "./pages/EvenetsDetailsPage";
import FullPageCalendar from "./pages/Calander";
import EditAppointment from "./pages/Appointment/EditAppointment";
import Laboratory from "./pages/Laboratory/Laboratory";
import AddLaboratory from "./pages/Laboratory/Addlaboratory";
import EditLaboratory from "./pages/Laboratory/EditLaboratory";
import SubAdmin from "./pages/SubAdminMaster/SubAdmin";
import AddSubadmin from "./pages/SubAdminMaster/AddSubAdmin";
import Editsubadmin from "./pages/SubAdminMaster/EditSubAdmin";
import Assistant from "./pages/Assistant/Assistant";
import AddAssistant from "./pages/Assistant/AddAssistant";
import EditAssistant from "./pages/Assistant/EditAssistant";
import LaboratoryDashboard from "./pages/LaboratoryDashboard/LaboratoryDashboard";
import SubAdminDashboard from "./pages/SubAdminMaster/SubAdmindashboard";
import AssignedAppointment from "./pages/Appointment/AssignedAppointment";
import AssignedAppointmentAssistant from "./pages/Assistant/AssignAppointmentAssistant";
import Role from "./pages/Role/Role";
import AddRole from "./pages/Role/AddRole";
import EditRole from "./pages/Role/EditRole";
import Permission from "./pages/Role/Permission";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import AppointmentReport from "./pages/Reports/AppointmentReport";
import DiagnosticReport from "./pages/Reports/DiagnosticReport";
import AssistantReport from "./pages/Reports/AssistantReport";
import AssignAppointmentToTechnician from "./pages/AssignAppointment/AssignAppontmenttoTechnician";
import SelectAppointment from "./pages/AssignAppointment/SelectAppointment";
import SelectAppointmentAssistant from "./pages/Assistant/SelectAppointment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/Dashboard" element={<Home />}></Route>
        <Route
          path="/LaboratoryDashboard"
          element={<LaboratoryDashboard />}
        ></Route>
        <Route
          path="/SubadminDashboard"
          element={<SubAdminDashboard />}
        ></Route>
        <Route path="/LaboratoryNavbar" element={<laboratoryNavbar />}></Route>
        <Route path="/Appointment" element={<Appointment />}></Route>
        <Route path="/TodayAppointment" element={<TodayAppointment />}></Route>
        <Route path="/addAppointment" element={<AddAppointment />}></Route>
        <Route path="/edit-appointment/:id" element={<EditAppointment />} />
        <Route path="/ReplyAppointment" element={<AppointmentReply />}></Route>
        <Route path="/calendar" element={<FullPageCalendar />} />
        <Route path="/events/:date" element={<EventDetailsPage />} />
        <Route path="/laboratory" element={<Laboratory />}></Route>
        <Route path="/addLaboratory" element={<AddLaboratory />}></Route>
        <Route path="/edit-laboratory/:id" element={<EditLaboratory />} />
        <Route path="/subadmin" element={<SubAdmin />}></Route>
        <Route path="/addSubadmin" element={<AddSubadmin />}></Route>
        <Route path="/edit-subadmin/:id" element={<Editsubadmin />} />
        <Route path="/assistant" element={<Assistant />}></Route>
        <Route path="/addassistant" element={<AddAssistant />}></Route>
        <Route path="/edit-assistant/:id" element={<EditAssistant />} />
        <Route
          path="/assignedappointments/:status"
          element={<AssignedAppointment />}
        />

        <Route path="/Role" element={<Role />}></Route>
        <Route path="/addRole" element={<AddRole />}></Route>
        <Route path="/edit-role/:id" element={<EditRole />} />
        <Route path="/Permission" element={<Permission />}></Route>
        <Route path="/Profile" element={<Profile />}></Route>
        <Route path="/edit-profile" element={<EditProfile />}></Route>
        <Route
          path="/appointmentreport"
          element={<AppointmentReport />}
        ></Route>
        <Route path="/diagnosticreport" element={<DiagnosticReport />}></Route>
        <Route path="/assistantreport" element={<AssistantReport />}></Route>
        <Route
          path="/AssignAppointmentToTechnician"
          element={<AssignAppointmentToTechnician />}
        ></Route>
        <Route
          path="/selectappointment/:id"
          element={<SelectAppointment />}
        ></Route>
        <Route
          path="/AssignAppointmentToAssistant"
          element={<AssignedAppointmentAssistant />}
        ></Route>
        <Route
          path="/selectappointmentAssistant/:id"
          element={<SelectAppointmentAssistant />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
