// src/components/Factories/Main/main.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../Factories/Main/main.css";

function Factories() {
  const { t } = useTranslation();
  const BASE_IP = "http://89.39.95.70:4005/api";

  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFactories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${BASE_IP}/admingetfactory`);
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

        const data = await response.json();
          
        const finalFactories = data.map((factory) => ({
          subname: factory.subname || "",
          location: factory.location || "",
          appointment: factory.appointment || "",
          stirid: factory.stirid || "",
        }));

        setFactories(finalFactories);
      } catch (err) {
        console.error("Ошибка загрузки заводов:", err);
        setError("Ошибка при отправке");
      } finally {
        setLoading(false);
      }
    };

    loadFactories();
  }, []);

  const openModal = (factory) => setSelected(factory);
  const closeModal = () => setSelected(null);


  return (
    <div className="factories">
      <h1>{t("factories_title")}</h1>

      {loading && <p>{t("searching") || "Загрузка..."}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="factories-list">
        {factories.map((factory, index) => (
          <div key={factory._id || index} className="factory-card">
            <p><strong> {t("factory.name")} </strong> {factory.subname || "—"}</p>
            <p><strong> {t("factory.address")} </strong> {factory.location || "—"}</p>
            <p><strong> {t("factory.occupation")}</strong> {factory.appointment || "—"}</p>
            <p><strong>{t("factory.stirId")} </strong> {factory.stirid || "—"}</p>

            <button className="show-btn" onClick={() => openModal(factory)}>
              {t("show")}
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal">
          <div className="modal-content">
            <h2>{t("factories.name")}<strong>:</strong> {selected.subname || "—"}</h2>
            <p> {t("factories.location")}<strong>: </strong> {selected.location || "—"}</p>
            <p>{t("factories.appointment")}<strong>: </strong> {selected.appointment || "—"}</p>
            <p>{t("factories.stirid")}<strong>: </strong> {selected.stirid || "—"}</p>
            <button onClick={closeModal}>{t("modal.close")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Factories;
