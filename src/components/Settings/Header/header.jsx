import React, { useState, useEffect } from "react";
import "./header.css";
import logo from "../../../assets/images/header/energo_logo.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { nameKey: "nav_home", path: "/" },
  { nameKey: "nav_coaches", path: "/qwertycoaches" },
  { nameKey: "nav_certificates", path: "/qwertycertificates" },
  { nameKey: "nav_requests", path: "/qwertyrequests" },
  { nameKey: "nav_settings", path: "/qwertysettings" },
  { nameKey: "nav_profile", path: "/qwertyprofile" },
  { nameKey: "nav_instruments", path: "/qwertyequipments" },
  { nameKey: "nav_pictures", path: "/qwertypictures" },
    { nameKey: "nav_factories", path: "/qwertyfactories" }
];

function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [lang, setLang] = useState(i18n.language || "uz");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  return (
    <header className="header_2">
      <div className="container__header_2">

        {/* Burger Menu */}
        <div
          className={`burger__menu ${isMobile ? "mobile" : "desktop"} ${burgerOpen ? "active" : ""}`}
          onClick={() => setBurgerOpen(!burgerOpen)}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <div className="header_2__logo">
          <img src={logo} alt="header_logo" />
          <button onClick={() => navigate("/")} className="admin_btn">
            <i style={{ color: "#fff", fontSize: "18px" }} className="fa-solid fa-house"></i>
          </button>
          {!isMobile && (
            <span onClick={() => navigate("/")} className="header_2_suptitle">
              {t("header_suptitle")}
            </span>
          )}
        </div>

        {/* Правая часть */}
        <nav className="header_2__nav">
          <div className="lang-switch">
            <button
              className={`lang-btn ${lang === "ru" ? "active" : ""}`}
              onClick={() => changeLanguage("ru")}
            >
              RU
            </button>
            <button
              className={`lang-btn ${lang === "uz" ? "active" : ""}`}
              onClick={() => changeLanguage("uz")}
            >
              UZ
            </button>
          </div>

          <div className="header_2__block">
            {!isMobile && (
              <p className="admin_info">
                {t("admin_greeting")}
              </p>
            )}
            <i style={{ color: "#fff" }} className="fa-regular fa-circle-user"></i>
          </div>
        </nav>
      </div>

      {burgerOpen && (
        <nav className={`nav-vertical scroll-hidden ${isMobile ? "mobile" : "desktop"} active`}>
          <ul>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="nav-item"
                onClick={() => {
                  navigate(item.path);
                  setBurgerOpen(false);
                }}
              >
                {t(item.nameKey)}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
