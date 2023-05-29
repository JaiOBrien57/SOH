import React, { useEffect, useState } from "react";
import TableComponentMUI from "./TableComponentMUI"
import Button from "react-bootstrap/Button";

function App() {

  //Main HTML
  return (
    <div style={{height: '100vh'}} className="h-100% bg-gray-300">
      <div className='headerText bg-white border border-bg-gray-300'>
        <h1 className="text-black">RMG Tools</h1>
      </div>
      <div className='bg-white border border-bg-gray-300 text-center'>
        <h1 className="text-black">Stock On Hand</h1>
      </div>
      <TableComponentMUI/>
    </div>
  );
}

export default App;
