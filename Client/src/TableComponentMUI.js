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

//Get data for SOH table
const rows = availData.map((row,index)=>({"id": index,"SKU":row.SKU,"Name":row.Name,"AvailableCage":row.AvailableCage,"AvailableRefurbCage":row.AvailableRefurbCage,"IDDear":row.IDDear,"DealerPrice":row.DealerPrice}))

//Get data for Selected Table
const rowsSelected = selectedDataTable.map((row,index)=>({"id": index,"SKU":row.SKU}))

//Format as currency
const currencyFormatter = (params) => {
  return '$' + (params.value);
};

//Setup the columns for SOH Table
const columns = [
  { field: 'id', headerName: 'ID', width: 40, headerClassName: "bg-white text-black", cellClassName: "text-black", disableColumnMenu: true, sortable: false},
  { field: 'SKU', headerName: 'SKU', width: 70, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black"},
  { field: 'Name', headerName: 'Name 📱', width: 700, headerClassName: "bg-white text-black", cellClassName: "text-black"},
  { field: 'DealerPrice', headerName: 'Price (ex)', type: 'number', width: 90, align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black", valueFormatter: currencyFormatter},
  { field: 'AvailableCage', headerName: 'Dealer Cage', type: 'number', width: 90, align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black"},
  { field: 'AvailableRefurbCage', headerName: 'Refurb Cage', type: 'number', width: 90, align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black"},
  { field: 'IDDear', headerName: 'View In Dear', width: 105 ,align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black", disableColumnMenu: true ,sortable: false,renderCell:rowData=><button onClick={()=>window.open(`https://inventory.dearsystems.com/Product#${rowData.row.IDDear}`,'_blank', 'noopener,noreferrer')} class="flex w-full h-6 text-center justify-center rounded-md bg-blue-500 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">DEAR</button>},
];

//Setup the columns for Selected Table
const columnsSelected = [
  { field: 'id', headerName: '#', width: 40, headerClassName: "bg-white text-black", cellClassName: "text-black", disableColumnMenu: true, sortable: false},
  { field: 'SKU', headerName: 'SKU', width: 70, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black"},
];

//Handle selected data
const onRowsSelectionHandler = (ids) => {
  const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
  SetSelectedDataTable(selectedRowsData)
  console.log(selectedRowsData);
};


//Render the HTML
  return (
    <div>
    <div style={{ height: 815, width: '78%', float: "left"}} className='px-5 py-1 mt-3'>
      <DataGrid
        className='bg-white'
        sx={{
          boxShadow: 1,
          border: 1,
          borderColor: '#d1d5db',
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f3f4f6',
          },
        }}
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
  
    <div style={{ height: 815, width: '21%', float: 'left'}} className='px-0.1 py-1 mt-3'>
      <DataGrid
        className='bg-white'
        sx={{
          boxShadow: 1,
          border: 1,
          borderColor: '#d1d5db',
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f3f4f6',
          },
        }}
        rows={rowsSelected}
        columns={columnsSelected}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
          columns: {
            columnVisibilityModel: {
            },
          },
          aggregation: {
            model: {
              DealerPrice: 'sum',
            },
          },
        }}
        pageSizeOptions={[25 ,50, 100]}
        density="compact"
        disableRowSelectionOnClick 
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
      />
    </div>
    </div>
  );
}