import React from "react";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button onClick={toggleSidebar} className="toggle-btn">
        ☰
      </button>
    </header>
  );
};

export default Header;
