import React, { useEffect, useState } from "react";
import TableComponentMUI from "./TableComponentMUI"
import Button from "react-bootstrap/Button";

function App() {

  //Main HTML
  return (
    <div style={{height: '100vh'}} className="bg-gray-200">
      <div className='headerText bg-white border border-bg-gray-200'>
        <h1 className="text-black">RMG Tools</h1>
      </div>
      <div className='bg-white border border-bg-gray-200 text-center'>
        <h1 className="text-black">Stock On Hand</h1>
      </div>
      <TableComponentMUI/>
    </div>
  );
}

export default App;
