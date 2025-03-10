import { useState, useEffect } from "react";  
import DynamicTable from "./dynamictable";
import axios from 'axios';  

function Student() {  
    const [data, setData] = useState([]);  
    const [error, setError] = useState(null);  

    useEffect(() => {  
        const fetchData = async () => {  
            try {  
                const response= await axios.get('http://192.168.1.22:7000/api/students', { timeout: 5000 });   
                // console.log("API Response:", response.data);
                
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else if (response.data && typeof response.data === "object") {
                    const keys = Object.keys(response.data);
                    const studentsKey = keys.find(key => Array.isArray(response.data[key]));
                    
                    if (studentsKey) {
                        setData(response.data[studentsKey]);
                    } else {
                        setError("error in API response!");
                    }
                } else {
                    setError("error in API response format!");
                }
            } catch (error) {  
                if (error.response) {
                    console.error("Error Response:", error.response.status, error.response.data);
                    setError("Failed to fetch data");
                } else if (error.request) {
                    setError("backend issue");
                } else {
                    setError("Request error, network issue");
                }
            }
        };  

        fetchData();  
    }, []);  

    return (  
        <div className="App">  
            { error ? (
                <p>{error}</p>
            ) : data.length > 0 ? (
                <DynamicTable data={data} />
            ) : (
                <p>No student data found.</p>
                
            )}
        </div>  
    );  
}  

export default Student;
