import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Home, Menu as MenuIcon } from "@mui/icons-material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/GuestSmile.png";
import LoginIcon from '@mui/icons-material/Login';
import ApartmentIcon from '@mui/icons-material/Apartment';
const drawerWidth = 180;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Guest",
    image: "",
  };
const tenant = JSON.parse(localStorage.getItem("tenant")) || {};
  const [anchorEl, setAnchorEl] = useState(null); // Profile menu state
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile drawer state
  const [greeting, setGreeting] = useState('');
  const [isMobile, setIsMobile] = useState(false);
 const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
useEffect(() => {
    setGreeting(getGreeting());
checkMobileView(); // Check for mobile view on page load
    window.addEventListener('resize', checkMobileView); // Add resize listener

    return () => {
      window.removeEventListener('resize', checkMobileView); // Clean up listener
    };
  }, []);
  const drawerContent = (
    <List style={{marginTop:"20px"}}>
      <NavLink to="/" style={{ textDecoration: "none", color: "white" }}>
        <ListItem button>
          <ListItemIcon sx={{ color: "white" }}>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </NavLink>
      <NavLink to="/employees" style={{ textDecoration: "none", color: "white" }}>
        <ListItem button>
          <ListItemIcon sx={{ color: "white" }}>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText primary="Employees" />
        </ListItem>
      </NavLink>
      <NavLink to="/guest-list" style={{ textDecoration: "none", color: "white" }}>
        <ListItem button>
          <ListItemIcon sx={{ color: "white" }}>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary="Guest List" />
        </ListItem>
      </NavLink>
      <NavLink to="/company" style={{ textDecoration: "none", color: "white" }}>
        <ListItem button>
          <ListItemIcon sx={{ color: "white" }}>
            <ApartmentIcon />
          </ListItemIcon>
          <ListItemText primary="Company Profile" />
        </ListItem>
      </NavLink>
      
    </List>
  );
const checkMobileView = () => {
    setIsMobile(window.innerWidth <= 768); // Adjust for your mobile breakpoint
  };
  return (
    <Box sx={{ display: "flex", overflowX: "hidden" }}>
      <CssBaseline />

      {/* Navbar */}
     <AppBar
  position="fixed"
  sx={{
    zIndex: (theme) => theme.zIndex.drawer + 1,
    background: "#115060",
    height: 80, // Adjust height to accommodate the larger logo
    boxShadow: "none",
  }}
>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
  <Box
    component="img"
    src={logo}
    alt="Logo"
    sx={{
      height: 80, // Circular container height
      width: 80, // Circular container width (same as height for a circle)
      cursor: "pointer",
      background: "white", // Background for the circular container
      borderRadius: "50%", // Circular mask
      objectFit: "cover", // Ensure the image fills the container without distortion
      overflow: "hidden", // Prevents image overflow outside the circle
    }}
  />
</div>

{!isMobile && <h1>{greeting}</h1>}
          {/* Profile and Logout */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ mr: 2, display: { xs: "none", sm: "block" } }} color="white">
              {tenant.Name}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar alt={user.Name} src={tenant.Logo || "/default-avatar.png"} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: 2 }}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#115060",
            color: "#ECF0F1",
          },
        }}
        open
      >
        <Toolbar /> {/* Spacing for the navbar */}
        {drawerContent}
      </Drawer>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#115060",
            color: "#ECF0F1",
            marginTop: "64px", // Prevent drawer from covering navbar
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          mt: 3, // Added margin-top for the main content to avoid overlapping with the AppBar
            overflowX: "hidden",
          background:"white"
        }}
      >
        <Toolbar /> {/* Spacing for the navbar */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
