import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../Equipments/Main/main.css";


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

function HelloWorld() {
    const { t } = useTranslation();
      const [currentIndex, setCurrentIndex] = useState(0);
    return (
        // EQUIPMENTS 
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
    );
}

export default HelloWorld;
