import { useState, useEffect } from "react";  
import DynamicTable from "./dynamictable";  
import axios from 'axios';  
import Box from "@mui/material/Box";  
import TextField from "@mui/material/TextField";  
import Button from "@mui/material/Button";   
import "./mycss/student.css";  
import Table from '@mui/material/Table';  
import TableBody from '@mui/material/TableBody';  
import TableCell from '@mui/material/TableCell';  
import TableHead from '@mui/material/TableHead';  
import TableRow from '@mui/material/TableRow';  
 
function Student() {  
    const [data, setData] = useState([]);  
    const [inputValue, setInputValue] = useState("");  
    const [error, setError] = useState(null);  
    const [newRow, setNewRow] = useState({});  
    const [fields, setFields] = useState([]); 

    useEffect(() => {  
        const fetchData = async (name) => {  
            try {  
                const token = localStorage.getItem("jsonwebtoken");
                const url = inputValue 
                    ? `${process.env.REACT_APP_API_URL}/api/students/?firstName=${encodeURIComponent(inputValue)}`
                    : `${process.env.REACT_APP_API_URL}/api/students/`;
                
                const response = await axios.get(url, {  
                    headers: { Authorization: `Bearer ${token}` },
                });
        
                if (Array.isArray(response.data)) {  
                    setData(response.data);  
                    if (response.data.length > 0) {  
                        setFields(Object.keys(response.data[0]));  
                    }  
                } else if (response.data && typeof response.data === "object") {  
                    const keys = Object.keys(response.data);  
                    const studentsKey = keys.find(key => Array.isArray(response.data[key]));  
                    
                    if (studentsKey) {  
                        setData(response.data[studentsKey]);  
                        if (response.data[studentsKey].length > 0) {  
                            setFields(Object.keys(response.data[studentsKey][0]));  
                        }  
                    } else {  
                        setError("Error in API response!");  
                    }  
                } else {  
                    setError("Error in API response format!");  
                }  
            } catch (error) {  
                setError("Request error, network issue");  
            }  
        };  

        fetchData(inputValue);   
    }, [inputValue]);  

    const handleAddRow = () => {  
        const initialRow = { id: Date.now().toString() };  
        fields.forEach(field => {  
            if (field !== "id") initialRow[field] = '';  
        });  
        setNewRow(initialRow);  
    };  

    const handleInputChange = (e) => {  
        const { name, value } = e.target;  
        setNewRow((prev) => ({  
            ...prev,  
            [name]: value,  
        }));  
    };  

    const handleSubmit = async () => {  
        try {  
            const token = localStorage.getItem("jsonwebtoken");
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/students/`, newRow, 
                {  
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if(response){
                const response1 = await axios.get(`${process.env.REACT_APP_API_URL}/api/students`, {  
                    headers: { Authorization: `Bearer ${token}` },
                
                });
                console.log(response1);
                
                setData(response1.data.data);  
                setNewRow({});  
                alert("New student added successfully!"); 
            } 
            
        } catch (error) {  
            alert("Failed to add student. Please try again.");  
        }  
    };  

    return (  
        <div className="App">   
            <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "25ch" } }} noValidate autoComplete="off">  
                <TextField  
                  id="filled-basic"  
                  label="First Name"  
                  variant="filled"  
                  value={inputValue}  
                  onChange={(e) => setInputValue(e.target.value)}  
                  placeholder="Search by first name"  
                />   
            </Box>      

                    <DynamicTable data={data} />  
                    {error ? (  
                <p>{error}</p>  
            ) : data.length > 0 ? (   
                <div>
                    <div className="buttonNew">  
                    <Button variant="contained" color="primary" onClick={handleAddRow}>  
                        Add New Row  
                    </Button>  
                    </div>
                    {Object.keys(newRow).length > 0 && (  
                        <Table sx={{ padding: 0 }}>  
                            <TableHead>  
                                <TableRow>  
                                    {fields.map((field) => (  
                                        <TableCell key={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</TableCell>  
                                    ))}  
                                    <th>Actions</th>  
                                </TableRow>  
                            </TableHead>  
                            <TableBody>  
                                <TableRow>  
                                    {fields.map((field) => (  
                                        <TableCell key={field}>  
                                            <TextField  
                                                name={field}  
                                                value={newRow[field]}  
                                                onChange={handleInputChange}  
                                                disabled={field === "_id"}  
                                                variant="outlined"  
                                            />  
                                        </TableCell>  
                                    ))}  
                                    <TableCell>  
                                        <Button variant="contained" color="success" onClick={handleSubmit}>  
                                            Submit  
                                        </Button>  
                                    </TableCell>  
                                </TableRow>  
                            </TableBody>  
                        </Table>  
                    )}  
                </div>  
            ) : (  
                <p>No student data found...</p>  
            )}  
        </div>  
    );  
}  

export default Student