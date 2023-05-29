import React, { useEffect, useState } from "react";
import TableComponentMUI from "./TableComponentMUI"
import Button from "react-bootstrap/Button";

function App() {

  //Main HTML
  return (
    <div>
      <h1 className="headerText">Stock Adjustment Tool</h1>
      <TableComponentMUI/>
    </div>
  );
}

export default App;
