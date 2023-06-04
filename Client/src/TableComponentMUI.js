import { CSVLink, CSVDownload } from "react-csv";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarColumnsButton,GridCellParams,GridCellEditStopReasons  } from '@mui/x-data-grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import LinearProgress from '@mui/material/LinearProgress';
import { useDemoData } from '@mui/x-data-grid-generator';
import { Link } from "@mui/material";
import React, { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import { Select, initTE } from "tw-elements";
// initTE({ Select });
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import DownloadIcon from '@mui/icons-material/Download';

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#0971f1',
      darker: '#053e85',
    },
    purple: {
      main: '#7e57c2',
      darker: '#053e85',
      contrastText: '#fff',
    },
  },
});


export default function DataTable() {

//Setup React variables
const [availData, setAvailData] = React.useState([{"IDDear":"","SKU":"","Name":"","AvailableCage":"","AvailableRefurbCage":"","DealerPrice":""}]);
const [selectedDataTable, SetSelectedDataTable] = React.useState([{}]);
const [chosenActionType, SetChosenActionType] = React.useState({ChosenActionType: ""});
const [contentLoaded, SetContentLoaded] = React.useState(true)
const [mainTableRows, SetMainTableRows] = React.useState([{"id":""}])
const [selectedTableRows, SetSelectedTableRows] = React.useState([{"id":""}])
const [saleTransferButton, SetSaleTransferButton] = React.useState('');
const [pushDearButtonState, SetPushDearButtonState] = React.useState(false);
const [downloadDearButtonState, SetDownloadDearButtonState] = React.useState(false);
const delay = ms => new Promise(res => setTimeout(res, ms));

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

//Set the rows state for the Main Table
useEffect(() => {
  function SetMainTableRowsData() {
    const rows = availData.map((row,index)=>({"id": index,"SKU":row.SKU,"Name":row.Name,"AvailableCage":row.AvailableCage,"AvailableRefurbCage":row.AvailableRefurbCage,"IDDear":row.IDDear,"DealerPrice":row.DealerPrice,"TotalQTY":row.TotalQTY}))
    SetMainTableRows(rows)
    console.log(rows)
  }
  SetMainTableRowsData();
}, [availData]);


//Set the rows state for the selected Table
useEffect(() => {
  function SetSelectedTableRowsData() {
    const rows = selectedDataTable.map((row,index)=>({"id": index,"SKU":row.SKU,"Name":row.Name,"Price":row.DealerPrice,"TotalQTY":row.TotalQTY}))
    SetSelectedTableRows(rows)
    console.log(rows)
  }
  SetSelectedTableRowsData();
}, [selectedDataTable]);


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
  { field: 'AvailableCage', headerName: 'Dealer Cage', type: 'number', width: 100, align: "center", headerClassName: "bg-white text-black",disableColumnMenu: true, cellClassName: (params) => {if (params.value == null) {return '';} return clsx('super-app', {negative: params.value === 0, positive: params.value > 0,})}},
  { field: 'AvailableRefurbCage', headerName: 'Refurb Cage', type: 'number', width: 100, align: "center", headerClassName: "bg-white text-black",disableColumnMenu: true, cellClassName: (params) => {if (params.value == null) {return '';} return clsx('super-app', {negative: params.value === 0, positive: params.value > 0,})}},
  { field: 'IDDear', headerName: 'Product ID', width: 105 ,align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black", disableColumnMenu: true ,sortable: false,disableExport: true},
  { field: 'TotalQTY', headerName: 'TotalQTY', width: 40,type: 'number', headerClassName: "bg-white text-black", cellClassName: "text-black", disableColumnMenu: true, sortable: false, disableExport: true},
];

//Setup the columns for Selected Table
const columnsSelected = [
  { field: 'id', headerName: '#', width: 40, headerClassName: "bg-white text-black", cellClassName: "text-black", disableColumnMenu: true, sortable: false,disableExport: true, align: "center"},
  { field: 'SKU', headerName: 'SKU', width: 70, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black"},
  { field: 'Name', headerName: 'Name 📱', width: 600, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black"},
  { field: 'Price', headerName: 'Price (ex)', width: 90, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black", editable: true, align: "center"},
  { field: 'TotalQTY', headerName: 'QTY', width: 40, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black", editable: true, align: "center"}
];

//Set the select table rows after cell edit
const handleCellEditChangePrice = (params, event) => {
  const { id, field, value, api } = params;
  const updatedRows = selectedTableRows.map((row) => {
    if (row.id === id) {
      return { ...params };
    }
    return row;
  });
  SetSelectedTableRows(updatedRows);
  console.log(updatedRows)
  return(params)
};

//Handle error for select table cell edit
const handleRowUpdateErrorPrice = (params, error) => {
  console.error('An error occurred while updating the row:', params);
  return(params)
};

//Handle Push Dear Button
const handlePushDear = async () =>{
  SetPushDearButtonState(true)
  await delay(5000)
  SetPushDearButtonState(false)
}

//Handle Download Dear Button
const handleDownloadDear = async () =>{
  SetDownloadDearButtonState(true)
  await delay(5000)
  SetDownloadDearButtonState(false)
}

//Handle selected data
const onRowsSelectionHandler = (ids) => {
  const selectedRowsData = ids.map((id) => mainTableRows.find((row) => row.id === id));
  SetSelectedDataTable(selectedRowsData)
  console.log(selectedRowsData);
};

//Handle selected action type
const handleChange = (event) => {
  SetSaleTransferButton(event.target.value);
};

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

//Hidden column filter fields from main table
const hiddenFieldsMainTable = ['id', 'IDDear',"TotalQTY"];

const getTogglableColumns = (columns) => {
  return columns
    .filter((column) => !hiddenFieldsMainTable.includes(column.field))
    .map((column) => column.field);
};


//Render the HTML
  return (
    <div style={{height: "83vh"}}>

    <div style={{ height: "100%", width: '78%', float: "left"}} className='px-5 py-1 mt-3 flexParent'>

    <div style={{width: "100%", float: "left"}} className="bg-white mb-2 h-7 rounded text-black border border-gray-300 text-center text-lg shadow-md font-semibold">
        Stock On Hand
      </div>

      <DataGrid
        className='bg-white flexChild'
        sx={{
          boxShadow: 1,
          border: 1,
          borderColor: '#d1d5db',
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f3f4f6',
          },
          '& .super-app.negative': {
            color: '#dc2626',
            fontWeight: '500',
          },
          '& .super-app.positive': {
            color: '#16a34a',
            fontWeight: '500',
          },
        }}
        slots={{
          toolbar: CustomToolbar,
          loadingOverlay: LinearProgress,
        }}
        slotProps={{
          columnsPanel: {
            getTogglableColumns,
          },
        }}
        loading={contentLoaded}
        rows={mainTableRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
          columns: {
            columnVisibilityModel: {
              id: false,
              IDDear: false,
              TotalQTY: false,
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


    <div style={{ height: "100%", width: '21%', float: 'left'}} className=' py-1 mt-3 flexParent'>

    <div style={{width: "100%", float: "left"}} className="bg-white mb-2 h-7 rounded text-black border border-gray-300 text-center text-lg shadow-md font-semibold">
        Selected
      </div>

      <div style={{width: "100%"}} className="mb-2 h-max">
      <FormControl style={{width: "50%",height: "100%",float: "left"}} size="small" className="bg-white rounded">
        <InputLabel id="demo-select-small-label">Action</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={saleTransferButton}
          label="Action"
          onChange={handleChange}
        >
          <MenuItem value={"Sale"}>Sale</MenuItem>
          <MenuItem value={"Transfer"}>Transfer</MenuItem>
        </Select>
      </FormControl>

      <ThemeProvider theme={theme}>
      <ButtonGroup
      disableElevation
      variant="contained"
      aria-label="Disabled elevation buttons"
      style={{width: "48%",height: "100%",float: "right"}}
    >
      <LoadingButton onClick={handlePushDear} loading={pushDearButtonState} variant="contained" color="secondary" style={{width: "50%"}} loadingPosition="start" startIcon={<DoubleArrowIcon />}>PUSH</LoadingButton>
      <LoadingButton onClick={handleDownloadDear} loading={downloadDearButtonState} variant="contained" color="primary" style={{width: "50%"}} loadingPosition="start" startIcon={<DownloadIcon />}>CSV</LoadingButton>
    </ButtonGroup>
    </ThemeProvider>
      </div>

      <DataGrid
        className='bg-white flexChild'
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
        getRowId={(row) => row.id}
        experimentalFeatures={{ newEditingApi: true }}
        onProcessRowUpdateError={handleRowUpdateErrorPrice}
        processRowUpdate={handleCellEditChangePrice}
        rows={selectedTableRows}
        columns={columnsSelected}
        isCellEditable={(params) => params.row.Price}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
          columns: {
            columnVisibilityModel: {
              Name: false,
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