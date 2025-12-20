import React, { useState } from "react";
import "../../Form/Main/main.css";

import logo from "../../../assets/images/header/energo_logo.svg";

import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Form() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "uz");

  const BASE_URL = "https://eamserver.eauditm.uz";

  const navigate = useNavigate();
  const goToHome = () => navigate("/");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  const [formData, setFormData] = useState({
    subname: "",
    location: "",
    appointment: "",
    stirid: "",
    email: "",
    telephoneNumber: "",
  });

  const [localData, setLocalData] = useState([]);
  const [statusMsg, setStatusMsg] = useState(""); // сообщение
  const [statusType, setStatusType] = useState("none"); // success / error

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handlePhoneChange = (phone) => {
    setFormData({ ...formData, telephoneNumber: phone });
  };

  const validateForm = () => {
    if (!formData.subname.trim()) return t("form.validation_company");
    if (!formData.location.trim()) return t("form.validation_address");
    if (!formData.appointment.trim()) return t("form.validation_activity");
    if (!/^\d{3,15}$/.test(String(formData.stirid))) return t("form.validation_stir");
    return null;
  };

  const submitForm = async () => {
    const error = validateForm();
    if (error) {
      setStatusMsg(error);
      setStatusType("error");
      return;
    }

    const newLocalEntry = {
      id: localData.length + 1,
      ...formData,
    };
    setLocalData([...localData, newLocalEntry]);

    const serverPayload = {
      subname: formData.subname,
      location: formData.location,
      appointment: formData.appointment,
      stirid: formData.stirid,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/factory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serverPayload),
      });

      setStatusMsg(t("form.success"));
      setStatusType("success");
    } catch (err) {
      console.error(err);
      setStatusMsg(t("form.error"));
      setStatusType("error");
    }

    setFormData({
      subname: "",
      location: "",
      appointment: "",
      stirid: "",
      email: "",
      telephoneNumber: "",
    });
  };

  return (
    <div className="order-page">
      <img src={logo} alt="logo" className="order-logo" />
      <h1 className="order-title">{t("form.form_title")}</h1>
      <p className="order-description">{t("form.form_subtitle")}</p>

      <div className="order-links">
        <p>
          {t("form.form_email_label")}{" "}
          <a href="mailto:e.a.menejment@mail.ru">e.a.menejment@mail.ru</a>
        </p>
        <p>
          {t("form.form_telegram_label")}{" "}
          <a href="https://t.me/energo_audit_menejer">@energo_audit_menejer</a>
        </p>
      </div>

      {/* Языковые кнопки */}
      <div
        className="lang-switch"
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <button
          className={`lang-btn_2 ${lang === "ru" ? "active" : ""}`}
          onClick={() => changeLanguage("ru")}
        >
          RU
        </button>
        <button
          className={`lang-btn_2 ${lang === "uz" ? "active" : ""}`}
          onClick={() => changeLanguage("uz")}
        >
          UZ
        </button>
      </div>

      <div className="order-form">
        <div className="input-group">
          <label>{t("form.company_full_name")}</label>
          <input
            type="text"
            value={formData.subname}
            onChange={handleChange("subname")}
            placeholder={t("form.company_full_name_placeholder")}
          />
        </div>

        <div className="input-group">
          <label>{t("form.post_address")}</label>
          <input
            type="text"
            value={formData.location}
            onChange={handleChange("location")}
            placeholder={t("form.post_address_placeholder")}
          />
        </div>

        <div className="input-group">
          <label>{t("form.TypeOfActivity")}</label>
          <input
            type="text"
            value={formData.appointment}
            onChange={handleChange("appointment")}
            placeholder={t("form.post_activity_placeholder")}
          />
        </div>

        <div className="input-group">
          <label>{t("form.email")}</label>
          <input
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            placeholder={t("form.email_placeholder")}
          />
        </div>

        <div className="input-group">
          <label>{t("form.stir")}</label>
          <input
            type="number"
            value={formData.stirid}
            onChange={handleChange("stirid")}
            placeholder={t("form.stir_placeholder")}
          />
        </div>

        <div className="form-group">
          <label>{t("form.phone_number")}</label>
          <PhoneInput
            country="uz"
            value={formData.telephoneNumber}
            onChange={handlePhoneChange}
            inputStyle={{ width: "100%", height: "40px", fontSize: "16px" }}
          />
        </div>

        <button className="form-btn" onClick={submitForm}>
          {t("form.btn_continue")} →
        </button>
        <button onClick={goToHome} className="form-btn">
          {t("form.btn_back")} →
        </button>

        {statusType !== "none" && (
          <p
            style={{
              marginTop: "10px",
              fontWeight: "bold",
              color: statusType === "success" ? "green" : "red",
            }}
          >
            {statusMsg}
          </p>
        )}
      </div>
    </div>
  );
}

export default Form;
