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
  const [newRow, setNewRow] = useState({});  

  // when ever data props change

  useEffect(() => {  
    // check array data is empty or not
    if (Array.isArray(data) && data.length > 0) { 
      // its update row with set rows 
      setRows(data); 
      // etract key from first object 
      const initialColumns = Object.keys(data[0]).map((key) => ({ key, label: key.toUpperCase() })); 
      // update the column with new with newley created column 
      setColumns(initialColumns);
        // It creates a new row object. It iterates through the initialColumns, creating key-value pairs where the key is the column key, and the value is an empty string. Then, uses Object.fromEntries to convert these pairs to a new object and updates the newRow state.
      setNewRow(Object.fromEntries(initialColumns.map(col => [col.key, ''])));  
    } else {  
      // if data is not set it an empty array
      setRows([]);  
    }  
  }, [data]); 
  
  // set the current page value 1 when the change in pagination

  useEffect(() => setCurrentPage(1), [rowsPerPage]);  


  // rows.lenght,this likely refers to the total number of items or data entries available.
  const totalPages = Math.ceil(rows.length / rowsPerPage);  

  // function on click edit button

  const handleEdit = (index) => {  
    setEditIndex(index);  
    setEditData({ ...rows[index] });  
  };  


  // text field data

  const handleChange = (e) => {  
    setEditData({ ...editData, [e.target.name]: e.target.value });  
  };  

  // ------------------------------------------------------------------------------------------------------------------------------------//


// for save the data

  const handleSave = async () => {  
    if (editIndex !== null) {  
        try {  
            const idToUpdate = editData._id;  
            const response = await axios.put(`http://192.168.1.22:7000/api/students/${idToUpdate}`, editData);  
            if (response){
              alert("Data save Successfully");

            }
        } catch (error) {
            alert("Failed to update data. Please try again.");  
        }
    }
};

//-------------------------------------------------------------------------------------------------------------------------------------//


// for delete the data
const handleDelete = async (index) => {  
  const idToDelete = rows[index]?._id;  

  try {  
      const response = await axios.delete(`http://192.168.1.22:7000/api/students/${idToDelete}`); 
  } catch (error) {   
      alert("Failed to delete data. Please check the console for details.");  
  }
};  

// ------------------------------------------------------------------------------------------------------------------------------------//

// add new row

const handleAddRow = async () => {  
    try {  
      const validRow = Object.values(newRow).some(val => val.trim() !== "");  
      if (!validRow) {  
        alert("Please enter valid data before adding a new row.");  
        return;  
      }  
      const response = await axios.post("http://192.168.1.22:7000/api/students", newRow);  
      const addedRow = response.data;  

      setRows([...rows, addedRow]);  
      setNewRow(Object.fromEntries(columns.map(col => [col.key, ''])));  
      console.log("New row added successfully!");  
    } catch (error) {  
      console.error("Error adding new row:", error);  
    }  
  }; 

// ------------------------------------------------------------------------------------------------------------------------------------//

// for the text field

  const handleInputChange = (e) => {  
    setNewRow({ ...newRow, [e.target.name]: e.target.value });  
  }; 

// ------------------------------------------------------------------------------------------------------------------------------------//

// for the pages
  const handleNextPage = () => {  
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);  
  };  

  const handlePreviousPage = () => {  
    if (currentPage > 1) setCurrentPage(currentPage - 1);  
  };  

  const startIndex = (currentPage - 1) * rowsPerPage;  
  const selectedRows = Array.isArray(rows) ? rows.slice(startIndex, startIndex + rowsPerPage) : [];  
// ------------------------------------------------------------------------------------------------------------------------------------//


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
                  {col.key === '_id' ? (   
                    row[col.key] || "—"  
                  ) : (  
                    editIndex === startIndex + index ? (  
                      <input name={col.key} value={editData[col.key] || ""} onChange={handleChange} />  
                    ) : (  
                      row[col.key] || "—"  
                    )  
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
                {col.key === '_id' ? (  
                  <p>(Auto-generated)</p>
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
















// delete

// if (!idToDelete) {  
//   console.error("No valid ID found for deletion."); 
//   return;   
// } 


// if (response.status === 204) { 
//   const updatedRows = rows.filter((_, i) => i !== index);  
//   setRows(updatedRows);  
//   console.log("Row deleted successfully!");  
//   if (editIndex === index) {  
//       setEditIndex(null);  
//   } else if (editIndex > index) {  
//       setEditIndex(editIndex - 1);  
//   }  
// } else {  
//   console.error("Failed to delete:", response.data);  
//   alert("Failed to delete data. Please check the server response.");  
// } 




// if (response.data) {  
//   const updatedRows = [...rows];  
//   updatedRows[editIndex] = response.data; 
//   setRows(updatedRows);  
//   setEditIndex(null);  
//   console.log("Data updated successfully!");  
// }



// edit
// const addedRow = response.data;  
// setRows([...rows, addedRow]);  
// setNewRow(Object.fromEntries(columns.map(col => [col.key, ''])));  
// console.log("New row added successfully!");  