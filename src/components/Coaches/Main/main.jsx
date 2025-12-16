import React from "react";
import "../../Coaches/Main/main.css";
import { useTranslation } from "react-i18next";

// COACHES
import coach_1 from "../../../assets/images/general/Dadakhanov Saidazim.jpg";
import coach_2 from "../../../assets/images/general/Yuldashev Shavkatbek.jpg";
import coach_3 from "../../../assets/images/general/Sobirov Aybek.jpg";
import coach_4 from "../../../assets/images/general/Dadakhanov Saidmurod.jpg";
import coach_5 from "../../../assets/images/general/Sedelnikova Ella.jpg";
import coach_6 from "../../../assets/images/general/Sultanova Umidakhon.jpg";
import coach_7 from "../../../assets/images/general/Yusupov Shamshiddin.jpg";

const coaches = [
  { img: coach_1, statusKey: "coach_status", name: "Дадаханов Сайдазим" },
  { img: coach_2, statusKey: "coach_status", name: "Юлдашев Шавкатбек" },
  { img: coach_3, statusKey: "coach_status", name: "Собиров Айбек" },
  { img: coach_4, statusKey: "coach_status", name: "Дадаханов Саидмурод" },
  { img: coach_5, statusKey: "coach_status", name: "Седелникова Элла" },
  { img: coach_6, statusKey: "coach_status", name: "Султанова Умидахон" },
  { img: coach_7, statusKey: "coach_status", name: "Юсупов Шамшиддин" },
];

function Coaches() {
  const { t } = useTranslation(); 

  return (
    /* COACHES */
    <section id="coaches" className="coaches_2">
      <article className="top__block_2">
        <h2 className="suptitle_2">{t("coaches_title")}</h2>
      </article>
      <p className="top_text_2">{t("coaches_text")}</p>

      <div className="card__box_2">
        {coaches.map((coach, index) => (
          <article key={index} className="card_wrapper_2">
            <img src={coach.img} alt={coach.name} />
            <p className="status_2">{t(coach.statusKey)}</p>
            <h3 className="name_2">{coach.name}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Coaches;
