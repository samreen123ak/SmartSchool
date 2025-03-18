import React, { useState, useEffect } from "react";  
import axios from 'axios';  
import Table from '@mui/material/Table';  
import TableBody from '@mui/material/TableBody';  
import TableCell from '@mui/material/TableCell';  
import TableContainer from '@mui/material/TableContainer';  
import TableHead from '@mui/material/TableHead';  
import TableRow from '@mui/material/TableRow';  
import Paper from '@mui/material/Paper';  
import './mycss/std.css';  
import { Button, Select, MenuItem, InputLabel, FormControl, TextField } from '@mui/material';  

const CustomTable = ({ data }) => {  
  const [rows, setRows] = useState(Array.isArray(data) ? data : []);  
  const [editIndex, setEditIndex] = useState(null);  
  const [editData, setEditData] = useState({});  
  const [currentPage, setCurrentPage] = useState(1);  
  const [rowsPerPage, setRowsPerPage] = useState(2);  
  const [columns, setColumns] = useState([]);   

  useEffect(() => {  
    if (Array.isArray(data) && data.length > 0) {   
      setRows(data);  
      const initialColumns = Object.keys(data[0]).map((key) => ({ key, label: key.toUpperCase() }));   
      setColumns(initialColumns);  
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
      const idToUpdate = editData._id; 
      const token = localStorage.getItem("jsonwebtoken");   
      const updatedRows = rows.map((row, index) => (index === editIndex ? editData : row));  
      setRows(updatedRows);  
      setEditIndex(null);  
      try {  
        await axios.put(`${process.env.REACT_APP_API_URL}/api/students/${idToUpdate}`, editData,{  
          headers: { Authorization: `Bearer ${token}` },
      });  
        alert("Data saved successfully");  
      } catch (error) {  
        alert("Failed to update data. Please try again.");  
        setRows(rows);  
      }  
    }  
  };  

  const handleDelete = async (index) => {
    const token = localStorage.getItem("jsonwebtoken");  
    const idToDelete = rows[index]?._id;  
    const updatedRows = rows.filter((_, i) => i !== index);  
    setRows(updatedRows);  
    try {  
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/students/${idToDelete}`,{  
        headers: { Authorization: `Bearer ${token}` },
    });  
      console.log("Row deleted successfully!");  
      if (editIndex === index) {  
        setEditIndex(null);  
      } else if (editIndex > index) {  
        setEditIndex(editIndex - 1);  
      }  
    } catch (error) {  
      alert("Failed to delete data. Please check the console for details.");  
      setRows(rows);  
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
    <div className="Mytable">  
      <TableContainer component={Paper} sx={{ fontSize: '0.875rem', padding: '1px', width: "100%" }}>  
        <Table sx={{ padding: 0 }}>  
          <TableHead>  
            <TableRow>  
              {columns.map((col) => (  
                <TableCell key={col.key}>{col.label}</TableCell>  
              ))}  
              <TableCell>Actions</TableCell>  
            </TableRow>  
          </TableHead>  
          <TableBody>  
            {selectedRows.map((row, index) => (  
              <TableRow key={startIndex + index}>  
                {columns.map((col) => (  
                  <TableCell sx={{ padding: 0 }} key={col.key}>  
                    {col.key === '_id' ? (  
                      row[col.key] || "Auto generated"  
                    ) : (  
                      editIndex === startIndex + index ? (  
                        <TextField  
                          name={col.key}  
                          value={editData[col.key] || ""}  
                          onChange={handleChange}  
                          fullWidth  
                        />  
                      ) : (  
                        row[col.key] || "—"  
                      )  
                    )}  
                  </TableCell>  
                ))}  
                <TableCell sx={{ padding: 0 }}>  
                  {editIndex === startIndex + index ? (  
                    <Button variant="contained" onClick={handleSave}>Save</Button>  
                  ) : (  
                    <Button variant="contained" onClick={() => handleEdit(startIndex + index)}>Edit</Button>  
                  )}  
                  <Button variant="contained" color="error" onClick={() => handleDelete(startIndex + index)}>Delete</Button>  
                </TableCell>  
              </TableRow>  
            ))}  
          </TableBody>  
          <tfoot>  
            <TableRow>  
              <TableCell sx={{ padding: 0 }} colSpan={columns.length - 1}>  
                <FormControl variant="filled" fullWidth>  
                  <InputLabel>Rows per page</InputLabel>  
                  <Select  
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}  
                    value={rowsPerPage}  
                  >  
                    {[2, 3, 4, 5].map((num) => (  
                      <MenuItem key={num} value={num}>{num}</MenuItem>  
                    ))}  
                  </Select>  
                </FormControl>  
              </TableCell>  
              <TableCell sx={{ padding: 0 }} colSpan={2}>  
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>◀</Button>  
                <Button onClick={handleNextPage} disabled={currentPage >= totalPages}>▶</Button>  
              </TableCell>  
            </TableRow>  
          </tfoot>  
        </Table>  
      </TableContainer>  
    </div>  
  );  
};  

export default CustomTable;
