import React, { useState } from "react";  
import Header from "./Header";  
import Sidebar from "./Sidebar";  
import Footer from "./Footer";  

const Layout = ({ children }) => {  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  

  return (  
    <div className="layout">  
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />  
      <div className="main-container">  
        {isSidebarOpen && (  
          <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />  
        )}  
        <div className="content">{children}</div>  
      </div>  
      <Footer/>
    </div>  
  );  
};  

export default Layout; 