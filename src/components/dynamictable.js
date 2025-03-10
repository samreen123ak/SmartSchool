import React, { useState, useEffect } from "react";  
import axios from 'axios';  
import "./mycss/std.css";  

const Table = ({ data }) => {  
  const [rows, setRows] = useState(Array.isArray(data) ? data : []);  
  const [editIndex, setEditIndex] = useState(null);  
  const [editData, setEditData] = useState({});  
  const [currentPage, setCurrentPage] = useState(1);  
  const [rowsPerPage, setRowsPerPage] = useState(2);  
  const [columns, setColumns] = useState([]);  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);  
  const [newRow, setNewRow] = useState({});  


  // this is for screen 
      useEffect(() => {  
        const handleResize = () => setIsMobile(window.innerWidth < 600);  
        window.addEventListener("resize", handleResize);  
        return () => window.removeEventListener("resize", handleResize);  
      }, []);  

  

  useEffect(() => {  
    if (Array.isArray(data) && data.length > 0) {  
      setRows(data);  
      const initialColumns = Object.keys(data[0]).map((key) => ({ key, label: key.toUpperCase() }));  
      setColumns(initialColumns);  
      setNewRow(Object.fromEntries(initialColumns.map(col => [col.key, ''])));  
    } else {  
      setRows([]);  
    }  
  }, [data]);  

  useEffect(() => setCurrentPage(1), [rowsPerPage]);  

  const totalPages = Math.ceil(rows.length / rowsPerPage);  

  const handleEdit = (index) => {
    setEditIndex(index);  
    setEditData({ ...rows[index] });  
  };  

  const handleChange = (e) => {  
    setEditData({ ...editData, [e.target.name]: e.target.value });  
  };  

  const handleSave = async () => {  
    if (editIndex !== null) {  
      const updatedRows = [...rows];  
      updatedRows[editIndex] = editData;  
      setRows(updatedRows);  
      setEditIndex(null);  
      
      try {  
        await axios.post("http://192.168.1.22:7000/api/students", editData);  
        console.log("Data updated successfully!");  
      } catch (error) {  
        console.error("Error updating data:", error);  
      }
    }  
  }

  const handleDelete = (index) => {  
    const updatedRows = rows.filter((_, i) => i !== index);  
    setRows(updatedRows);  
    if (editIndex === index) setEditIndex(null);  
    else if (editIndex > index) setEditIndex(editIndex - 1);
  };  

  const handleInputChange = (e) => {
    setNewRow({ ...newRow, [e.target.name]: e.target.value });  
  };  

  const handleAddRow = async () => {
    try {
      const validRow = Object.values(newRow).some(val => val.trim() !== "");
      if (!validRow) {
        alert("Please enter valid data before adding a new row.");
        return;
      }
        console.log("this is the new data:" , newRow)
      const response = await axios.post("http://192.168.1.22:7000/api/students", newRow);  
      const addedRow = response.data;  

      setRows([...rows, addedRow]);  
      setNewRow(Object.fromEntries(columns.map(col => [col.key, ''])));  
      console.log("New row added successfully!");  
    } catch (error) {  
      console.error("Error adding new row:", error);  
    }  
  };  

  const handleNextPage = () => {  
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);  
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedRows = Array.isArray(rows) ? rows.slice(startIndex, startIndex + rowsPerPage) : [];

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedRows.map((row, index) => (
            <tr key={startIndex + index}>
              {columns.map((col) => (
                <td key={col.key}>
                  {editIndex === startIndex + index ? (  
                    <input name={col.key} value={editData[col.key] || ""} onChange={handleChange} />  
                  ) : (
                    row[col.key] || "—"  
                  )}  
                </td>  
              ))}  
              <td>  
                {editIndex === startIndex + index ? (  
                  <button onClick={handleSave}>Save</button>  
                ) : (  
                  <button onClick={() => handleEdit(startIndex + index)}>Edit</button>  
                )}  
                <button onClick={() => handleDelete(startIndex + index)}>Delete</button>  
              </td>  
            </tr>  
          ))}  
          <tr>  
            {columns.map((col) => (  
                <td key={col.key}>  
                {newRow[col] === '_ID' ? (  
                   <></>
                ) : (  
                  <input type="text" name={col.key} value={newRow[col.key] || ""} onChange={handleInputChange} />   
                )}  
              </td>  
              ))}    
            <td><button onClick={handleAddRow}>Add</button></td>  
          </tr>  
        </tbody>  
        <tfoot>  
          <tr>  
            <td colSpan={columns.length - 1}>  
              <label>Rows per page: </label>  
              <select onChange={(e) => setRowsPerPage(Number(e.target.value))} value={rowsPerPage}>  
                {[2, 3, 4, 5].map((num) => (  
                  <option key={num} value={num}>{num}</option>  
                ))}  
              </select>  
            </td>  
            <td>  
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>&#10096;</button>  
              <button onClick={handleNextPage} disabled={currentPage >= totalPages}>&#10097;</button>  
            </td>  
          </tr>  
        </tfoot>  
      </table>  
    </div>  
  );  
};  

export default Table;
