import React, { useEffect, useState } from "react";
import Table_Component_MUI from "./Table_Component_MUI"
import Button from "react-bootstrap/Button";

function App() {

  //Main HTML
  return (
    <div>
      <h1 className="headerText">Stock Adjustment Tool</h1>
      <Table_Component_MUI/>
    </div>
  );
}

export default App;
