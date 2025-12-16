import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home/Home";
import Admin from "./components/Admin/Admin";
import Certificate from "./components/Certificate/certificate";
import Coaches from "./components/Coaches/coaches";
import Equipments from "./components/Equipments/equipments";
import Settings from "./components/Settings/settings";
import Requests from "./components/Requests/requests";
import Profile from "./components/Profile/profile";
import Pictures from "./components/Pictures/pictures";
import Form from "./components/Form/form";
import RequestForm from "./components/RequestForm/RequestForm";
import Factories from "./components/Factories/factories";
import SignIn from "./components/SignIn/SignIn";

import AdminContext from "./components/Admin/Context/AdminContext";

/* =======================
   404 PAGE
======================= */
const NotFound = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    flexDirection: "column"
  }}>
    <h1 style={{ fontSize: "6rem", color: "#ff6b6b" }}>404</h1>
    <p>Page not found</p>
  </div>
);

function App() {
  const [name, setName] = useState(localStorage.getItem("adminName") || "");
  const [avatar, setAvatar] = useState(localStorage.getItem("adminAvatar") || null);
  const [dob, setDob] = useState(localStorage.getItem("adminDob") || "");

  return (
    <AdminContext.Provider value={{ name, setName, avatar, setAvatar, dob, setDob }}>
      <Router>
        <Routes>
          {/* ОТКРЫТЫЕ СТРАНИЦЫ */}
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/requestform" element={<RequestForm />} />
          <Route path="/signin" element={<SignIn />} />
          {/* АДМИН ПАНЕЛЬ */}
          <Route path="/admin" element={<Admin />} />

          {/* ЗАЩИЩЁННЫЕ РАЗДЕЛЫ (только с особенным префиксом) */}
          <Route path="/qwertysettings" element={<Settings />} />
          <Route path="/qwertyrequests" element={<Requests />} />
          <Route path="/qwertyprofile" element={<Profile />} />
          <Route path="/qwertycoaches" element={<Coaches />} />
          <Route path="/qwertyequipments" element={<Equipments />} />
          <Route path="/qwertypictures" element={<Pictures />} />
          <Route path="/qwertyfactories" element={<Factories />} />
          <Route path="/qwertycertificates" element={<Certificate />} />

          {/* ВСЁ ОСТАЛЬНОЕ → 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AdminContext.Provider>
  );
}

export default App;
