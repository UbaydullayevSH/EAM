// src/components/Admin/Main/main.jsx
import React, { useState, useEffect } from "react";
import "../../Admin/Main/main.css";
import logo from "../../../assets/images/icons/energo_logo.svg";
import { useTranslation } from "react-i18next";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import Header from "../Header/header";
import AdminContext from "../Context/AdminContext";
import { useNavigate } from "react-router-dom";

export default function Main({ status = "ok" }) {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "uz");
  const [step, setStep] = useState("loader");
  const BASE_URL = "https://eamserver.eauditm.uz";
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  const goToSignIn = () => {
    navigate("/signin");
  };


  // =======================
  // SECURITY STATE
  // =======================
  const [submitted, setSubmitted] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminContact, setAdminContact] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =======================
  // FORM DATA
  // =======================
  const [formData, setFormData] = useState({
    telephoneNumber: "",
  });

  const handlePhoneChange = (phone) => {
    setAdminContact(phone);
    setFormData((prev) => ({ ...prev, telephoneNumber: phone }));
  };

  // =======================
  // VALIDATION
  // =======================
  const validate = () => {
    const errs = {};
    if (!adminName.trim()) errs.adminName = t("wrap.enter_admin_name");
    if (!adminContact.trim()) errs.adminContact = t("wrap.enter_contact");
    if (!adminPassword.trim()) errs.adminPassword = t("wrap.enter_password");
    else if (adminPassword.length < 8)
      errs.adminPassword = t("wrap.password_length");
    return errs;
  };

  // =======================
  // SUBMIT
  // =======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminName, adminContact, adminPassword }),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("INVALID_CREDENTIALS");
        else throw new Error("SERVER_ERROR");
      }


      setSubmitted(true);
      setLoading(false);
      setTimeout(() => setStep("theme"), 5000);
    } catch (err) {
      if (err.message === "INVALID_CREDENTIALS") {
        setErrors({ adminPassword: t("wrap.invalid_or_backend_down") });
      } else {
        setErrors({ adminPassword: t("wrap.server_error") });
      }
      setLoading(false);
    }
  };

  // =======================
  // LOADER → SECURITY
  // =======================
  useEffect(() => {
    if (step === "loader") {
      const timer = setTimeout(() => setStep("admin security"), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // =======================
  // SECURITY UI
  // =======================
  const renderSecurityPage = () => {
    if (submitted) {
      return (
        <main className="wrap centered success-screen">
          <div className="card success-card">
            <h2>Готово</h2>
            <p className="muted">
              Авторизация успешна. Переход в панель администратора…
            </p>
          </div>
        </main>
      );
    }

    return (
      <main className="wrap centered">
        <form className="card" onSubmit={handleSubmit} noValidate>
          <img src={logo} alt="logo" className="logo" />

          {/* Языки */}
          <div
            className="lang-switch"
            style={{ display: "flex", gap: 10, marginBottom: 20 }}
          >
            <button
              type="button"
              className={`lang-btn_2 ${lang === "ru" ? "active" : ""}`}
              onClick={() => changeLanguage("ru")}
            >
              RU
            </button>
            <button
              type="button"
              className={`lang-btn_2 ${lang === "uz" ? "active" : ""}`}
              onClick={() => changeLanguage("uz")}
            >
              UZ
            </button>

            <button onClick={goToSignIn} type="button" className="SignIn__button">
              {t("wrap.SignIn")}
            </button>
          </div>

          <h1 className="title">{t("wrap.security")}</h1>
          <p className="subtitle">{t("wrap.confirmation")}</p>

          <div className={`field ${errors.adminName ? "has-error" : ""}`}>
            <label>{t("wrap.name0fAdmin")}</label>
            <input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />
            {errors.adminName && (
              <div className="error">{errors.adminName}</div>
            )}
          </div>

          {/* PhoneInput */}
          <div className="form-group">
            <label>{t("form.phone_number")}</label>
            <PhoneInput
              country="uz"
              value={formData.telephoneNumber}
              onChange={handlePhoneChange}
              inputStyle={{ width: "100%", height: "40px", fontSize: "16px" }}
            />
          </div>

          <div className={`field ${errors.adminPassword ? "has-error" : ""}`}>
            <label>{t("wrap.password")}</label>
            <div className="password-row">
              <input
                type={showPassword ? "text" : "password"}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <button
                type="button"
                className="icon-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? t("wrap.hide") : t("wrap.show")}
              </button>
            </div>
            {errors.adminPassword && (
              <div className="error">{errors.adminPassword}</div>
            )}
          </div>

          <div className="actions">
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? t("wrap.loading") : t("wrap.SignUp")}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setAdminName("");
                setAdminContact("");
                setAdminPassword("");
                setErrors({});
              }}
            >
              {t("wrap.clean")}
            </button>
          </div>
        </form>
      </main>
    );
  };

  return (
    <AdminContext.Provider value={{ adminName, setAdminName }}>
      {step === "theme" && <Header />}

      <main className="main_2">
        {step === "loader" && (
          <section className="loader">
            <section className="paper_man_wrapper">
              <section className="paper_man">
                <section className="paper_man_body part">
                  <section className="paper_man_head part" />

                  <section className="paper_man_arm left">
                    <section className="paper_man_arm_1 part">
                      <section className="paper_man_arm_2 part">
                        <section className="paper_man_arm_hand part" />
                      </section>
                    </section>
                  </section>

                  <section className="paper_man_arm right">
                    <section className="paper_man_arm_1 part">
                      <section className="paper_man_arm_2 part">
                        <section className="paper_man_arm_hand part" />
                      </section>
                    </section>
                  </section>

                  <section className="paper_man_leg left">
                    <section className="paper_man_leg_1 part">
                      <section className="paper_man_leg_2 part">
                        <section className="paper_man_leg_foot part" />
                      </section>
                    </section>
                  </section>

                  <section className="paper_man_leg right">
                    <section className="paper_man_leg_1 part">
                      <section className="paper_man_leg_2 part">
                        <section className="paper_man_leg_foot part" />
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        )}

        {step === "admin security" && renderSecurityPage()}

        {step === "theme" && (
          <section className={`theme-block theme-${status}`}>
            <div className="theme-content">
              <h2 className="theme-title">
                {status === "ok"
                  ? "✅ Система работает стабильно"
                  : status === "warning"
                    ? "⚠️ Есть предупреждения"
                    : "❌ Обнаружены ошибки"}
              </h2>
              <p className="theme-subtitle">
                {status === "ok"
                  ? "Все сервисы функционируют без проблем."
                  : status === "warning"
                    ? "Некоторые модули нестабильны."
                    : "Критическая ошибка."}
              </p>
            </div>
          </section>
        )}
      </main>
    </AdminContext.Provider>
  );
}
