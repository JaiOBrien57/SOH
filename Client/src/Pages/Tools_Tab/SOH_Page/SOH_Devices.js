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

export default function SOH_Devices() {

//Setup React variables
const [availData, setAvailData] = React.useState([]);
const [selectedDataTable, SetSelectedDataTable] = React.useState([]);
const [contentLoaded, SetContentLoaded] = React.useState(true)
const [mainTableRows, SetMainTableRows] = React.useState([])
const [selectedTableRows, SetSelectedTableRows] = React.useState([])
const [saleTransferButton, SetSaleTransferButton] = React.useState('');
const [pushDearButtonState, SetPushDearButtonState] = React.useState(false);
const [downloadDearButtonState, SetDownloadDearButtonState] = React.useState(false);
const [DearPushOpen, SetDearPushOpen] = React.useState(false)
const [newSalesOrder, setNewSalesOrder] = React.useState("")
const [newSaleID, SetNewSaleID] = React.useState("")
const [dearPushStatus, SetDearPushStatus] = React.useState(0)
const [dearDataFetchedStatus, SetDearDataFetchedStatus] = React.useState(0)
const [TableSizing, SetTableSizing] = React.useState({"MainTableSize":"78%","SelectTableSize":"22%"})
const [selectTableExpandStatus, SetSelectTableExpandStatus] = React.useState(false)
const delay = ms => new Promise(res => setTimeout(res, ms));
const apiRefMainTable = useGridApiRef();
const apiRefSelectTable = useGridApiRef();

//Get the avail List
useEffect(() => {
  async function FetchAvail() {
    const request = await fetch("/api/renewedDevicesList");
    const response = await request.json()
    if (response === "ERROR") {
      SetDearDataFetchedStatus(500)
      SetDearPushOpen(true)
      console.log("Back end Request failed")
    }if (response !== "ERROR") {
      SetDearDataFetchedStatus(0)
      setAvailData(response);
      SetContentLoaded(false)
      console.log(response);
    }
  }
  FetchAvail();
}, []);

//Set the rows state for the Main Table
useEffect(() => {
  function SetMainTableRowsData() {
    const rows = availData.map((row,index)=>({"id": index,"SKU":row.SKU,"Name":row.Name,"AvailableCage":row.AvailableCage,"AvailableRefurbCage":row.AvailableRefurbCage,"IDDear":row.IDDear,"DealerPrice":row.DealerPrice,"TotalQTY":row.TotalQTY,"FinalModel":row.FinalModel,"Grade":row.Grade,"Battery":row.Battery,"AVGCost":row.AVGCost,"Colour":row.Colour,"AVGPriceTier":row.AVGPriceTier}))
    SetMainTableRows(rows)
    console.log(rows)
  }
  SetMainTableRowsData();
}, [availData]);


//Add the rows for the selected Table ********Make alert popup for excluded SKU's********
const addSelectedToTable = (event) => {
  const NewRowsToAdd = selectedDataTable.map((row)=>({"id": row.id,"IDDear":row.IDDear,"SKU":row.SKU,"Name":row.Name,"Price":row.DealerPrice,"TotalQTY":row.TotalQTY,"FinalModel":row.FinalModel,"Colour":row.Colour,"Grade":row.Grade,"Battery":row.Battery,"AVGCost":row.AVGPriceTier}))
  const ExistingIDsInSelectRow = selectedTableRows.map((row) => row.id)
  const NewRowsExcludingExisting = NewRowsToAdd.filter((row) => !ExistingIDsInSelectRow.includes(row.id))
  const ExcludedRowIDs = NewRowsToAdd.filter((row) => ExistingIDsInSelectRow.includes(row.id))
  SetSelectedTableRows(current  => [...current,...NewRowsExcludingExisting] );
  NewRowsToAdd.map((row) => apiRefMainTable.current.selectRow(row.id,false,true))
  console.log("Excluding These:",ExcludedRowIDs,"Adding these into select:",NewRowsExcludingExisting)
}

//Delete the rows for selected table
const deleteRowSelectTable = (rowToDelete) => {
    const newSelectDataAfterDelete = selectedTableRows.filter(row => row.id !== rowToDelete)
    SetSelectedTableRows(newSelectDataAfterDelete)
    console.log("Deleting this id:",rowToDelete) 
}


//Delete All Rows on Select Table
const deleteAllRowsSelect = (event) => {
  SetSelectedTableRows([])
  console.log("All Select Rows Cleared")
}

//Format as currency
const currencyFormatter = (params) => {
  if (params.value == "" || params.value == "$" || params.value == null) {
    return '$' + (0)
  }if (params.value != "" && params.value != "$") {
    return '$' + parseFloat((params.value)).toFixed(2);
  }
};

//Get main table margin
const getMainTableMargin = (params) => {
  if (params.row.AVGPriceTier <= 0 || params.DealerPrice <= 0 || params.row.AVGPriceTier === "$0" || params.row.DealerPrice === "$0") {
    const margin = "-%"
    return margin
  }if (params.row.AVGPriceTier > 0 && params.row.DealerPrice > 0 && params.row.AVGPriceTier !== "$0" && params.row.DealerPrice !== "0$") {
    const margin = String(parseFloat(((params.row.DealerPrice-params.row.AVGPriceTier)/params.row.DealerPrice)*100).toFixed(2))+"%"
    return margin
  }
}


//Get Select Table Margin
const getSelectTableMargin = (params) => {
  if (params.row.AVGCost <= 0 || params.row.Price <= 0 || params.row.AVGCost === "$0" || params.row.DealerPrice === "$0") {
    const margin = "-%"
    return margin
  }if (params.row.AVGCost > 0 && params.row.Price > 0  && params.row.AVGCost !== "$0" && params.row.Price !== "0$") {
    const margin = String(parseFloat(((params.row.Price-params.row.AVGCost)/params.row.Price)*100).toFixed(2))+"%"
    return margin
  }
}

//Setup the columns for SOH Table
const columns = [
  { field: 'SKU', headerName: 'SKU', width: 70, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black",headerAlign: 'center',align: "center", renderCell:rowData=><Link href={`https://inventory.dearsystems.com/Product#${rowData.row.IDDear}`} target="_blank">{rowData.row.SKU}</Link>},
  { field: 'FinalModel', headerName: 'Model 📱', width: 350, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true},
  { field: 'Colour', headerName: 'Colour', width: 130, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Grade', headerName: 'Grade', width: 60, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Battery', headerName: 'Battery', width: 70, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'AvailableCage', headerName: 'Dealer Cage', type: 'number', width: 100,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black",disableColumnMenu: true, cellClassName: (params) => {if (params.value == null) {return '';} return clsx('super-app', {negative: params.value === 0, positive: params.value > 0,})}},
  { field: 'AvailableRefurbCage', headerName: 'Refurb Cage', type: 'number', width: 100,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black",disableColumnMenu: true, cellClassName: (params) => {if (params.value == null) {return '';} return clsx('super-app', {negative: params.value === 0, positive: params.value > 0,})}},
  { field: 'DealerPrice', headerName: 'Price (ex)', type: 'number', width: 90,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true, valueFormatter: currencyFormatter},
  { field: 'AVGCost', headerName: 'AVG-c (ex)', type: 'number', width: 80,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true, valueFormatter: currencyFormatter},
  { field: 'AVGPriceTier', headerName: 'AVG (ex)', type: 'number', width: 80,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true, valueFormatter: currencyFormatter},
  { field: 'Margin', headerName: 'Margin (%)', type: 'number', width: 90,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,valueGetter:getMainTableMargin},
];

//Setup the columns for Selected Table
const columnsSelected = [
  { field: 'DeleteRow',renderHeader: (params: GridColumnHeaderParams) => (<ThemeProvider theme={theme}><IconButton onClick={deleteAllRowsSelect} aria-label="delete"><DisabledByDefaultIcon style={{float: "left"}} color="Error" sx={{fontSize: 22 ,":hover": {color: "#c62828"}}}/></IconButton></ThemeProvider>), width: 59, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black",renderCell: rowData=> <ThemeProvider theme={theme}><IconButton onClick={()=>deleteRowSelectTable(rowData.row.id)} aria-label="delete"><HighlightOffIcon sx={{fontSize: 22 ,":hover": {color: "#c62828"}}} color="Error"/></IconButton></ThemeProvider>},
  { field: 'SKU', headerName: 'SKU', width: 70, disableColumnMenu: true, sortable: false, headerClassName: "bg-white text-black", cellClassName: "text-black",headerAlign: 'center',align: "center", renderCell:rowData=><Link href={`https://inventory.dearsystems.com/Product#${rowData.row.IDDear}`} target="_blank">{rowData.row.SKU}</Link>},
  { field: 'FinalModel', headerName: 'Model 📱', width: 350, disableColumnMenu: true, sortable: true, headerClassName: "bg-white text-black", cellClassName: "text-black"},
  { field: 'Colour', headerName: 'Colour', width: 130, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Grade', headerName: 'Grade', width: 60, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'Battery', headerName: 'Battery', width: 70, headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,headerAlign: 'center',align: "center"},
  { field: 'TotalQTY', headerName: 'QTY', width: 40, disableColumnMenu: true, sortable: true, headerClassName: "bg-white text-black", cellClassName: "text-black", editable: true,headerAlign: 'center',align: "center"},
  { field: 'Price', headerName: 'Price (ex)', width: 90,type: 'number' ,disableColumnMenu: true, sortable: true, headerClassName: "bg-white text-black", cellClassName: "text-black", editable: true,headerAlign: 'center',align: "center",valueFormatter: currencyFormatter},
  { field: 'AVGCost', headerName: 'AVG (ex)', type: 'number', width: 80,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true, valueFormatter: currencyFormatter},
  { field: 'Margin', headerName: 'Margin (%)', type: 'number', width: 90,headerAlign: 'center',align: "center", headerClassName: "bg-white text-black", cellClassName: "text-black",disableColumnMenu: true,valueGetter:getSelectTableMargin},
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
const handlePushDear = async (event) =>{
  
  event.preventDefault();
  SetPushDearButtonState(true)

  if(saleTransferButton === "Sale"){
    //Send Request to server
    const request = await fetch("/api/saleSelect",{method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify(selectedTableRows)});
    const returnVal = await request.json()
    console.log(returnVal)
    SetDearPushOpen(true)
    setNewSalesOrder(returnVal.SaleOrder)
    SetNewSaleID(returnVal.SaleID)
    SetDearPushStatus(returnVal.ResCode)
  }if(saleTransferButton === "Transfer"){
    //Send Request to server
    const request = await fetch("/api/transferSelect",{method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify(selectedTableRows)});
    const returnVal = await request.json()
    console.log(returnVal)
    SetDearPushOpen(true)
  }if(saleTransferButton === ""){
    console.log("No Action Type Selected")
    SetDearPushOpen(true)
  }
  SetPushDearButtonState(false)
}

//Handle Popup alert
const PopUpAlert = () => {
  if (dearPushStatus === 200) {
    return <Snackbar open={DearPushOpen} autoHideDuration={100} anchorOrigin={{vertical: "top",horizontal: "center"}}>
    <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%'}}>
      <AlertTitle>Success</AlertTitle>
      <Typography>Dear Order Created Successfully <Link href={`https://inventory.dearsystems.com/Sale#${newSaleID}`} target="_blank">{newSalesOrder}</Link></Typography>
    </Alert>
  </Snackbar>
  }if (dearPushStatus == 500) {
    return <Snackbar open={DearPushOpen} autoHideDuration={100} anchorOrigin={{vertical: "top",horizontal: "center"}}>
    <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%'}}>
      <AlertTitle>Error</AlertTitle>
      <Typography>Dear Order Could Not Be Made <Link href={`https://inventory.dearsystems.com/Sale#${newSaleID}`} target="_blank">{newSalesOrder}</Link></Typography>
    </Alert>
  </Snackbar>
  }if (dearDataFetchedStatus === 500) {
    return <Snackbar open={DearPushOpen} autoHideDuration={100} anchorOrigin={{vertical: "top",horizontal: "center"}}>
    <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%'}}>
      <AlertTitle>Error</AlertTitle>
      <Typography>DEAR Data Failed To Fetch, Reload Page To Try Again</Typography>
    </Alert>
  </Snackbar>
  }
  
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
    <div style={{height: "100%", width: "fit-content", float: "left"}} className="py-2 pl-2 pr-1">
      <Button size="small" onClick={addSelectedToTable} variant="contained" color="primary" startIcon={<AddBoxIcon />}>ADD</Button>
    </div>
      <GridToolbarExport/>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
    </ThemeProvider>
  );
}

//Menu For Selected Table
function CustomToolbarSelect() {
  return (
    <ThemeProvider theme={theme}>
    <GridToolbarContainer>
      <GridToolbarExport />
      <GridToolbarColumnsButton />
    <div style={{height: "100%", width: "fit-content", float: "right"}} className="py-2">
      <IconButton onClick={handleExpandSelectTable} color="primary" size="small" aria-label="expand"><OpenOrCloseIcon/></IconButton>
    </div>
    </GridToolbarContainer>
    </ThemeProvider>
  );
}

//Handle Expand Button Click From Select Table
const handleExpandSelectTable = (event) => {
  if (selectTableExpandStatus === false) {
    SetTableSizing({"MainTableSize":"38%","SelectTableSize":"62%"})
    SetSelectTableExpandStatus(true)
  }if (selectTableExpandStatus === true) {
    SetTableSizing({"MainTableSize":"78%","SelectTableSize":"22%"})
    SetSelectTableExpandStatus(false)
  }
}

const OpenOrCloseIcon = () => {
  if (selectTableExpandStatus === false) {
  return <OpenInFullIcon size="small"/>
  }if (selectTableExpandStatus === true) {
    return <CloseFullscreenIcon size="small"/>
    }
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
    
    <div style={{ height: "100%", width: `${TableSizing.MainTableSize}`, float: "left"}} className='flexParent pr-4'>

    <div style={{width: "100%", float: "left"}} className="bg-white mb-2 h-7 rounded text-gray-600 border border-gray-300 text-center text-lg shadow-md font-semibold">
        Renewed Devices
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
              AVGCost: false,
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


    <div style={{ height: "100%", width: `${TableSizing.SelectTableSize}`, float: 'left'}} className='flexParent'>

    <div style={{width: "100%", float: "left"}} className="bg-white mb-2 h-7 rounded text-gray-600 border border-gray-300 text-center text-lg shadow-md font-semibold">
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
      <LoadingButton onClick={handlePushDear} loading={pushDearButtonState} variant="contained" color="primary" style={{width: "50%"}} loadingPosition="start" startIcon={<DoubleArrowIcon />}>PUSH</LoadingButton>
      <LoadingButton onClick={handleDownloadDear} loading={downloadDearButtonState} variant="contained" color="secondary" style={{width: "50%"}} loadingPosition="start" startIcon={<DownloadIcon />}>CSV</LoadingButton>
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
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
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
        pageSizeOptions={[]}
        density="compact"
        disableRowSelectionOnClick 
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        apiRef={apiRefSelectTable}
      />

    </div>

    </div>
  );
}