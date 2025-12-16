import React, { useState, useEffect } from "react";
import "./header.css";
import logo from "../../../assets/images/header/energo_logo.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { nameKey: "nav_home", id: "bosh-sahifa" },
  { nameKey: "nav_coaches", id: "coaches" },
  { nameKey: "nav_about", id: "hero" },
  { nameKey: "nav_news", id: "yangiliklar" },
  { nameKey: "nav_contacts", id: "kontaktlar" },
];

function Header() {
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [lang, setLang] = useState(i18n.language || "uz");
  const navigate = useNavigate();



  const goToForm  = () => {
    navigate("/form"); 
  };

  const goToAdmin = () => {
    navigate("/admin");
  };

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
    <header className="header">
      <div className="container__header">
        <div className="header__logo">
          <button className="header__btn" onClick={goToAdmin}>
            <img src={logo} alt="Q-Academy Logo" />
          </button>
          {!isMobile && (
            <span className="header_suptitle">{t("header_suptitle")}</span>
          )}
        </div>

        <nav className="header__nav">
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

          {!isMobile && (
            <div className="header__block">
              <span className="header_span">+ 998 (97) 838 60 06</span>
              <button onClick={goToForm} className="header_btn">
                {t("header_register_btn")}
              </button>
            </div>
          )}

          {isMobile && (
            <div
              className={`burger-wrapper ${burgerOpen ? "open" : ""}`}
              onClick={() => setBurgerOpen(!burgerOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          {isMobile && burgerOpen && (
            <div className="burger-menu">
              <ul>
                {menuItems.map((item, index) => (
                  <li key={index} className="burger-menu-item">
                    <a
                      href={`#${item.id}`}
                      onClick={() => setBurgerOpen(false)}
                    >
                      {t(item.nameKey)}
                    </a>
                  </li>
                ))}
              </ul>
              <button onClick={goToForm} className="burger-btn">
                {t("header_register_btn")}
              </button> 
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
