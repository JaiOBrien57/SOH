import { Routes, Route } from "react-router-dom"
import SOH_Devices from "./Pages/Tools_Tab/SOH_Page/SOH_Devices"
import SOH_Devices_All_Devices from "./Pages/Tools_Tab/SOH_Page/SOH_All_Devices"
import SOH_Parts_All_Parts from "./Pages/Tools_Tab/SOH_Page/SOH_All_Parts"
import SOH_Faulty_Devices from "./Pages/Tools_Tab/SOH_Page/SOH_Faulty_Devices"
import Prod_Creator from "./Pages/Tools_Tab/Products_Management_Page/Prod_Creator"
import SOH_Settings_Variables from "./Pages/Tools_Tab/SOH_Page/SOH_Settings_Variables"
import React, { useEffect, useState } from "react";
import TopDropDowns from "./Pages/TopDropDowns";
import Button from "react-bootstrap/Button";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SellIcon from '@mui/icons-material/Sell';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { useNavigate } from "react-router-dom";
import SettingsIcon from '@mui/icons-material/Settings';


//Drawer vars
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


export const Routes_Import = () =>{

  const [isSelectedRenewed, setIsSelectedRenewed] = useState(false);
  const [isSelectedFaulty, setIsSelectedFaulty] = useState(false);
  const [isSelectedParts, setIsSelectedParts] = useState(false);
  const [isSelectedAllDevices, setIsSelectedAllDevices] = useState(false);
  const [isSelectedAllParts, setIsSelectedAllParts] = useState(false);
  const [isSelectedVariables, setIsSelectedVariables] = useState(false);
    
    //Navigations Variables
    const [anchorEl, setAnchorEl] = React.useState(null);
    let navigate = useNavigate(); 
    
    //Handle SOH_Devices Click Go To
    const handleSOH_DevicesClick = () =>{
      setIsSelectedFaulty(false);
      setIsSelectedAllDevices(false);
      setIsSelectedAllParts(false);
      setIsSelectedVariables(false);
      setAnchorEl(null);
      let path = `/SOH_Devices`; 
      navigate(path);
      setIsSelectedRenewed(true);
    }

    //Handle SOH_Faulty_Devices Click Go To
    const handleSOH_Faulty_DevicesClick = () =>{
      setIsSelectedRenewed(false);
      setIsSelectedAllDevices(false);
      setIsSelectedAllParts(false);
      setIsSelectedVariables(false);
      setAnchorEl(null);
      let path = `/SOH_Faulty_Devices`; 
      navigate(path);
      setIsSelectedFaulty(true);
    }
    
    //Handle SOH_All_Devices Click Go To
    const handleSOH_All_DevicesClick = () =>{
      setIsSelectedRenewed(false);
      setIsSelectedFaulty(false);
      setIsSelectedAllParts(false);
      setIsSelectedVariables(false);
      setAnchorEl(null);
      let path = `/SOH_All_Devices`; 
      navigate(path);
      setIsSelectedAllDevices(true);
    }

    //Handle SOH_Settings_Variables Click Go To
    const handleSOH_Setttings_VariablesClick = () =>{
      setIsSelectedRenewed(false);
      setIsSelectedFaulty(false);
      setIsSelectedAllParts(false);
      setIsSelectedAllDevices(false);
      setAnchorEl(null);
      let path = `/SOH_Settings_Variables`; 
      navigate(path);
    }

    //Handle All_Parts_Go_To
    const handleSOH_All_Parts = () => {
      setIsSelectedRenewed(false);
      setIsSelectedFaulty(false);
      setIsSelectedAllDevices(false);
      setIsSelectedVariables(false);
      setAnchorEl(null);
      let path = `/SOH_All_Parts`;
      navigate(path);
      setIsSelectedAllParts(true);
    }


  //Render Component
  function RenderPage (Page){
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleDrawerOpen = () => {
    setOpen(true);
    };

    const handleDrawerClose = () => {
    setOpen(false);
    };  

  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar position="fixed" open={open} sx={{backgroundColor: "white" }}>
      <Toolbar>
        <IconButton
          color="black"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h5" noWrap component="div" sx={{color: "#4b5563"}}>
          Stock On Hand
        </Typography>
        <TopDropDowns/>
      </Toolbar>
    </AppBar>
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: "white",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem key={"SalesHeader"} className="pl-2">
            <ListItemIcon>
              <SellIcon/>
            </ListItemIcon>
            <ListItemText primary={"Sales:"} />
        </ListItem>
      </List>
      <List>
        <ListItem key={"RenewedDevices"} disablePadding className={isSelectedRenewed ? 'text-teal-500' : ''}>
          <ListItemButton onClick={handleSOH_DevicesClick}>
            <ListItemIcon>
            <ArrowRightIcon/>
            </ListItemIcon>
            <ListItemText primary={"Renewed Devices"} />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem key={"Faulty Devices"} disablePadding className={isSelectedFaulty ? 'text-teal-500' : ''}>
          <ListItemButton onClick={handleSOH_Faulty_DevicesClick}>
            <ListItemIcon>
            <ArrowRightIcon/>
            </ListItemIcon>
            <ListItemText primary={"Faulty Devices"} />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem key={"Parts"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
            <ArrowRightIcon/>
            </ListItemIcon>
            <ListItemText primary={"Parts"} />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem key={"Accessories"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
            <ArrowRightIcon/>
            </ListItemIcon>
            <ListItemText primary={"Accessories"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem key={"StockManagement"} className="pl-2">
            <ListItemIcon>
              <InventoryIcon/>
            </ListItemIcon>
            <ListItemText primary={"Stock Management:"} />
        </ListItem>
      </List>
      <List>
        <ListItem key={"AllDevices"} disablePadding className={isSelectedAllDevices ? 'text-teal-500' : ''}>
          <ListItemButton onClick={handleSOH_All_DevicesClick}>
            <ListItemIcon>
            <ArrowRightIcon/>
            </ListItemIcon>
            <ListItemText primary={"All Devices"} />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem key={"AllParts"} disablePadding className={isSelectedAllParts ? 'text-teal-500' : ''}>
          <ListItemButton onClick={handleSOH_All_Parts}>
            <ListItemIcon>
            <ArrowRightIcon/>
            </ListItemIcon>
            <ListItemText primary={"All Parts"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
        <List>
        <ListItem key={"Settings"} className="pl-2">
            <ListItemIcon>
                <SettingsIcon/>
            </ListItemIcon>
            <ListItemText primary={"Settings:"} />
        </ListItem>
        </List>
        <List>
        <ListItem key={"Variables"} disablePadding className={isSelectedVariables ? 'text-teal-500' : ''}>
            <ListItemButton onClick={handleSOH_Setttings_VariablesClick}>
            <ListItemIcon>
            <ArrowRightIcon/>
            </ListItemIcon>
            <ListItemText primary={"Variables"} />
            </ListItemButton>
        </ListItem>
        </List>
    </Drawer>
    <Main open={open}>
      <DrawerHeader />
      {Page}
    </Main>
  </Box>
    )
  }

  //Render the default page
  function HomePageNoLink(){
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleDrawerOpen = () => {
    setOpen(true);
    };

    const handleDrawerClose = () => {
    setOpen(false);
    };  

    return (
      <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{backgroundColor: "white" }}>
        <Toolbar>
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div" sx={{color: "#4b5563"}}>
            Dashboard
          </Typography>
          <TopDropDowns/>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: "white",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key={"Nothing1"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon/>
              </ListItemIcon>
              <ListItemText primary={"Nothing1"} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key={"Nothing2"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Nothing2"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <div>
          Home Page
        </div>
      </Main>
    </Box>
      )
  }


    //Render Prod Creator Page
    function Prod_Creator_Render(){
        const theme = useTheme();
        const [open, setOpen] = React.useState(false);
        const [anchorEl, setAnchorEl] = React.useState(null);
    
        const handleDrawerOpen = () => {
        setOpen(true);
        };
    
        const handleDrawerClose = () => {
        setOpen(false);
        };  

        return (
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} sx={{backgroundColor: "white" }}>
            <Toolbar>
            <IconButton
                color="black"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h5" noWrap component="div" sx={{color: "#4b5563"}}>
                Product Management
            </Typography>
            <TopDropDowns/>
            </Toolbar>
        </AppBar>
        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: "white",
            },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
            <ListItem key={"Nothing1"} disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <InboxIcon/>
                </ListItemIcon>
                <ListItemText primary={"Nothing1"} />
                </ListItemButton>
            </ListItem>
            </List>
            <Divider />
            <List>
            <ListItem key={"Nothing2"} disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Nothing2"} />
                </ListItemButton>
            </ListItem>
            </List>
        </Drawer>
        <Main open={open}>
            <DrawerHeader />
            <Prod_Creator/>
        </Main>
        </Box>
        )
    }



    //Render The Google Sheets Page
    function Google_Sheets_Render(){
        const theme = useTheme();
        const [open, setOpen] = React.useState(false);
        const [anchorEl, setAnchorEl] = React.useState(null);
    
        const handleDrawerOpen = () => {
        setOpen(true);
        };
    
        const handleDrawerClose = () => {
        setOpen(false);
        };  

        return (
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} sx={{backgroundColor: "white" }}>
            <Toolbar>
            <IconButton
                color="black"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h5" noWrap component="div" sx={{color: "#4b5563"}}>
                Google Sheets
            </Typography>
            <TopDropDowns/>
            </Toolbar>
        </AppBar>
        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: "white",
            },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
            <ListItem key={"Nothing1"} disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <InboxIcon/>
                </ListItemIcon>
                <ListItemText primary={"Nothing1"} />
                </ListItemButton>
            </ListItem>
            </List>
            <Divider />
            <List>
            <ListItem key={"Nothing2"} disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Nothing2"} />
                </ListItemButton>
            </ListItem>
            </List>
        </Drawer>
        <Main open={open}>
            <DrawerHeader />
            <div>
            Google Sheets Links:
            </div>
        </Main>
        </Box>
        )
    }

  //Render the data with the route:
    return (
        <div className="App">
          <Routes>
            <Route path="/SOH_Devices" element={RenderPage(<SOH_Devices/>)} />
                <Route path="/SOH_Faulty_Devices" element={RenderPage(<SOH_Faulty_Devices/>)} />
                <Route path="/SOH_All_Devices" element={RenderPage(<SOH_Devices_All_Devices/>)} />
                <Route path="/SOH_All_Parts" element={RenderPage(<SOH_Parts_All_Parts/>)} />
                <Route path="/SOH_Settings_Variables" element={RenderPage(<SOH_Settings_Variables/>)} />
            <Route path="/Google_Sheets" element={<Google_Sheets_Render/>} />
            <Route path="/Prod_Creator" element={<Prod_Creator_Render/>} />
            <Route path="/" element={<HomePageNoLink/>} />
          </Routes>
        </div>
      )

}

