import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ closeSidebar }) => {
  return (
    <div className="sidebar">
      <button className="close-btn" onClick={closeSidebar}>×</button>
      <ul>
        <li>
          <Link to="/student" onClick={closeSidebar}>Student</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
