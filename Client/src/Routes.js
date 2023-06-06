import { Routes, Route } from "react-router-dom"
import TableComponentMUI from "./Pages/SOH_Page/TableComponentMUI"

export const Routes_Import = () =>{
    return (
        <div className="App">
          <Routes>
            <Route path="/SOH" element={ <TableComponentMUI/> } />
          </Routes>
        </div>
      )

}

