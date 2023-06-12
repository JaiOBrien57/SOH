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
  },
});

export default function Prod_Creator() {

//Setup React variables
const [prodListData, SetProdListData] = React.useState([]);
const [gsmArenaData, SetgsmArenaData] = React.useState([])
const [selectedDataTable, SetSelectedDataTable] = React.useState([]);
const [contentLoaded, SetContentLoaded] = React.useState(true)
const [mainTableRowsCached, SetMainTableRowsCached] = React.useState([])
const [mainTableRows, SetMainTableRows] = React.useState([])
const [selectedTableRows, SetSelectedTableRows] = React.useState([])
const [pushDearButtonState, SetPushDearButtonState] = React.useState(false);
const [downloadDearButtonState, SetDownloadDearButtonState] = React.useState(false);
const [DearPushOpen, SetDearPushOpen] = React.useState(false)
const [dearPushStatus, SetDearPushStatus] = React.useState(0)
const [dearDataFetchedStatus, SetDearDataFetchedStatus] = React.useState(0)
const [ModelList, setModelList] = React.useState([])
const [GSMArenaModelList, SetGSMArenaModelList] = React.useState([])
const [DearModelSelect, SetDearModelSelect] = React.useState();
const delay = ms => new Promise(res => setTimeout(res, ms));
const apiRefMainTable = useGridApiRef();
const apiRefSelectTable = useGridApiRef();

//Get the Prod List
useEffect(() => {
  async function FetchAvail() {
    //Get Prod List From Server
    const request = await fetch("/api/prodList");
    const response = await request.json()

    //Handle Data Receiving
    if (response === "ERROR") {
      SetDearDataFetchedStatus(500)
      SetDearPushOpen(true)
      console.log("Back end Request failed")
    }if (response !== "ERROR") {
      SetDearDataFetchedStatus(0)
      SetProdListData(response);
      console.log("Prod List Response:",response);
    }

    //Get GSM Data From Server
    const requestGSMDeviceList = await fetch("/api/gsmArenaDeviceList");
    const responseGSMDeviceList = await requestGSMDeviceList.json()

    //Handle Data Receiving
    if (responseGSMDeviceList === "ERROR") {
      SetDearDataFetchedStatus(500)
      SetDearPushOpen(true)
      console.log("Back end Request failed")
    }if (responseGSMDeviceList !== "ERROR") {
      SetDearDataFetchedStatus(0)
      SetgsmArenaData(responseGSMDeviceList);
      console.log("GSM Arena Device List Response:",responseGSMDeviceList);
    }

    //Handle reload the data in the table
    if(responseGSMDeviceList !== "ERRROR" && response !== "ERROR"){
      SetContentLoaded(false)
    }

  }
  FetchAvail();
}, []);

//Set the state vars from the prod list
useEffect(() => {
  function SetMainTableRowsData() {
    //Set the prod List to cached prod list
    const rows = prodListData.map((row,index)=>({"id": index,"SKU":row.SKU,"Name":row.Name,"Brand":row.AdditionalAttribute1,"Model":row.AdditionalAttribute2,"GB":row.AdditionalAttribute3,"Colour":row.AdditionalAttribute4,"Connectivity":row.AdditionalAttribute5,"Battery":row.AdditionalAttribute6,"Grade":row.AdditionalAttribute7}))
    
    //Loop to get Models to choose
    const cacheArray = []
    const finalArray = []
    prodListData.forEach((row)=>{
      const Brand = row.AdditionalAttribute1
      const Model = row.AdditionalAttribute2
      const finalModel = Brand+" "+Model

      if(!cacheArray.includes(finalModel)){
        cacheArray.push(finalModel)
        finalArray.push({label:finalModel})
      }
    })

    finalArray.sort((a,b)=>{if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;})

    //Set the states
    SetMainTableRowsCached(rows)
    setModelList(finalArray)
  }
  SetMainTableRowsData();
}, [prodListData]);


//Set the state vars from GSM Arena Data
useEffect(() => {
  function SetMainTableRowsData() {
    //Loop to get Unique Data from GSM Arena Array
    const cacheArray = []
    const finalArray = []

    gsmArenaData.forEach((row)=>{
      const Model = row.Model
      if(!cacheArray.includes(Model)){
        cacheArray.push(Model)
        finalArray.push({label:Model})
      }
    })

    finalArray.sort((a,b)=>{if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;})

    //Set the states
    SetGSMArenaModelList(finalArray)
    console.log("GSM Arena Models Array Test:",finalArray)
  }
  SetMainTableRowsData();
}, [gsmArenaData]);


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
  { field: 'SKU', headerName: 'SKU', width: 70, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black",headerAlign: 'center',align: "center"},
  { field: 'Category', headerName: 'Category', width: 110, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'FinalModel', headerName: 'Name 📱', width: 350, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true},
  { field: 'Brand', headerName: 'Brand', width: 60, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Model', headerName: 'Model', width: 60, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'GB', headerName: 'GB', width: 60, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Colour', headerName: 'Colour', width: 130, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Connectivity', headerName: 'Connectivity', width: 110, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Battery', headerName: 'Battery', width: 100, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Grade', headerName: 'Grade', width: 60, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'DealerPrice', headerName: 'Dealer Price', type: 'number', width: 120,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true, valueFormatter: currencyFormatter},
  { field: 'CTDPrice', headerName: 'CTD Price', type: 'number', width: 120,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true, valueFormatter: currencyFormatter},
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


//Handle Dear Model Changed
const handleChange = (event,newValue) => {
  try{
    SetDearModelSelect((newValue.label));
    console.log("New Dear Model Selected By User:",newValue.label)
  }catch{
    SetDearModelSelect("")
  }
};


//Handle Clicking away from alert
const handleCloseAlert = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  SetDearPushOpen(false);
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
        Product Creator
      </div>
    
      <div style={{width: "100%", height: "fit-content"}} className="mb-2">

      <div style={{width: "30%",height:"100%", float:"left"}} className="mr-2">
        
      <FormControl style={{width: "49.2%",float: "left"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          value={DearModelSelect}
          options={ModelList}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} label="Dear Model" />}
        >
        </Autocomplete>
      </FormControl>

      <FormControl style={{width: "49.2%",float: "right"}} size="small" className="bg-white rounded">
        <Autocomplete
        disablePortal
          labelId="combo-box-demo"
          size="small"
          options={GSMArenaModelList}
          renderInput={(params) => <TextField {...params} label="GSM Arena Model" />}
        >
        </Autocomplete>
      </FormControl>

      </div>

      <ThemeProvider theme={theme}>
        <div style={{width: "10%", float: "left",height:"95%"}} className="pr-2">
        <LoadingButton onClick={""} loading={pushDearButtonState} variant="contained" color="primary" style={{width: "100%",height:"100%",float:"left"}} loadingPosition="start" startIcon={<DoubleArrowIcon />}>Generate</LoadingButton>
        </div>
        <div style={{width: "10%", float: "left",height:"95%"}} className="pr-2">
        <LoadingButton onClick={""} loading={pushDearButtonState} variant="contained" color="secondary" style={{width: "100%",height:"100%",float:"left"}} loadingPosition="start" startIcon={<DownloadIcon />}>Download</LoadingButton>
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
            },
          },
        }}
        checkboxSelection
        density="compact"
        disableRowSelectionOnClick 
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        apiRef={apiRefMainTable}
      />
    </div>

    </div>
  );
}