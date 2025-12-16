// src/components/Admin/Admin.jsx
import React from "react";
import Main from "./Main/main";

function Admin() {
  return (
    <div>
      {/* Header будет рендериться только внутри Main на этапе "theme" */}
      <Main />
    </div>
  );
}

export default Admin;
