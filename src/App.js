import React from "react";  
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  
import Layout from "./components/Layout";  
import "./App.css";  
import Signup from "./components/Signup";  
import Login from "./components/Login";  
import Student from "./components/Students";  
// import PrivateRoute from './components/PrivateRoute';
function App() { 
  // const isAuthenticated = localStorage.getItem('jsonwebtoken'); 
  return (  
    <Router>  
      <Routes>  
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>  */}
        <Route path="/" element={<Layout />} /> 
          <Route path="/student" element={<Layout><Student /></Layout>} />  
        {/* </Route>   */}
         
      </Routes>  
    </Router>  
  );  
}  

export default App;  
