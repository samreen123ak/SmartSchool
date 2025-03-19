import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar function
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh" 
    }}>
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />
      
      {/* Main content area */}
      <Box sx={{ 
        display: "flex", 
        flex: 1,
        position: "relative"
      }}>
        {/* Sidebar - now using the open prop instead of conditional rendering */}
        <Sidebar 
          open={isSidebarOpen} 
          closeSidebar={closeSidebar} 
        />
        
        {/* Main content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            p: 3,
            width: "100%",
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(isDesktop && isSidebarOpen && {
              marginLeft: '280px',
              width: 'calc(100% - 280px)',
              transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
          }}
        >
          {/* Content */}
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            {children}
          </Box>
        </Box>
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout;