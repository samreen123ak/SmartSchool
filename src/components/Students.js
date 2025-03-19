import { useState, useEffect } from "react";
import DynamicTable from "./dynamictable";
import axios from 'axios';
import { 
  Box, 
  TextField, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Grid, 
  Typography, 
  Paper, 
  InputAdornment, 
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  FormHelperText
} from "@mui/material";
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  Close as CloseIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import "./mycss/student.css";

function Student() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const [newRow, setNewRow] = useState({});
  const [fields, setFields] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);

  useEffect(() => {
    fetchData();
  }, [inputValue]);

  const fetchData = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRow = () => {
    const initialRow = { id: Date.now().toString() };
    fields.forEach(field => {
      if (field !== "id" && field !== "_id") initialRow[field] = '';
    });
    setNewRow(initialRow);
    setValidationErrors({});
    setFormTouched(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const validateField = (name, value) => {
    // Check if field is empty
    if (!value || value.trim() === '') {
      return `${formatFieldLabel(name)} is required`;
    }
    
    // Email validation
    if (name.toLowerCase().includes('email')) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    // Phone validation (if field contains 'phone')
    if (name.toLowerCase().includes('phone')) {
      const phoneRegex = /^\+?[0-9\s-()]{10,15}$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
      }
    }
    
    return null;
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Validate all fields except _id and id
    Object.keys(newRow).forEach(field => {
      if (field !== "_id" && field !== "id") {
        const error = validateField(field, newRow[field]);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      }
    });
    
    // Check for any missing fields that should be in the form
    fields.forEach(field => {
      if (field !== "_id" && field !== "id" && !newRow.hasOwnProperty(field)) {
        errors[field] = `${formatFieldLabel(field)} is required`;
        isValid = false;
      }
    });
    
    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update the form values
    setNewRow(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Validate the field
    const error = validateField(name, value);
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Mark form as touched
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Validate on blur
    const error = validateField(name, value);
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    const isValid = validateForm();
    
    if (!isValid) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields correctly",
        severity: "error"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("jsonwebtoken");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/students/`, 
        newRow,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response) {
        await fetchData();
        setNewRow({});
        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: "New student added successfully!",
          severity: "success"
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add student. Please try again.",
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Group fields into logical sections (customize as needed)
  const getFieldGroups = () => {
    const personalFields = fields.filter(field => 
      field !== "_id" && 
      field !== "id" && 
      (field.toLowerCase().includes('name') || 
       field.toLowerCase().includes('email') || 
       field.toLowerCase().includes('phone') || 
       field.toLowerCase().includes('gender') || 
       field.toLowerCase().includes('dob') || 
       field.toLowerCase().includes('birth'))
    );
    
    const addressFields = fields.filter(field => 
      field !== "_id" && 
      field !== "id" && 
      (field.toLowerCase().includes('address') || 
       field.toLowerCase().includes('city') || 
       field.toLowerCase().includes('state') || 
       field.toLowerCase().includes('country') || 
       field.toLowerCase().includes('zip') || 
       field.toLowerCase().includes('postal'))
    );
    
    const academicFields = fields.filter(field => 
      field !== "_id" && 
      field !== "id" && 
      !personalFields.includes(field) && 
      !addressFields.includes(field)
    );
    
    return {
      personal: personalFields,
      address: addressFields.length > 0 ? addressFields : [],
      academic: academicFields
    };
  };

  const fieldGroups = getFieldGroups();

  // Format field label for better display
  const formatFieldLabel = (field) => {
    return field
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Check if there are any validation errors
  const hasValidationErrors = Object.keys(validationErrors).some(key => validationErrors[key] !== null);

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Student Management
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          id="search-student"
          label="Search Students"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by first name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Student Records {isLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddRow}
          startIcon={<AddIcon />}
          disabled={isLoading || fields.length === 0}
        >
          Add New Student
        </Button>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : data.length > 0 ? (
        <DynamicTable data={data} />
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
          <Typography variant="body1">No student data found...</Typography>
        </Paper>
      )}

      {/* Add Student Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Add New Student
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {formTouched && hasValidationErrors && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Please correct the errors below before submitting
            </Alert>
          )}
          
          <Grid container spacing={3}>
            {/* Personal Information */}
            {fieldGroups.personal.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    Personal Information
                  </Typography>
                </Grid>
                {fieldGroups.personal.map((field) => (
                  <Grid item xs={12} sm={6} md={4} key={field}>
                    <TextField
                      fullWidth
                      required
                      label={formatFieldLabel(field)}
                      name={field}
                      value={newRow[field] || ""}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      size="small"
                      error={Boolean(validationErrors[field])}
                      helperText={validationErrors[field]}
                      InputProps={{
                        endAdornment: validationErrors[field] ? (
                          <InputAdornment position="end">
                            <ErrorIcon color="error" fontSize="small" />
                          </InputAdornment>
                        ) : null
                      }}
                    />
                  </Grid>
                ))}
              </>
            )}
            
            {/* Address Information */}
            {fieldGroups.address.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                    Address Information
                  </Typography>
                </Grid>
                {fieldGroups.address.map((field) => (
                  <Grid item xs={12} sm={6} md={field.toLowerCase().includes('address') ? 12 : 4} key={field}>
                    <TextField
                      fullWidth
                      required
                      label={formatFieldLabel(field)}
                      name={field}
                      value={newRow[field] || ""}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      size="small"
                      error={Boolean(validationErrors[field])}
                      helperText={validationErrors[field]}
                      InputProps={{
                        endAdornment: validationErrors[field] ? (
                          <InputAdornment position="end">
                            <ErrorIcon color="error" fontSize="small" />
                          </InputAdornment>
                        ) : null
                      }}
                    />
                  </Grid>
                ))}
              </>
            )}
            
            {/* Academic Information */}
            {fieldGroups.academic.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                    Academic Information
                  </Typography>
                </Grid>
                {fieldGroups.academic.map((field) => (
                  <Grid item xs={12} sm={6} md={4} key={field}>
                    <TextField
                      fullWidth
                      required
                      label={formatFieldLabel(field)}
                      name={field}
                      value={newRow[field] || ""}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      size="small"
                      error={Boolean(validationErrors[field])}
                      helperText={validationErrors[field]}
                      InputProps={{
                        endAdornment: validationErrors[field] ? (
                          <InputAdornment position="end">
                            <ErrorIcon color="error" fontSize="small" />
                          </InputAdornment>
                        ) : null
                      }}
                    />
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit" disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={isLoading || (formTouched && hasValidationErrors)}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Saving..." : "Save Student"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default Student;