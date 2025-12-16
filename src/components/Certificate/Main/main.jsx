import React from "react";
import "../../Certificate/Main/main.css";
import { useTranslation } from "react-i18next";

// GENERAL
import achievment_1 from "../../../assets/images/general/certificate_1.png"
import achievment_2 from "../../../assets/images/general/certificate_2.png";

export default function Certificate() {
      const { t } = useTranslation();
    return (
            // Certificate 
             <section id="sertifikatlar" className="certificates">
               <article className="top__block">
                 <h2 className="suptitle">{t("certificates")}</h2>
               </article>
               <div className="achievment">
                 <img src={achievment_1} alt="1" />
                 <img src={achievment_2} alt="2" />
               </div>
             </section>
    );
}
