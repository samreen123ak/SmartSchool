import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./mycss/signup.css";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
      console.log("first name is:", firstName, "last name is:", lastName, "email:", email, ",password:", password)
      
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`,{
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password
      });
      console.log("Signup Successful:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage("Signup failed. Please try again.");
    }
  };
  return (
    <>
      <div className="SignupFrom">
        <div className="imageside">
          <img src="signup.jpg" alt="Signup" />
        </div>
        <div className="signupformside">
          <div className="signform">
            <img src="images.png" alt="Logo" />
            <h2>Sign Up</h2>
            <Box component="form" onSubmit={handleSignup} sx={{ "& > :not(style)": { m: 1, width: "25ch" } }} noValidate autoComplete="off">
              <TextField
                label="First Name"
                variant="filled"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last Name"
                variant="filled"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <br />
              <TextField
                label="Email"
                variant="filled"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="filled"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <Button type="submit" variant="outlined">Signup</Button>
            </Box>
            {errorMessage && <p>{errorMessage}</p>}
            <p>
              *If you already have an account <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
