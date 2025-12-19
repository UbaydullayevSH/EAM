import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../Main/main.css";
import { useNavigate } from "react-router-dom";

function RequestForm() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "uz");
  const BASE_URL = "http://89.39.95.70:4005/api";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const [, setRequests] = useState([]); // реальные запросы с backend
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("none");

  const navigate = useNavigate();
  const goToHome = () => navigate("/");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (contact) => {
    setFormData({ ...formData, contact });
  };

  const validateForm = () => {
    const { name, email, contact, message } = formData;

    if (!name.trim()) return { valid: false, message: t("simpleForm.fields.name.error") || "Введите имя" };
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return { valid: false, message: t("simpleForm.fields.email.error") || "Введите корректный email" };
    if (!contact.trim() || contact.replace(/\D/g, "").length < 9) return { valid: false, message: t("simpleForm.fields.phone.error") || "Введите корректный телефон" };
    if (!message.trim()) return { valid: false, message: t("simpleForm.fields.message.error") || "Введите сообщение" };

    return { valid: true };
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.valid) {
      setStatusMsg(validation.message);
      setStatusType("error");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
      const data = await res.json();
      console.log("Ответ сервера:", data);

      setStatusMsg(t("simpleForm.successMsg") || "Данные отправлены");
      setStatusType("success");


      fetchRequests();

    } catch (err) {
  console.error("Ошибка при загрузке запросов:", err);
  setStatusMsg(t("simpleForm.errorMsg") || "Данные не отправлены");
  setStatusType("error");
}




    setFormData({ name: "", email: "", contact: "", message: "" });
  };

  // GET REQUEST 
  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/requests`);
      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Ошибка при загрузке запросов:", err);

    }
  }, [BASE_URL, t, setRequests]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="simple-form-container">
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

      <h2>{t("simpleForm.title")}</h2>
      <form onSubmit={submitForm} className="request-form">
        <div className="form-group">
          <label>{t("simpleForm.fields.name.label")}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("simpleForm.fields.name.placeholder")}
          />
        </div>

        <div className="form-group">
          <label>{t("simpleForm.fields.email.label")}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("simpleForm.fields.email.placeholder")}
          />
        </div>

        <div className="form-group">
          <label>{t("simpleForm.fields.phone.label")}</label>
          <PhoneInput
            country="uz"
            value={formData.contact}
            onChange={handlePhoneChange}
            inputStyle={{ width: "100%", height: "40px", fontSize: "16px" }}
            placeholder={t("simpleForm.fields.phone.placeholder")}
          />
        </div>

        <div className="form-group">
          <label>{t("simpleForm.fields.message.label")}</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t("simpleForm.fields.message.placeholder")}
          />
        </div>

        <button type="submit" className="submit-btn">
          {t("form.btn_continue")} →
        </button>
        <button
          type="button"
          onClick={goToHome}
          className="submit-btn"

        >
          {t("form.btn_back")} →
        </button>

        {statusType !== "none" && (
          <p
            style={{
              marginTop: "15px",
              fontWeight: "bold",
              color: statusType === "success" ? "green" : "red",
            }}
          >
            {statusMsg}
          </p>
        )}
      </form>


    </div>
  );
}

export default RequestForm;
