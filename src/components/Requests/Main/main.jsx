// src/components/Requests/Main/main.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../Requests/Main/main.css";

function Requests() {
  const { t } = useTranslation();

  const BASE_IP = "http://89.39.95.70:4005/api";

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${BASE_IP}/adminrequests`);
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();

        // ✅ ВАЖНО: backend возвращает RequirementObj
        const normalizedRequests = Array.isArray(data.RequirementObj)
          ? data.RequirementObj
          : [];

        setRequests(normalizedRequests);
      } catch (err) {
        console.error("Ошибка загрузки заявок:", err);
        setError("Backend недоступен");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const openModal = (req) => setSelected(req);
  const closeModal = () => setSelected(null);

const deleteRequest = async (id) => {
  try {
     const res = await fetch(`${BASE_IP}/adminrequestsdelete/${id}`, {
      method: "DELETE",
    });


    // Обновляем список локально
    setRequests(prev => prev.filter(r => r._id !== id));
  } catch (err) {
    console.error("Ошибка удаления завода:", err);
    alert("Не удалось удалить завод");
  }
};

  return (
    <div className="requirements">
      <h1>{t("requirements_title")}</h1>

      {loading && <p>{t("searching") || "Загрузка..."}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="requests-list">
        {requests.map((req) => (
          <div key={req._id} className="request-card">
            <p>
              <strong>{t("requestCard.number")}:</strong>{" "}
              {req.contact || "—"}
            </p>
            <p>
              <strong>{t("requestCard.email_2")}:</strong>{" "}
              {req.email || "—"}
            </p>

            <button
              className="delete-btn"
              onClick={() => deleteRequest(req._id)}
            >
              {t("requestCard.delete")}
            </button>

            <button className="show-btn" onClick={() => openModal(req)}>
              {t("show")}
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal">
          <div className="modal-content">
            <h2>{t("request_info")}</h2>
            <p>
              <strong>{t("requestCard.name")}:</strong>{" "}
              {selected.name || "—"}
            </p>
            <p>
              <strong>{t("requestCard.email_2")}:</strong>{" "}
              {selected.email || "—"}
            </p>
            <p>
              <strong>{t("requestCard.number")}:</strong>{" "}
              {selected.contact || "—"}
            </p>
            <p>
              <strong>{t("requestCard.message")}:</strong>{" "}
              {selected.message || "—"}
            </p>
            <button onClick={closeModal}>{t("modal.close")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Requests;
