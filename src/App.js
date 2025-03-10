import React from "react";  
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  
import Layout from "./components/Layout";  
import "./App.css";  
import Signup from "./components/Signup";  
import Login from "./components/Login";  
import Student from "./components/Students";  

function App() {  
  return (  
    <Router>  
      <Routes>  
        <Route path="/signup" element={<Signup />} />  
        <Route path="/login" element={<Login />} />  
        <Route  
          path="/student"  
          element={  
            <Layout>  
              <Student />  
            </Layout>  
          }  
        />  
        <Route path="/" element={<Layout />} />  
      </Routes>  
    </Router>  
  );  
}  

export default App;  
