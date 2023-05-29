import { DataGrid } from '@mui/x-data-grid';
import { Link } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Select, initTE } from "tw-elements";
initTE({ Select });

export default function DataTable() {

//Setup React variables
const [availData, setAvailData] = React.useState([{"IDDear":"","SKU":"","Name":"","AvailableCage":"","AvailableRefurbCage":"","DealerPrice":""}]);
const [selectedDataTable, SetSelectedDataTable] = React.useState([{}]);

  //Get the avail List
  useEffect(() => {
    async function FetchAvail() {
      const request = await fetch("/api/availList");
      const response = await request.json();
      setAvailData(response);
      console.log(response);
    }
    FetchAvail();
  }, []);

//Get the data rows for the table
const rows = availData.map((row,index)=>({"id": index,"SKU":row.SKU,"Name":row.Name,"AvailableCage":row.AvailableCage,"AvailableRefurbCage":row.AvailableRefurbCage,"IDDear":row.IDDear,"DealerPrice":row.DealerPrice}))
console.log(rows)

//Setup the columns
const columns = [
  { field: 'id', headerName: 'ID', width: 40},
  { field: 'SKU', headerName: 'SKU', width: 70, disableColumnMenu: true, sortable: false},
  { field: 'Name', headerName: 'Name', width: 700 },
  { field: 'DealerPrice', headerName: 'Price (ex)', type: 'number', width: 90, align: "center"},
  { field: 'AvailableCage', headerName: 'Dealer Cage', type: 'number', width: 90, align: "center"},
  { field: 'AvailableRefurbCage', headerName: 'Refurb Cage', type: 'number', width: 90, align: "center"},
  { field: 'IDDear', headerName: 'View In Dear', width: 95, align: "center" ,renderCell:rowData=><button onClick={()=>window.open(`https://inventory.dearsystems.com/Product#${rowData.row.IDDear}`,'_blank', 'noopener,noreferrer')} class="flex w-full h-6 text-center justify-center rounded-md bg-indigo-600 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">CLICK</button>},
];

//Handle selected data
const onRowsSelectionHandler = (ids) => {
  const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
  SetSelectedDataTable(selectedRowsData)
  console.log(selectedRowsData);
};


//Render the HTML
  return (
    <div style={{ height: 700, width: '68%'}}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
          aggregation: {
            model: {
              DealerPrice: 'sum',
            },
          },
        }}
        pageSizeOptions={[25 ,50, 100]}
        checkboxSelection
        density="compact"
        disableRowSelectionOnClick
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
      />
    </div>
  );
}