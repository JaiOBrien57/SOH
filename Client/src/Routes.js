import { Routes, Route } from "react-router-dom"
import TableComponentMUI from "./Pages/SOH_Page/TableComponentMUI"

//Need to render a different drawer on each page

export const Routes_Import = () =>{
    return (
        <div className="App">
          <Routes>
            <Route path="/SOH" element={ <TableComponentMUI/> } />
          </Routes>
        </div>
      )

}

