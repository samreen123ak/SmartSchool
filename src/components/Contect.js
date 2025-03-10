import React from "react";
import Student from "./Students";

const Content = ({ selectedPage, isSidebarOpen }) => {
  return (
    <div className={`content ${isSidebarOpen ? "with-sidebar" : "full-width"}`}>
      {selectedPage === "" ? (
        <></>
      ) : (
        <h2>{selectedPage} Page</h2>
      )}
      {selectedPage === "Student" && (
        <Student/>
      )}
    </div>
  );
};

export default Content;
