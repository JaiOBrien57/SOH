import { CSVLink, CSVDownload } from "react-csv";
import { DataGrid,GridActionsCellItem, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarColumnsButton,GridCellParams,GridCellEditStopReasons,GridValueGetterParams,GridValueSetterParams,gridPageCountSelector,GridPagination,useGridApiContext,useGridSelector,useGridApiRef  } from '@mui/x-data-grid';
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
import { Link, Typography } from "@mui/material";
import React, { useEffect, useState, Component } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import DownloadIcon from '@mui/icons-material/Download';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import MuiPagination from '@mui/material/Pagination';
import TablePagination from '@mui/material/TablePagination';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { json } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';


const theme = createTheme({
  //Main Themes
  status: {
    danger: '#e53e3e',
  },
  palette: {
    secondary: {
      main: '#0971f1',
      darker: '#053e85',
    },
    purple: {
      main: '#7e57c2',
      darker: '#053e85',
      contrastText: '#fff',
    },
    primary: {
      main: '#14b8a6',
      darker: '#042f2e',
      contrastText: '#fff',
    },
    Error: {
      main: '#ef5350',
      darker: '#c62828',
      contrastText: '#fff',
    },
  },
});

export default function Prod_Creator() {

//Setup React variables
const [prodListData, SetProdListData] = React.useState([]);
const [selectedDataTable, SetSelectedDataTable] = React.useState([]);
const [contentLoaded, SetContentLoaded] = React.useState(true)
const [mainTableRowsCached, SetMainTableRowsCached] = React.useState([])
const [mainTableRows, SetMainTableRows] = React.useState([])
const [selectedTableRows, SetSelectedTableRows] = React.useState([])
const [pushDearButtonState, SetPushDearButtonState] = React.useState(false);
const [generateButtonState, SetGenerateButtonState] = React.useState(false);
const [DearPushOpen, SetDearPushOpen] = React.useState(false)
const [dearPushStatus, SetDearPushStatus] = React.useState(0)
const [actionButtonState, SetActionButtonState] = React.useState("")
const [dearDataFetchedStatus, SetDearDataFetchedStatus] = React.useState(0)
const [ModelList, setModelList] = React.useState([])
const [DearModelSelect, SetDearModelSelect] = React.useState("");
const delay = ms => new Promise(res => setTimeout(res, ms));
const apiRefMain = useGridApiRef();

//Get the avail List
useEffect(() => {
  async function FetchProd() {
    const request = await fetch("/api/prodList_SOH_Settings");
    const response = await request.json()
    if (response === "ERROR") {
      SetDearDataFetchedStatus(500)
      SetDearPushOpen(true)
      console.log("Back end Request failed")
    }if (response !== "ERROR") {
      SetDearDataFetchedStatus(0)
      SetProdListData(response);
      SetContentLoaded(false)
      console.log(response);
    }
  }
  FetchProd();
}, []);


//Set the rows state for the Main Table
useEffect(() => {
  function SetMainTableRowsData() {
    const rows = prodListData.map((row,index)=>({"id": index,"FullModel":row.FullModel,"Brand":row.Brand,"Model":row.Model,"GB":row.GB,"AVGCost":row.AVGCage,"AVGPriceTier":row.PriceTierAVG,"BXT_Lowest_Price":row.BXT_Lowest_Price}))
    SetMainTableRows(rows)
    console.log(rows)
  }
  SetMainTableRowsData();
}, [prodListData]);


//Set the Main Table rows after cell edit
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

//Handle error for Main Table cell edit
const handleRowUpdateErrorPrice = (params, error) => {
  console.error('An error occurred while updating the row:', params);
  return(params)
};

//Format as currency
const currencyFormatter = (params) => {
  if (params.value == "" || params.value == "$" || params.value == null) {
    return '$' + (0)
  }if (params.value != "" && params.value != "$") {
    return '$' + parseFloat((params.value)).toFixed(2);
  }
};


//Setup the columns for SOH Table
const columns = [
  { field: 'FullModel', headerName: 'Full Model', width: 350, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'left',align: "left"},
  { field: 'Brand', headerName: 'Brand', width: 90, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Model', headerName: 'Model', width: 190, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'GB', headerName: 'GB', width: 150, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'DealerPrice', headerName: 'Dealer Price', type: 'number', width: 120,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true, valueFormatter: currencyFormatter},
  { field: 'AVGCost', headerName: 'AVG-C (ex)', type: 'number', width: 100,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true, valueFormatter: currencyFormatter},
  { field: 'AVGPriceTier', headerName: 'AVG (ex)', type: 'number', width: 90,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true, valueFormatter: currencyFormatter},
  { field: 'BXT_Lowest_Price', headerName: 'BXT Lowest', width: 100,type: 'number' ,disableColumnMenu: true, sortable: true, headerClassName: "bg-white text-black", cellClassName: "text-black", editable: true,headerAlign: 'center',align: "center",valueFormatter: currencyFormatter},
];

//Handle Popup alert
const PopUpAlert = () => {
if (dearDataFetchedStatus === 500) {
    return <Snackbar open={DearPushOpen} autoHideDuration={100} anchorOrigin={{vertical: "top",horizontal: "center"}}>
    <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%'}}>
      <AlertTitle>Error</AlertTitle>
      <Typography>DEAR Data Failed To Fetch, Reload Page To Try Again</Typography>
    </Alert>
  </Snackbar>
  }
}

//Handle selected data
const onRowsSelectionHandler = (ids) => {
  const selectedRowsData = ids.map((id) => mainTableRows.find((row) => row.id === id));
  SetSelectedDataTable(selectedRowsData)
  console.log(selectedRowsData);
};

//Handle Generate Button Click
const handlePressClickPush = () => {
  async function PushToDataBaseOrClear() {
    SetGenerateButtonState(true)
    //Send the Table Data with Changes To Data Base

    SetGenerateButtonState(false)
  }
  PushToDataBaseOrClear()
}


//Handle Clicking away from alert
const handleCloseAlert = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  SetDearPushOpen(false);
};


//Handle selected action type
const handleChange = (event) => {
  SetActionButtonState(event.target.value);
};


//Menu For Main SOH Table
function CustomToolbar() {
  return (
    <ThemeProvider theme={theme}>
    <GridToolbarContainer>
      <GridToolbarExport/>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
    </ThemeProvider>
  );
}


//Custom Footer For Main Table
function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}

function CustomPagination(props) {
  return (
  <ThemeProvider theme={theme}>
    
    <Typography>ADD Price SUM HERE</Typography >
    <Typography>ADD QTY SUM HERE</Typography >

    <GridPagination ActionsComponent={Pagination} {...props} />

  </ThemeProvider>
  )
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

    <PopUpAlert/>
    
    <div style={{ height: "100%", width: '100%', float: "left"}} className='flexParent'>

    <div style={{width: "100%", float: "left"}} className="bg-white mb-2 h-7 rounded text-gray-600 border border-gray-300 text-center text-lg shadow-md font-semibold">
        Variables
      </div>
    
    <div style={{width: "17.6%", float: "left"}} className="bg-white mb-3 h-7 rounded text-gray-600 border border-gray-300 text-center text-lg shadow-md font-semibold">
        Action Buttons
      </div>

      <div style={{width: "100%", height: "fit-content"}} className="mb-2">

      <ThemeProvider theme={theme}>
        <div style={{width: "9%", float: "left",height:"95%"}} className="pr-2">
        <LoadingButton onClick={handlePressClickPush} loading={generateButtonState} variant="contained" color="primary" style={{width: "100%",height:"100%",float:"left"}} loadingPosition="start" startIcon={<DoubleArrowIcon />}>Push</LoadingButton>
        </div>
        <div style={{width: "9%", float: "left",height:"95%"}} className="pr-2">
        <LoadingButton onClick={""} loading={generateButtonState} variant="contained" color="Error" sx={{":hover": {bgcolor: "#c62828",color: "white"}}}  style={{width: "100%",height:"100%",float:"left"}} loadingPosition="start" startIcon={<DeleteIcon />}>Clear</LoadingButton>
        </div>
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
          '& .super-app.negative': {
            color: '#dc2626',
            fontWeight: '500',
          },
          '& .super-app.positive': {
            color: '#16a34a',
            fontWeight: '500',
          },
          '& .css-9etbgb-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected': {
            color: "#ffffff"
          },
        }}
        pagination
        slots={{
          toolbar: CustomToolbar,
          loadingOverlay: LinearProgress,
          pagination: CustomPagination,
        }}
        slotProps={{
          columnsPanel: {
            getTogglableColumns,
          },
        }}
        pageSizeOptions={[]}
        loading={contentLoaded}
        rows={mainTableRows}
        columns={columns}
        initialState={{
            ...mainTableRows.initialState,
          pagination: { paginationModel: { pageSize: 100 } },
          columns: {
            columnVisibilityModel: {
              FullModel: false,
            },
          },
        }}
        checkboxSelection
        onProcessRowUpdateError={handleRowUpdateErrorPrice}
        processRowUpdate={handleCellEditChangePrice}
        density="compact"
        disableRowSelectionOnClick 
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        apiRef={apiRefMain}
      />
    </div>

    </div>
  );
}