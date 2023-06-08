import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { styled, useTheme } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Cloud from '@mui/icons-material/Cloud';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { Typography } from "@mui/material";
import BuildIcon from '@mui/icons-material/Build';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { useNavigate } from "react-router-dom";


export default function TopDropDowns() {

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  let navigate = useNavigate(); 

  //Tools Menu Vars
  const [anchorElTools, setAnchorElTools] = React.useState(null);
  const openMenuTools = Boolean(anchorElTools);

  const handleClickTools = (event) => {
    setAnchorElTools(event.currentTarget);
  };
  const handleCloseTools = () => {
    setAnchorElTools(null);
  };

  //Pricing Menu Vars
  const [anchorElPricing, setAnchorElPricing] = React.useState(null);
  const openMenuPricing = Boolean(anchorElPricing);

  const handleClickPricing = (event) => {
    setAnchorElPricing(event.currentTarget);
  };

  const handleClosePricing = () => {
    setAnchorElPricing(null);
  }


  //Handle On Close for SOH
  const handleCloseSOH = () => {
    setAnchorElPricing(null);
    let path = `/SOH_Devices`; 
    navigate(path);
  };

  //Handle Click to Home Page
  const handleHomePageClick = () =>{
    setAnchorElPricing(null);
    let path = `/`; 
    navigate(path);
  }
 


  
  //Main HTML
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleHomePageClick}
        className="ml-20 text-blue-500"
      >
        Home
      </Button>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickTools}
        className="ml-12 text-blue-500"
      >
        Tools
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorElTools}
        open={openMenuTools}
        onClose={handleCloseTools}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem dense={true}>
        <ListItemIcon>
            <BuildIcon fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ typography: 'subtitle2'}}>Tools Menu:</Typography>
        </MenuItem>
        <Divider />

        <MenuItem dense={true} onClick={handleCloseTools}>
        <ListItemIcon>
        <ArrowRightIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Stock Adjustment</ListItemText>
          </MenuItem>
        <Divider />

        <MenuItem dense={true} onClick={handleCloseTools}>
        <ListItemIcon>
        <ArrowRightIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Stock Receiving</ListItemText>
          </MenuItem>
        <Divider />

        <MenuItem dense={true} onClick={handleCloseSOH}>
        <ListItemIcon>
        <ArrowRightIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>SOH</ListItemText>
          </MenuItem>
      </Menu>

      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickPricing}
        className="ml-12 text-blue-500"
      >
        Pricing
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorElPricing}
        open={openMenuPricing}
        onClose={handleClosePricing}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem dense={true}>
        <ListItemIcon>
            <RequestQuoteIcon fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ typography: 'subtitle2'}}>Pricing Menu:</Typography>
        </MenuItem>
        <Divider />

        <MenuItem dense={true} onClick={handleClosePricing}>
        <ListItemIcon>
        <ArrowRightIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Renewable Devices</ListItemText>
          </MenuItem>
        <Divider />

        <MenuItem dense={true} onClick={handleClosePricing}>
        <ListItemIcon>
        <ArrowRightIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Parts</ListItemText>
          </MenuItem>
        <Divider />

        <MenuItem dense={true} onClick={handleClosePricing}>
        <ListItemIcon>
        <ArrowRightIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>CTD/LYP</ListItemText>
          </MenuItem>
      </Menu>
    </div>

  );
}
