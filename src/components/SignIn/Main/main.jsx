// src/components/Admin/Main/main.jsx
import React, { useState } from "react";
import logo from "../../../assets/images/icons/energo_logo.svg";
import { useTranslation } from "react-i18next";
import AdminContext from "../../Admin/Context/AdminContext.jsx";
import { useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import "../Main/main.css"

export default function Main({ status = "ok" }) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [adminContact, setAdminContact] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const BASE_URL = "http://172.20.10.4:4005/api";
    const navigate = useNavigate();


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


    const goBack = () => {
        navigate("/");
    };

    const validate = () => {
        const errs = {};
        if (!adminContact.trim()) errs.adminContact = t("wrap.enter_admin_contact");
        if (!adminPassword.trim()) errs.adminPassword = t("wrap.enter_password");
        return errs;
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        const validation = validate();
        setErrors(validation);
        if (Object.keys(validation).length > 0) return;

        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/adminsignin`, {
                method: "PUT", // backend для SignIn
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminContact, adminPassword }),
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error("INVALID_CREDENTIALS");
                else throw new Error("SERVER_ERROR");
            }



            setSubmitted("/");
            setLoading(false);

            // переход на админ-панель
            setTimeout(() => navigate("/qwertysettings"), 1000);
        } catch (err) {
            if (err.message === "INVALID_CREDENTIALS") {
                setErrors({ adminPassword: t("wrap.invalid_or_backend_down") });
            } else {
                setErrors({ adminPassword: t("wrap.server_error") });
            }
            setLoading(false);
        }
    };

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
            <main className="signin_wrap centered">
                <form className="signin_card" onSubmit={handleSignIn} noValidate>
                    <img src={logo} alt="logo" className="signin_logo" />

                    <h1 className="signin_title">{t("wrap.security")}</h1>
                    <p className="signin_subtitle">{t("wrap.confirmation")}</p>

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

                    {/* Password */}
                    <div
                        className={`signin_field ${errors.adminPassword ? "has-error" : ""}`}
                    >
                        <label>{t("wrap.password")}</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                        />
                        {errors.adminPassword && (
                            <div className="signin_error">{errors.adminPassword}</div>
                        )}
                    </div>
                    <button
                        type="button"
                        className="icon-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? t("wrap.hide") : t("wrap.show")}
                    </button>

                    <div className="signin_actions">
                        <button type="submit" className="btn signin_primary" disabled={loading}>
                            {loading ? t("wrap.loading") : t("wrap.SignIn")}
                        </button>
                        <button type="button" className="btn signin_ghost" onClick={goBack}>
                            {t("wrap.back")}
                        </button>
                    </div>
                </form>
            </main>
        );

    };

    return <AdminContext.Provider value={{ adminContact, setAdminContact }}>{renderSecurityPage()}</AdminContext.Provider>;
}
