import React, { useState, useEffect, useRef } from "react";
import "./main.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Images
import heroImg from "../../../assets/images/general/hero_img.png";

// GENERAL
import achievment_1 from "../../../assets/images/general/certificate_1.png"
import achievment_2 from "../../../assets/images/general/certificate_2.png";

// COACHES
import coach_1 from "../../../assets/images/general/Dadakhanov Saidazim.jpg";
import coach_2 from "../../../assets/images/general/Yuldashev Shavkatbek.jpg";
import coach_3 from "../../../assets/images/general/Sobirov Aybek.jpg";
import coach_4 from "../../../assets/images/general/Dadakhanov Saidmurod.jpg";
import coach_5 from "../../../assets/images/general/Sedelnikova Ella.jpg";
import coach_6 from "../../../assets/images/general/Sultanova Umidakhon.jpg";
import coach_7 from "../../../assets/images/general/Yusupov Shamshiddin.jpg";

// INSTRUMENTS
import instrument_1 from "../../../assets/images/general/instrument_1.jpg";
import instrument_2 from "../../../assets/images/general/instrument_2.jpg";
import instrument_3 from "../../../assets/images/general/instrument_3.jpg";
import instrument_4 from "../../../assets/images/general/instrument_4.jpg";
import instrument_5 from "../../../assets/images/general/instrument_5.jpg";
import instrument_6 from "../../../assets/images/general/instrument_6.jpg";
import instrument_7 from "../../../assets/images/general/instrument_7.jpg";
import instrument_8 from "../../../assets/images/general/instrument_8.jpg";

const images = [
  instrument_1,
  instrument_2,
  instrument_3,
  instrument_4,
  instrument_5,
  instrument_6,
  instrument_7,
  instrument_8,
];

const coaches = [
  { img: coach_1, statusKey: "coach_status", name: "Дадаханов Сайдазим" },
  { img: coach_2, statusKey: "coach_status", name: "Юлдашев Шавкатбек" },
  { img: coach_3, statusKey: "coach_status", name: "Собиров Айбек" },
  { img: coach_4, statusKey: "coach_status", name: "Дадаханов Саидмурод" },
  { img: coach_5, statusKey: "coach_status", name: "Седелникова Элла" },
  { img: coach_6, statusKey: "coach_status", name: "Султанова Умидахон" },
  { img: coach_7, statusKey: "coach_status", name: "Юсупов Шамшиддин" },
];

const BASE_IP = "http://89.39.95.70:4005";

// Default statistics — minimal; will be updated by API
const defaultStats = [
  { labelKey: "stat_certificates", number: 0 },
];

export default function Main() {
  const { t } = useTranslation();


const navigate = useNavigate();



const goToRequestForm = () => {
  navigate("/requestform");
};



  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // SEARCH
  const [searchTerm, setSearchTerm] = useState("");
  const [factoryResult, setFactoryResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
      setFactoryResult(null);
      setNotFound(false);
      return;
    }

    const debounce = setTimeout(async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const res = await fetch(`${BASE_IP}/api/factorygetOne/${searchTerm}`);

        if (res.status === 404) {
          setFactoryResult(null);
          setNotFound(true);
          return;
        }

        const data = await res.json();
        const item = Array.isArray(data) ? data[0] : data;

        setFactoryResult(item?.dataObj ?? null);
      } catch (err) {
        console.log(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // STATISTICS
  const [stats, setStats] = useState(defaultStats);

  const [animatedNumbers, setAnimatedNumbers] = useState(() =>
    defaultStats.map(() => 0)
  );

  const statsRef = useRef(null);
  const statsStarted = useRef(false);
  const intervalsRef = useRef([]);
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  // Fetch stats from backend
  useEffect(() => {
    let mounted = true;

    async function fetchStats() {
      try {
        const res = await fetch(`${BASE_IP}/api/factorycount`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : {};
        } catch (err) {
          console.error("Failed to parse /api/factorycount response:", err);
        }

        if (!mounted) return;

        if (data) {
          // If data.count exists -> use it for first stat (common case)
          if (typeof data.count !== "undefined") {
            const countValue = Number(data.count) || 0;
            const newStats = stats.map((s, i) =>
              i === 0 ? { ...s, number: countValue } : { ...s }
            );
            setStats(newStats);
            setAnimatedNumbers(newStats.map(() => 0));
            return;
          }

          // Try mapping by labelKey names (support several shapes)
          const mapped = stats.map((s) => {
            const keysToTry = [
              s.labelKey,
              s.labelKey.replace("stat_", ""),
              s.labelKey.replace("stat_", "count_"),
            ];
            for (const k of keysToTry) {
              if (typeof data[k] !== "undefined") {
                return { ...s, number: Number(data[k]) || 0 };
              }
            }
            return s;
          });

          const changed = mapped.some((m, idx) => m.number !== stats[idx].number);
          if (changed) {
            setStats(mapped);
            setAnimatedNumbers(mapped.map(() => 0));
            return;
          }

          // If array
          if (Array.isArray(data) && data.length >= stats.length) {
            const arrStats = stats.map((s, i) => ({ ...s, number: Number(data[i]) || 0 }));
            setStats(arrStats);
            setAnimatedNumbers(arrStats.map(() => 0));
            return;
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchStats();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Observer to track visibility of stats block
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsStatsVisible(Boolean(entry && entry.isIntersecting));
      },
      { threshold: 0.4 }
    );

    if (statsRef.current) obs.observe(statsRef.current);

    return () => obs.disconnect();
  }, []);

  // Animate numbers when block is visible and stats contain non-zero values
  useEffect(() => {
    // cleanup previous intervals
    intervalsRef.current.forEach((id) => clearInterval(id));
    intervalsRef.current = [];

    // if already started, skip
    if (statsStarted.current) return;

    // only start if block is visible AND there's at least one non-zero stat
    const hasAny = stats.some((s) => Number(s.number) > 0);

    if (!isStatsVisible || !hasAny) return;

    statsStarted.current = true;

    stats.forEach((item, index) => {
      let start = 0;
      const end = Number(item.number) || 0;
      const duration = 1500; // ms
      const frameDuration = 16;
      const totalFrames = Math.max(1, Math.round(duration / frameDuration));
      const increment = end / totalFrames;

      const id = setInterval(() => {
        start += increment;
        setAnimatedNumbers((prev) => {
          const updated = [...prev];
          updated[index] = Math.round(start >= end ? end : start);
          return updated;
        });
        if (start >= end) clearInterval(id);
      }, frameDuration);

      intervalsRef.current.push(id);
    });

    return () => {
      intervalsRef.current.forEach((id) => clearInterval(id));
      intervalsRef.current = [];
    };
  }, [isStatsVisible, stats]);

  // MAP
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([40.7560038, 72.341756], 17);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    L.marker([40.7560038, 72.341756])
      .addTo(map)
      .bindPopup(t("map_here"))
      .openPopup();

    return () => {
      try {
        map.remove();
      } catch (err) { }
      mapInstanceRef.current = null;
    };
  }, [t]);



  const visibleCoaches = showAll ? coaches : coaches.slice(0, 4);

  return (
    // Main 
    <main className="main">
      <div className="container__main">
        {/* SEARCH */}
        <section className="search-section" id="bosh-sahifa">
          <div className="search-bar">
            <div className="input-wrapper">
              <input
                type="number"
                className="search-input"
                placeholder={t("search_placeholder")}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search search-icon"></i>
            </div>

            {loading && <div className="no-results">{t("loading")}</div>}

            {factoryResult && (
              <ul className="search-results">
                <li className="search-result-item">
                  <p>
                    <b>{t("stir_id")}:</b> {factoryResult.stirid}
                  </p>
                  <p>
                    <b>{t("title")}:</b> {factoryResult.subname}
                  </p>
                  <p>
                    <b>{t("location")}:</b> {factoryResult.location}
                  </p>
                  <p>
                    <b>{t("appointment")}:</b> {factoryResult.appointment}
                  </p>
                </li>
              </ul>
            )}

            {notFound && <div className="no-results">{t("nothing found")}</div>}
          </div>

          <div className="items">
            <ul className="main__menu">
              <li className="main__menu__list">
                <a href="#bosh-sahifa">{t("nav_home")}</a>
              </li>
              <li className="main__menu__list">
                <a href="#coaches">{t("nav_coaches")}</a>
              </li>
              <li className="main__menu__list">
                <a href="#biz-haqimizda">{t("nav_about")}</a>
              </li>
              <li className="main__menu__list">
                <a href="#sertifikatlar">{t("nav_news")}</a>
              </li>
              <li className="main__menu__list">
                <a href="#kontaktlar">{t("nav_contacts")}</a>
              </li>
            </ul>
          </div>
        </section>

        {/* HERO */}
        <section id="biz-haqimizda" className="hero">
          <article className="top__block">
            <h1 className="suptitle">{t("about_us")}</h1>
          </article>

          <div className="hero__wrapper">
            <div className="image__container">
              <img src={heroImg} alt={t("about_us_hero_alt")} />
              <p>{t("hero_paragraph")}</p>
            </div>
            <div className="details">
              <div className="text__box">
                <h2 className="hero_suptitle">{t("goals_title")}</h2>
                <ul className="hero_text">
                  {Array.from({ length: 8 }, (_, i) => (
                    <li key={i}>{t(`hero_goal_${i + 1}`)}</li>
                  ))}
                </ul>
                <p className="extra_text">{t("hero_license")}</p>
              </div>

              <div className="text__box">
                <h2 className="hero_suptitle">{t("advantages_title")}</h2>
                <ul className="hero_text">
                  {Array.from({ length: 5 }, (_, i) => (
                    <li key={i}>{t(`advantage_${i + 1}`)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CERTIFICATES */}
        <section id="sertifikatlar" className="certificates">
          <article className="top__block">
            <h2 className="suptitle">{t("certificates")}</h2>
          </article>
          <div className="achievment">
            <img src={achievment_1} alt="1" />
            <img src={achievment_2} alt="2" />
          </div>
        </section>

        {/* COACHES */}
        <section id="coaches" className="coaches">
          <article className="top__block">
            <h2 className="suptitle">{t("coaches_title")}</h2>
          </article>
          <p className="top_text">{t("coaches_text")}</p>

          <div className="card__box">
            {visibleCoaches.map((coach, index) => (
              <article key={index} className="card_wrapper">
                <img src={coach.img} alt={coach.name} />
                <p className="status">{t(coach.statusKey)}</p>
                <h3 className="name">{coach.name}</h3>
              </article>
            ))}
          </div>

          <button className="show-all-btn" onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? t("hide_all") : t("show_all")}
          </button>
        </section>

        {/* STATISTICS */}
        <section className="statistics-section" ref={statsRef}>
          <article className="top__block">
            <h2 className="suptitle">{t("statistics_title")}</h2>
          </article>
          <section className="statistics" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {stats.map((item, index) => (
              <div className="card_statistics" key={index} style={{ width: "75%", textAlign: "center", margin: "0 auto" }}>
                <span className="stat-number">{animatedNumbers[index] ?? 0}</span>
                <p className="stat-label">{t(item.labelKey)}</p>
              </div>
            ))}
          </section>
        </section>

        {/* EQUIPMENTS */}
        <section className="equipments">
          <article className="top__block">
            <h1 className="suptitle">{t("equipments_title")}</h1>
          </article>

          <div className="sup_block">
            <p className="sup__text">{t("equipments_text")}</p>
            <div className="btn-switch">
              <button className="switch_1" onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 3 : prev - 1))}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button className="switch_2" onClick={() => setCurrentIndex((prev) => (prev === images.length - 3 ? 0 : prev + 1))}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div className="carousel" style={{ display: "flex", gap: "10px" }}>
            {images.slice(currentIndex, currentIndex + 3).map((img, index) => (
              <img key={index} src={img} alt={`equipment ${currentIndex + index + 1}`} style={{ width: "25%", objectFit: "cover" }} />
            ))}
          </div>
        </section>

        {/* CONTACTS */}
        <section id="kontaktlar" className="contact-section">
          <div className="container">
            <article className="top__block">
              <h2 className="suptitle">{t("contacts_title")}</h2>
            </article>

            <div className="contact-grid">
              <div className="contact-left">
                <p className="lead">{t("contacts_lead")}</p>

                <div className="contact-info">
                  <p className="info-item">
                    <strong>{t("phone")}:</strong>{" "}
                    <a href="tel:+998980770400" className="contact-link">
                      +998 (98) 077-04-00
                    </a>
                  </p>
                
                  <p className="info-item">
                    <strong>{t("address")}:</strong> <span>{t("address_text")}</span>
                  </p>
                </div>

                <button

                  className="toggle-form"
                  type="button"
                  aria-expanded="false"
                  onClick={goToRequestForm}


                >
                  {t("contact_form_btn")}
                </button>

               


              </div>

              <div
                ref={mapRef}
                className="contact-right"
                style={{ height: "320px", width: "100%", borderRadius: "8px" }}
                aria-label={t("map_here")}
              ></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
