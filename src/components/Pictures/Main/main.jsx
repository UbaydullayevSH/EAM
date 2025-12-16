import React from "react";
import "./main.css";
import { useTranslation } from "react-i18next";
// ACHIEVMENTS
import a1 from "../../../assets/images/general/certificate_1.png";
import a2 from "../../../assets/images/general/certificate_2.png";

// COACHES
import c1 from "../../../assets/images/general/Dadakhanov Saidazim.jpg";
import c2 from "../../../assets/images/general/Yuldashev Shavkatbek.jpg";
import c3 from "../../../assets/images/general/Sobirov Aybek.jpg";
import c4 from "../../../assets/images/general/Dadakhanov Saidmurod.jpg";
import c5 from "../../../assets/images/general/Sedelnikova Ella.jpg";
import c6 from "../../../assets/images/general/Sultanova Umidakhon.jpg";
import c7 from "../../../assets/images/general/Yusupov Shamshiddin.jpg";

// INSTRUMENTS
import i1 from "../../../assets/images/general/instrument_1.jpg";
import i2 from "../../../assets/images/general/instrument_2.jpg";
import i3 from "../../../assets/images/general/instrument_3.jpg";
import i4 from "../../../assets/images/general/instrument_4.jpg";
import i5 from "../../../assets/images/general/instrument_5.jpg";
import i6 from "../../../assets/images/general/instrument_6.jpg";
import i7 from "../../../assets/images/general/instrument_7.jpg";
import i8 from "../../../assets/images/general/instrument_8.jpg";

// HERO 
import b1 from "../../../assets/images/general/hero_img.png"

function ImageSection({ title, images, initialVisible = 4, step = 4 }) {
  const [visibleCount, setVisibleCount] = React.useState(initialVisible);
  const { t } = useTranslation();
  const showMore = () => {
    setVisibleCount(prev => Math.min(prev + step, images.length));
  };

  const showLess = () => {
    setVisibleCount(initialVisible);
  };

  return (
    <section className="image-section">
      <h2>{title}</h2>

      <div className="gallery-wrapper">
        <div className="gallery">
          {images.slice(0, visibleCount).map((src, i) => (
            <img key={i} src={src} alt={`${title}_${i}`} />
          ))}
        </div>

        {visibleCount < images.length && (
          <button className="show-more-btn" onClick={showMore}>
            {t("showMore")}
          </button>
        )}

        {visibleCount > initialVisible && visibleCount === images.length && (
          <button className="show-more-btn" onClick={showLess}>
            {t("Hide")}
          </button>
        )}
      </div>
    </section>
  );
}

function Main() {
  const { t } = useTranslation();
  const achievements = [a1, a2];
  const coaches = [c1, c2, c3, c4, c5, c6, c7];
  const instruments = [i1, i2, i3, i4, i5, i6, i7, i8];
  const heroImg = [b1];

  return (
    <main className="main">
      <article className="top__block__images">
        <h2 className="suptitle__img">{t("pictures")}</h2>
      </article>

      <section className="image-section">
        <h2>{t("certificates")}</h2>
        <div className="gallery">
          {achievements.map((src, i) => (
            <img key={i} src={src} alt={`ach_${i}`} />
          ))}
        </div>
      </section>

      <ImageSection title={t("coaches_title")} images={coaches} initialVisible={4} step={3} />

    <ImageSection title={t("equipments_title")} images={instruments} initialVisible={4} step={4} />

      <ImageSection title={t("about_us")} images={heroImg} />
    </main>
  );
}

export default Main;
