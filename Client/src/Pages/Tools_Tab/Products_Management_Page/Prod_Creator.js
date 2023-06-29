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
import CircularProgress from '@mui/material/CircularProgress';
import { json } from "react-router-dom";
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';


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

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function Prod_Creator() {

//Setup React variables
const [prodListData, SetProdListData] = React.useState([]);
const [gsmArenaData, SetgsmArenaData] = React.useState([])
const [selectedDataTable, SetSelectedDataTable] = React.useState([]);
const [contentLoaded, SetContentLoaded] = React.useState(true)
const [GSMReturnedColours, SetGSMReturnedColours] = React.useState([])
const [GSMReturnedCapacitys, SetGSMReturnedCapacitys] = React.useState([])
const [mainTableRowsCached, SetMainTableRowsCached] = React.useState([])
const [mainTableRows, SetMainTableRows] = React.useState([])
const [selectedTableRows, SetSelectedTableRows] = React.useState([])
const [pushDearButtonState, SetPushDearButtonState] = React.useState(false);
const [generateButtonState, SetGenerateButtonState] = React.useState(false);
const [DearPushOpen, SetDearPushOpen] = React.useState(false)
const [dearPushStatus, SetDearPushStatus] = React.useState(0)
const [dearDataFetchedStatus, SetDearDataFetchedStatus] = React.useState(0)
const [ModelList, setModelList] = React.useState([])
const [GSMArenaModelList, SetGSMArenaModelList] = React.useState([])
const [DearModelSelect, SetDearModelSelect] = React.useState("");
const [GSMModelSelect, SetGSMModelSelect] = React.useState({"Model":""});
//Select Attributes Colours
const [ColourSelect1,SetColourSelect1] = React.useState("")
const [ColourSelect2,SetColourSelect2] = React.useState("")
const [ColourSelect3,SetColourSelect3] = React.useState("")
const [ColourSelect4,SetColourSelect4] = React.useState("")
const [ColourSelect5,SetColourSelect5] = React.useState("")
const [ColourSelect6,SetColourSelect6] = React.useState("")
//Select Attributes GBS
const [GBSelect1,SetGBSelect1] = React.useState("")
const [GBSelect2,SetGBSelect2] = React.useState("")
const [GBSelect3,SetGBSelect3] = React.useState("")
const [GBSelect4,SetGBSelect4] = React.useState("")
const [GBSelect5,SetGBSelect5] = React.useState("")
const [GBSelect6,SetGBSelect6] = React.useState("")
//Sates For Transfer List
const [checked, setChecked] = React.useState([]);
const [left, setLeft] = React.useState([]);
const [right, setRight] = React.useState(["Cosmic Black","Red"]);
const leftChecked = intersection(checked, left);
const rightChecked = intersection(checked, right);

const delay = ms => new Promise(res => setTimeout(res, ms));
const apiRefMain = useGridApiRef();

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
    console.log("GSM Arena Models Array:",finalArray)
  }
  SetMainTableRowsData();
}, [gsmArenaData]);


//Handle Attribute AutoFill on GSM Arena Model Change
useEffect(() => {
  async function FetchAttributesGSM() {
    //Request Server For Attributes
    if(GSMModelSelect.Model !== ""){
      //Clear the Attributes
      SetColourSelect1("")
      SetColourSelect2("")
      SetColourSelect3("")
      SetColourSelect4("")
      SetColourSelect5("")
      SetColourSelect6("")
      SetGBSelect1("")
      SetGBSelect2("")
      SetGBSelect3("")
      SetGBSelect4("")
      SetGBSelect5("")
      SetGBSelect6("")
      //Make the request to Server
      const GSMModelKey = GSMModelSelect.GSMKey
      const request = await fetch("/api/ProductManagement_GSMAttributes_AutoFill",{method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify({"GSMKey":GSMModelKey})})
      const response = await request.json()
      const FormattedColours = response.Colours.map((row)=>({label:row}))
      const FormattedCapacitys = response.GBS.map((row)=>({label:row}))
      console.log("Attributes GSM Returned",GSMModelKey,response)
      setLeft(response.Colours)
      SetGSMReturnedColours(FormattedColours)
      SetGSMReturnedCapacitys(FormattedCapacitys)
      //Auto Fill the select boxes
      SetColourSelect1(FormattedColours[0])
      SetColourSelect2(FormattedColours[1])
      SetColourSelect3(FormattedColours[2])
      SetColourSelect4(FormattedColours[3])
      SetColourSelect5(FormattedColours[4])
      SetColourSelect6(FormattedColours[5])
      SetGBSelect1(FormattedCapacitys[0])
      SetGBSelect2(FormattedCapacitys[1])
      SetGBSelect3(FormattedCapacitys[2])
      SetGBSelect4(FormattedCapacitys[3])
      SetGBSelect5(FormattedCapacitys[4])
      SetGBSelect6(FormattedCapacitys[5])
    }
  }
  FetchAttributesGSM();
}, [GSMModelSelect]);



//Format as currency
const currencyFormatter = (params) => {
  if (params.value === "" || params.value === "$" || params.value == null) {
    return '$' + (0)
  }if (params.value !== "" && params.value !== "$") {
    return '$' + parseFloat((params.value)).toFixed(2);
  }
};


//Setup the columns for SOH Table
const columns = [
  { field: 'SKU', headerName: 'SKU', width: 70, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black",headerAlign: 'center',align: "center"},
  { field: 'Category', headerName: 'Category', width: 110, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'FinalModel', headerName: 'Name 📱', width: 350, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true},
  { field: 'Brand', headerName: 'Brand', width: 90, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Model', headerName: 'Model', width: 150, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'GB', headerName: 'GB', width: 70, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Colour', headerName: 'Colour', width: 160, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Connectivity', headerName: 'Connectivity', width: 100, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
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
const handleChangeModelDearSelect = (event,newValue) => {
    try{
      if(newValue.label !== undefined){
        SetDearModelSelect(newValue.label);
        console.log("New Dear Model Selected By User:",newValue.label)
      }if(newValue.label === undefined){
        SetDearModelSelect(newValue);
        console.log("New Dear Model Selected By User:",newValue)
      }
    }
    catch{
      SetDearModelSelect("");
      SetGSMModelSelect({"Model":""})
      console.log("Dear Model Cleared By User")
    }

    try{
      const FilteredGSMModel = GSMArenaModelList.filter((row)=>row.label === newValue.label)[0].label
      const KeyGSMModelSelected = gsmArenaData.filter((row)=>row.Model === newValue.label)[0].GSMKey
      SetGSMModelSelect({"Model":FilteredGSMModel,"GSMKey":KeyGSMModelSelected})
      console.log("GSM AUTO Matched Model:",FilteredGSMModel)
    }catch{
      console.log("Dear Model to GSM Model Select Fail")
    }
};


//Handle Dear Model Changed
const handleChangeGSMModelSelect = (event,newValue) => {
  try{
    const KeyGSMModelSelected = gsmArenaData.filter(row=>row.Model === newValue.label)[0].GSMKey
    SetGSMModelSelect({"Model":newValue.label,"GSMKey":KeyGSMModelSelected});
    console.log("New GSM Arena Value Selected By User:",newValue.label)
  }catch{
    SetGSMModelSelect({"Model":""});
    console.log("GSM Arena Value Cleared By User")
  }
};


//Handle Generate Button Click
const handleGenerateClick = () => {
  async function FetchServerGSMModelVariants() {
    SetGenerateButtonState(true)
    //Push Data to Server
    const GSMModelKey = gsmArenaData.filter((row) => row.Model === GSMModelSelect)[0].GSMKey
    const request = await fetch("/api/GetGSMArenaVariantsSpecificModel",{method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify({"GSMModel":GSMModelSelect,"GSMModelKey":GSMModelKey,"DearModel":DearModelSelect})});
    const response = await request.json()
    console.log("GSM v Prod List Data Returned:",response)
    const FormatMainTableRows = response.VariantsNotExisting.map((row,index)=>({"id":index,"Brand":row.Brand,"Model":row.Model,"GB":row.GB,"Colour":row.Colour,"Connectivity":row.Connectivity,"Battery":row.Battery,"Grade":row.Grade}))
    SetMainTableRows(FormatMainTableRows)
    SetGenerateButtonState(false)
    console.log(FormatMainTableRows)
  }
  FetchServerGSMModelVariants()
}


//Handle Generate Button Click Updated
const handleGenerateClickUpdated = () => {
  async function FetchServerGSMModelVariants() {
    SetGenerateButtonState(false)
    //Format the data
    const ColoursRaw = [ColourSelect1,ColourSelect2,ColourSelect3,ColourSelect4,ColourSelect5,ColourSelect6]
    const GBRaw = [GBSelect1,GBSelect2,GBSelect3,GBSelect4,GBSelect5,GBSelect6]
    const Colours = []
    const GBS = []
    ColoursRaw.forEach((row)=>{
      try{
        Colours.push(row.label)
      }catch{
      }
    })
    GBRaw.forEach((row)=>{
      try{
        GBS.push(row.label)
      }catch{
      }
    })

    const DataToSendToBackend = {"Colours":Colours,"GBS":GBS,"Model":DearModelSelect}
    console.log("Data Sending Backend - Generate Button",DataToSendToBackend)
    //Push Data to Server
    const request = await fetch("/api/Prod_Management_GetModelsToCreate",{method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify(DataToSendToBackend)})
    const response = await request.json()
    console.log("Data Returned From Frontend:",response)
  }
  FetchServerGSMModelVariants()
}


//Handle Value Changes For Select Attribute Boxes
//Colour 1 Select
const handleChangeColourSelect1 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Colour Attribute 1 Changed - Options",Model)
      SetColourSelect1(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Colour Attribute 1 Changed - Typed Value",Model)
      SetColourSelect1(Model)
    }
  }catch{
    console.log("Colour Attribute 1 Cleared")
    SetColourSelect1("")
  }
};
//Colour 2 Select
const handleChangeColourSelect2 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Colour Attribute 2 Changed",Model)
      SetColourSelect2(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Colour Attribute 2 Changed",Model)
      SetColourSelect2(Model)
    }
  }catch{
    console.log("Colour Attribute 2 Cleared")
    SetColourSelect2("")
  }
};
//Colour 3 Select
const handleChangeColourSelect3 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Colour Attribute 3 Changed",Model)
      SetColourSelect3(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Colour Attribute 3 Changed",Model)
      SetColourSelect3(Model)
    }
  }catch{
    console.log("Colour Attribute 3 Cleared")
    SetColourSelect3("")
  }
};
//Colour 4 Select
const handleChangeColourSelect4 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Colour Attribute 4 Changed",Model)
      SetColourSelect4(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Colour Attribute 4 Changed",Model)
      SetColourSelect4(Model)
    }
  }catch{
    console.log("Colour Attribute 4 Cleared")
    SetColourSelect4("")
  }
};
//Colour 4 Select
const handleChangeColourSelect5 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Colour Attribute 5 Changed",Model)
      SetColourSelect5(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Colour Attribute 5 Changed",Model)
      SetColourSelect5(Model)
    }
  }catch{
    console.log("Colour Attribute 5 Cleared")
    SetColourSelect5("")
  }
};
//Colour 4 Select
const handleChangeColourSelect6 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Colour Attribute 6 Changed",Model)
      SetColourSelect6(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Colour Attribute 6 Changed",Model)
      SetColourSelect6(Model)
    }
  }catch{
    console.log("Colour Attribute 6 Cleared")
    SetColourSelect6("")
  }
};
//Capacity 1 Select
const handleChangeCapacitySelect1 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Capacity Attribute 1 Changed",Model)
      SetGBSelect1(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Capacity Attribute 1 Changed",Model)
      SetGBSelect1(Model)
    }
  }catch{
    console.log("Capacity Attribute 1 Cleared")
    SetGBSelect1("")
  }
};
//Capacity 2 Select
const handleChangeCapacitySelect2 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Capacity Attribute 2 Changed",Model)
      SetGBSelect2(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Capacity Attribute 2 Changed",Model)
      SetGBSelect2(Model)
    }
  }catch{
    console.log("Capacity Attribute 2 Cleared")
    SetGBSelect2("")
  }
};
//Capacity 3 Select
const handleChangeCapacitySelect3 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Capacity Attribute 3 Changed",Model)
      SetGBSelect3(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Capacity Attribute 3 Changed",Model)
      SetGBSelect3(Model)
    }
  }catch{
    console.log("Capacity Attribute 3 Cleared")
    SetGBSelect3("")
  }
};
//Capacity 4 Select
const handleChangeCapacitySelect4 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Capacity Attribute 4 Changed",Model)
      SetGBSelect4(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Capacity Attribute 4 Changed",Model)
      SetGBSelect4(Model)
    }
  }catch{
    console.log("Capacity Attribute 4 Cleared")
    SetGBSelect4("")
  }
};
//Capacity 5 Select
const handleChangeCapacitySelect5 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Capacity Attribute 5 Changed",Model)
      SetGBSelect5(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Capacity Attribute 5 Changed",Model)
      SetGBSelect5(Model)
    }
  }catch{
    console.log("Capacity Attribute 5 Cleared")
    SetGBSelect5("")
  }
};
//Capacity 6 Select
const handleChangeCapacitySelect6 = (event,newValue) => {
  try{
    if(newValue.label !== undefined){
      const Model = newValue.label
      console.log("Capacity Attribute 6 Changed",Model)
      SetGBSelect6(Model)
    }if(newValue.label === undefined){
      const Model = newValue
      console.log("Capacity Attribute 6 Changed",Model)
      SetGBSelect6(Model)
    }
  }catch{
    console.log("Capacity Attribute 6 Cleared")
    SetGBSelect6("")
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


//Setup the trasnfer list
const handleToggle = (value) => () => {
  const currentIndex = checked.indexOf(value);
  const newChecked = [...checked];

  if (currentIndex === -1) {
    newChecked.push(value);
  } else {
    newChecked.splice(currentIndex, 1);
  }

  setChecked(newChecked);
};

const numberOfChecked = (items) => intersection(checked, items).length;

const handleToggleAll = (items) => () => {
  if (numberOfChecked(items) === items.length) {
    setChecked(not(checked, items));
  } else {
    setChecked(union(checked, items));
  }
};

const handleCheckedRight = () => {
  setRight(right.concat(leftChecked));
  setLeft(not(left, leftChecked));
  setChecked(not(checked, leftChecked));
};

const handleCheckedLeft = () => {
  setLeft(left.concat(rightChecked));
  setRight(not(right, rightChecked));
  setChecked(not(checked, rightChecked));
};

const customList = (title, items) => (
  <Card>
    <CardHeader
      sx={{ px: 2, py: 1 }}
      avatar={
        <Checkbox
          onClick={handleToggleAll(items)}
          checked={numberOfChecked(items) === items.length && items.length !== 0}
          indeterminate={
            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
          }
          disabled={items.length === 0}
          inputProps={{
            'aria-label': 'all items selected',
          }}
        />
      }
      title={title}
      subheader={`${numberOfChecked(items)}/${items.length} selected`}
    />
    <Divider />
    <List
      sx={{
        width: 200,
        height: 230,
        bgcolor: 'background.paper',
        overflow: 'auto',
      }}
      dense
      component="div"
      role="list"
    >
      {items.map((value) => {
        const labelId = `transfer-list-all-item-${value}-label`;

        return (
          <ListItem
            key={value}
            role="listitem"
            button
            onClick={handleToggle(value)}
          >
            <ListItemIcon>
              <Checkbox
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{
                  'aria-labelledby': labelId,
                }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`${value}`} />
          </ListItem>
        );
      })}
    </List>
  </Card>
);



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
    
    <div style={{width: "50%", float: "left"}} className="bg-white mb-3 h-7 rounded text-gray-600 border border-gray-300 text-center text-lg shadow-md font-semibold">
        Model:
      </div>

      <div style={{width: "100%", height: "fit-content"}} className="mb-2">

      <div style={{width: "35%",height:"100%", float:"left"}} className="mr-2">
        
      <FormControl style={{width: "49.2%",float: "left"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={DearModelSelect}
          options={ModelList}
          onChange={handleChangeModelDearSelect}
          renderInput={(params) => <TextField {...params} label="Dear Model" />}
        >
        </Autocomplete>
      </FormControl>

      <FormControl style={{width: "49.2%",float: "right"}} size="small" className="bg-white rounded">
        <Autocomplete
        disablePortal
          labelId="combo-box-demo"
          size="small"
          value={GSMModelSelect.Model}
          onChange={handleChangeGSMModelSelect}
          options={GSMArenaModelList}
          apiRef={apiRefMain}
          renderInput={(params) => <TextField {...params} label="GSM Arena Model" />}
        >
        </Autocomplete>
      </FormControl>
      

      </div>

      <ThemeProvider theme={theme}>
        <div style={{width: "7.5%", float: "left",height:"95%"}} className="pr-2">
        <LoadingButton onClick={handleGenerateClickUpdated} loading={generateButtonState} variant="contained" color="primary" style={{width: "100%",height:"100%",float:"left"}} loadingPosition="start" startIcon={<DoubleArrowIcon />}>Generate</LoadingButton>
        </div>
        <div style={{width: "7.5%", float: "left",height:"95%"}} className="pr-2">
        <LoadingButton onClick={""} loading={pushDearButtonState} variant="contained" color="secondary" style={{width: "100%",height:"100%",float:"left"}} loadingPosition="start" startIcon={<DownloadIcon />}>Download</LoadingButton>
        </div>
      </ThemeProvider>

      </div>


      <div style={{width: "69.4%", float: "left"}} className="bg-white mb-3 h-7 rounded text-gray-600 border border-gray-300 text-center text-lg shadow-md font-semibold">
        Attributes:
      </div>

      <div style={{width: "100%", height: "fit-content"}} className="mb-2">

      <div style={{width: "70%",height:"100%", float:"left"}} className="mr-2">

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={ColourSelect1}
          options={GSMReturnedColours}
          onChange={handleChangeColourSelect1}
          renderInput={(params) => <TextField {...params} label="1.Colour" />}
        >
        </Autocomplete>
      </FormControl>
      </div>

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={ColourSelect2}
          options={GSMReturnedColours}
          onChange={handleChangeColourSelect2}
          renderInput={(params) => <TextField {...params} label="2.Colour" />}
        >
        </Autocomplete>
      </FormControl>
      </div>

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={ColourSelect3}
          options={GSMReturnedColours}
          onChange={handleChangeColourSelect3}
          renderInput={(params) => <TextField {...params} label="3.Colour" />}
        >
        </Autocomplete>
      </FormControl>
      </div>

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={ColourSelect4}
          options={GSMReturnedColours}
          onChange={handleChangeColourSelect4}
          renderInput={(params) => <TextField {...params} label="4.Colour" />}
        >
        </Autocomplete>
      </FormControl>
      </div>

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={ColourSelect5}
          options={GSMReturnedColours}
          onChange={handleChangeColourSelect5}
          renderInput={(params) => <TextField {...params} label="5.Colour" />}
        >
        </Autocomplete>
      </FormControl>
      </div>

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={ColourSelect6}
          options={GSMReturnedColours}
          onChange={handleChangeColourSelect6}
          renderInput={(params) => <TextField {...params} label="6.Colour" />}
        >
        </Autocomplete>
      </FormControl>
      </div>


      </div>

      </div>

      <div style={{width: "100%", height: "fit-content"}} className="mb-2">

      <div style={{width: "70%",height:"100%", float:"left"}} className="mr-2">

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={GBSelect1}
          options={GSMReturnedCapacitys}
          onChange={handleChangeCapacitySelect1}
          renderInput={(params) => <TextField {...params} label="1.Capacity" />}
        >
        </Autocomplete>
      </FormControl>
      </div>

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={GBSelect2}
          options={GSMReturnedCapacitys}
          onChange={handleChangeCapacitySelect2}
          renderInput={(params) => <TextField {...params} label="2.Capacity" />}
        >
        </Autocomplete>
      </FormControl>
      </div>

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={GBSelect3}
          options={GSMReturnedCapacitys}
          onChange={handleChangeCapacitySelect3}
          renderInput={(params) => <TextField {...params} label="3.Capacity" />}
        >
        </Autocomplete>
      </FormControl>
      </div>

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={GBSelect4}
          options={GSMReturnedCapacitys}
          onChange={handleChangeCapacitySelect4}
          renderInput={(params) => <TextField {...params} label="4.Capacity" />}
        >
        </Autocomplete>
      </FormControl>
      </div>

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={GBSelect5}
          options={GSMReturnedCapacitys}
          onChange={handleChangeCapacitySelect5}
          renderInput={(params) => <TextField {...params} label="5.Capacity" />}
        >
        </Autocomplete>
      </FormControl>
      </div>

      <div style={{width: "16%",float: "left"}} className="mr-2">
      <FormControl style={{width: "100%"}} size="small" className="bg-white rounded">
        <Autocomplete
          disablePortal
          labelId="combo-box-demo"
          size="small"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={GBSelect6}
          options={GSMReturnedCapacitys}
          onChange={handleChangeCapacitySelect6}
          renderInput={(params) => <TextField {...params} label="6.Capacity" />}
        >
        </Autocomplete>
      </FormControl>
      </div>


      </div>

      </div>

      <Grid container spacing={2} justifyContent="center" alignItems="center" className="mb-2">
      <Grid item>{customList('GSM/Added', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('DEAR', right)}</Grid>
    </Grid>
      
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
        apiRef={apiRefMain}
      />
    </div>

    </div>
  );
}