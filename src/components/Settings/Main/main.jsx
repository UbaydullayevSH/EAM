
import React, { useState } from "react";
import "../../Settings/Main/main.css";
import { useTranslation } from "react-i18next";

function Settings() {
  const { t } = useTranslation();

  const isLeftReadOnly = true;


  const [form] = useState(() => {
    const saved = localStorage.getItem("settingsForm");
    const defaults = {
      domain: "eauditm.uz",
      siteUrl: "https://example.com",
      siteName: "Energo Audit management",
      adminUrl: "http://localhost:3000/Admin",
      adminEmail: "admin@example.com",
      adminContact: "",
      ceo: "SSA&Co.",
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
    show: false,
  });

  const [ setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedPassword = localStorage.getItem("adminPassword") || "";
    if (passwords.current && passwords.current !== savedPassword) {
      setMessage("Текущий пароль неверный");
      return;
    }

    if (passwords.next && passwords.next !== passwords.confirm) {
      setMessage("Новый пароль и подтверждение не совпадают");
      return;
    }

    if (passwords.next) {
      localStorage.setItem("adminPassword", passwords.next);
    }

    localStorage.setItem("settingsForm", JSON.stringify(form));
    setPasswords({ current: "", next: "", confirm: "", show: false });
    setMessage("Настройки успешно сохранены");
  };


  return (
    <div className="settings">
      <h1>{t("settings_suptitle")}</h1>

      <form className="settings__form" onSubmit={handleSubmit}>
        <div className="grid">
          <div className="card">
            <h2>{t("settings_information")}</h2>

            <label>
              <span>{t("domain")}</span>
              <input
                type="text"
                value={form.domain}
                readOnly={isLeftReadOnly}
              />
            </label>

            <label>
              <span>{t("URL")}</span>
              <input
                type="url"
                value={form.siteUrl}
                readOnly={isLeftReadOnly}
              />
            </label>

            <label>
              <span>{t("name")}</span>
              <input
                type="text"
                value={form.siteName}
                readOnly={isLeftReadOnly}
              />
            </label>

            <label>
              <span>{t("admin_url")}</span>
              <input
                type="url"
                value={form.adminUrl}
                readOnly={isLeftReadOnly}
              />
            </label>

            <label>
              <span>CEO</span>
              <input
                type="text"
                value={form.ceo}
                readOnly={isLeftReadOnly}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Settings;
