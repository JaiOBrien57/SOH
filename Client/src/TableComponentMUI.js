import { CSVLink, CSVDownload } from "react-csv";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarColumnsButton } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { useDemoData } from '@mui/x-data-grid-generator';
import { Link } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Select, initTE } from "tw-elements";
initTE({ Select });


export default function DataTable() {

//Setup React variables
const [availData, setAvailData] = React.useState([{"IDDear":"","SKU":"","Name":"","AvailableCage":"","AvailableRefurbCage":"","DealerPrice":""}]);
const [selectedDataTable, SetSelectedDataTable] = React.useState([{}]);
const [chosenActionType, SetChosenActionType] = React.useState({ChosenActionType: ""});
const [contentLoaded, SetContentLoaded] = React.useState(true)

  //Get the avail List
  useEffect(() => {
    async function FetchAvail() {
      const request = await fetch("/api/availList");
      const response = await request.json();
      setAvailData(response);
      SetContentLoaded(false)
      console.log(response);
    }
    FetchAvail();
  }, []);

//Get data for SOH table
const rows = availData.map((row,index)=>({"id": index,"SKU":row.SKU,"Name":row.Name,"AvailableCage":row.AvailableCage,"AvailableRefurbCage":row.AvailableRefurbCage,"IDDear":row.IDDear,"DealerPrice":row.DealerPrice}))

//Get data for Selected Table
const rowsSelected = selectedDataTable.map((row,index)=>({"id": index,"SKU":row.SKU,"Name":row.Name}))

//Format as currency
const currencyFormatter = (params) => {
  return '$' + (params.value);
};

//Setup the columns for SOH Table
const columns = [
  { field: 'id', headerName: 'ID', width: 40, headerClassName: "bg-white text-black", cellClassName: "text-black", disableColumnMenu: true, sortable: false, disableExport: true},
  { field: 'SKU', headerName: 'SKU', width: 70, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black", renderCell:rowData=><Link href={`https://inventory.dearsystems.com/Product#${rowData.row.IDDear}`} target="_blank">{rowData.row.SKU}</Link>},
  { field: 'Name', headerName: 'Name 📱', width: 700, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true},
  { field: 'DealerPrice', headerName: 'Price (ex)', type: 'number', width: 90, align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true, valueFormatter: currencyFormatter},
  { field: 'AvailableCage', headerName: 'Dealer Cage', type: 'number', width: 100, align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true},
  { field: 'AvailableRefurbCage', headerName: 'Refurb Cage', type: 'number', width: 100, align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true},
  { field: 'IDDear', headerName: 'Product ID', width: 105 ,align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black", disableColumnMenu: true ,sortable: false,disableExport: true},
];

//Setup the columns for Selected Table
const columnsSelected = [
  { field: 'id', headerName: '#', width: 40, headerClassName: "bg-white text-black", cellClassName: "text-black", disableColumnMenu: true, sortable: false,disableExport: true},
  { field: 'SKU', headerName: 'SKU', width: 70, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black"},
  { field: 'Name', headerName: 'Name 📱', width: 600, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black"},
];

//Handle selected data
const onRowsSelectionHandler = (ids) => {
  const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
  SetSelectedDataTable(selectedRowsData)
  console.log(selectedRowsData);
};

//Handle selected action type
const ActionTypeChange = (event) => {
  const valueSet = event.target.value;
  SetChosenActionType({ChosenActionType: valueSet});
  console.log("Action Type Changed")
}

//Menu For Main SOH Table
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

//Menu For Selected Table
function CustomToolbarSelect() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      <GridToolbarColumnsButton />
    </GridToolbarContainer>
  );
}


//Render the HTML
  return (
    <div>

      <div className='W-max h-max'>
      <div style={{width: "75.94%", float: "left"}} className="bg-white ml-5 h-7 mt-3 rounded text-black border border-gray-300 text-center text-lg shadow-md font-semibold">
        Stock On Hand
      </div>
      <div style={{width: "21%", float: "left"}} className="bg-white ml-5 h-7 mt-3 mb-1 rounded text-black border border-gray-300 text-center text-lg shadow-md font-semibold">
        Selected
      </div>
      </div>

    <div style={{ height: 730, width: '78%', float: "left"}} className='px-5 py-1'>
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
        slots={{
          toolbar: CustomToolbar,
          loadingOverlay: LinearProgress,
        }}
        loading={contentLoaded}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
          columns: {
            columnVisibilityModel: {
              id: false,
              IDDear: false,
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

    <div style={{width: "10.39%", float: "left"}} className="bg-white mb-1 ml-0 h-7 mt-1 rounded text-black border border-gray-300 px-2 py-1 text-left text-sm shadow-md font-semibold">
        Action:
      </div>
        
      <select onChange={ActionTypeChange} value={chosenActionType.ChosenActionType} style={{width: "10.5%", height: 28, float: "left"}} className="mb-1 ml-1 mt-1 block rounded-md border-gray-300 shadow-md px-2.5 text-stone-950 text-center ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 bg-white outline-0">
        <option key={1} value={"Transfer"}>Transfer</option>
        <option key={2} value={"Sale"}>Sale</option>
    </select>
  
      <button style={{width: "10.39%", height: "27%", float: "left"}} class="ml-0 mt-1.5 flex text-center justify-center border-gray-300 shadow-md rounded-md bg-purple-500 text-sm font-semibold leading-6 text-white hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Push To Dear
      </button>

      <button style={{width: "10.5%", height: "27%", float: "left"}} class="ml-1 mt-1.5 flex text-center justify-center border-gray-300 shadow-md rounded-md bg-green-500 text-sm font-semibold leading-6 text-white hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Download CSV
      </button>
   
   
    <div style={{ height: 655.35, width: '21%', float: 'left'}} className='px-0.1 py-1 mt-2 mb-1'>
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
        slots={{
          toolbar: CustomToolbarSelect,
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

    {/* <CSVLink data={csvData} style={{width: "5%", height: "27%", float: "left"}} class="ml-5 flex text-center justify-center border-gray-300 shadow-md rounded-md bg-green-500 text-sm font-semibold leading-6 text-white hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Export CSV
      </CSVLink > */}

    </div>
  );
}