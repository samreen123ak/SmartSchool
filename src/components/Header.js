import React from "react";

const Header = ({ toggleSidebar }) => {  
  const handleLogout = () => {  
    localStorage.removeItem("auth");
    window.location.href = "/login";  
  };  
  return (
    <header className="header">
      <button onClick={toggleSidebar} className="toggle-btn">
        ☰
      </button>
      <button onClick={handleLogout}>Logout</button>  
    </header>
  );
};

export default Header;
