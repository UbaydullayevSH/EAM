import React from "react";
import "../Footer/footer.css";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer_text_1">{t("footer_rights")}</p>
        <p className="footer_text_2">{t("footer_dev")}</p>
      </div>
    </footer>
  );
}

export default Footer;
