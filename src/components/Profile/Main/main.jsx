import React, { useState, useEffect, useContext } from "react";
import "../../Profile/Main/main.css";
import { useTranslation } from "react-i18next";
import AdminContext from "../../Admin/Context/AdminContext";

export default function Footer() {
  const { t } = useTranslation();

  const {
    name: adminName,
    setName: setAdminName,
    avatar: adminAvatar,
    setAvatar: setAdminAvatar,
    dob: adminDob,
    setDob: setAdminDob
  } = useContext(AdminContext);

  const [avatar, setAvatar] = useState(adminAvatar || null);
  const [name, setName] = useState(adminName || "");
  const [dob, setDob] = useState(adminDob || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAvatar(localStorage.getItem("adminAvatar") || null);
    setName(localStorage.getItem("adminName") || "");
    setDob(localStorage.getItem("adminDob") || "");
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!avatar || !name.trim() || !dob) {
      alert("Пожалуйста, заполните все поля!");
      return;
    }

    localStorage.setItem("adminAvatar", avatar);
    localStorage.setItem("adminName", name);
    localStorage.setItem("adminDob", dob);


    setAdminAvatar(avatar);
    setAdminName(name);
    setAdminDob(dob);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="main_2">
      <div className="profile-container">
        <div className="avatar-section">
          <img
            src={avatar}
            className="avatar" aria-label="avatar"
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          <p>{t("profile.changeImage")}</p>
        </div>

        <div className="form-group">
          <label>{t("profile.adminName")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("profile.enterName")}
          />
        </div>

        <div className="form-group">
          <label>{t("profile.dob")}</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>

        <button className="save-btn" onClick={handleSave}>
          {t("profile.saveBtn")}
        </button>

        {saved && <p style={{ color: "green" }}>Изменения сохранены!</p>}
      </div>
    </main>
  );
}
