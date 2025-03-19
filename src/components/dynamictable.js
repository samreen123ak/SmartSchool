import React, { useState, useEffect } from "react";
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Paper, 
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  Tooltip,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const CustomTable = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [rows, setRows] = useState(Array.isArray(data) ? data : []);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setRows(data);
      // Filter out columns that might cause overflow on smaller screens
      const initialColumns = Object.keys(data[0])
        .filter(key => {
          // Hide more columns on mobile and tablet to prevent overflow
          if (isMobile) {
            return !['createdAt', 'updatedAt', 'description', 'address'].includes(key);
          }
          if (isTablet) {
            return !['createdAt', 'updatedAt'].includes(key);
          }
          return true;
        })
        .map((key) => ({ 
          key, 
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ') 
        }));
      setColumns(initialColumns);
    } else {
      setRows([]);
    }
  }, [data, isMobile, isTablet]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...rows[index] });
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (editIndex !== null) {
      setIsLoading(true);
      const idToUpdate = editData._id;
      const token = localStorage.getItem("jsonwebtoken");
      
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/students/${idToUpdate}`, 
          editData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const updatedRows = rows.map((row, index) => 
          (index === editIndex ? editData : row)
        );
        
        setRows(updatedRows);
        setEditIndex(null);
      } catch (error) {
        console.error("Failed to update data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setIsLoading(true);
      const token = localStorage.getItem("jsonwebtoken");
      const idToDelete = rows[index]?._id;
      
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/students/${idToDelete}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
        
        if (editIndex === index) {
          setEditIndex(null);
        } else if (editIndex !== null && editIndex > index) {
          setEditIndex(editIndex - 1);
        }
      } catch (error) {
        console.error("Failed to delete data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        width: '100%',
        overflowX: 'hidden' // Prevent horizontal overflow
      }}
    >
      <TableContainer 
        sx={{ 
          maxHeight: 'auto',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          }
        }}
      >
        <Table 
          stickyHeader 
          size={isMobile ? "small" : "medium"}
          aria-label="student data table"
          sx={{ 
            tableLayout: 'fixed',
            minWidth: isMobile ? 'auto' : 650
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell 
                  key={col.key}
                  align="left"
                  sx={{ 
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    padding: isMobile ? '8px 6px' : '16px',
                    // Adjust column widths based on content type
                    width: col.key === '_id' ? '80px' : 
                           col.key.includes('name') ? '120px' :
                           col.key.includes('email') ? '150px' : 'auto',
                    maxWidth: col.key === '_id' ? '80px' : 
                              col.key.includes('description') ? '200px' : '150px'
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              <TableCell 
                align="right"
                sx={{ 
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  padding: isMobile ? '8px 6px' : '16px',
                  width: '100px' // Fixed width for actions column
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, index) => {
              const actualIndex = page * rowsPerPage + index;
              const isEditing = editIndex === actualIndex;
              
              return (
                <TableRow 
                  key={actualIndex}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {columns.map((col) => (
                    <TableCell 
                      key={col.key}
                      align="left"
                      sx={{ 
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        padding: isMobile ? '8px 6px' : '16px 16px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        // Remove nowrap for better text wrapping
                        whiteSpace: col.key === '_id' ? 'nowrap' : 'normal'
                      }}
                    >
                      {col.key === '_id' ? (
                        <Typography variant="body2" noWrap>
                          {row[col.key] || "Auto generated"}
                        </Typography>
                      ) : (
                        isEditing ? (
                          <TextField
                            name={col.key}
                            value={editData[col.key] || ""}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                          />
                        ) : (
                          <Typography 
                            variant="body2" 
                            sx={{
                              // Allow text to wrap for longer content
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              // Limit to 2 lines with ellipsis
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {row[col.key] || "—"}
                          </Typography>
                        )
                      )}
                    </TableCell>
                  ))}
                  <TableCell 
                    align="right"
                    sx={{ 
                      whiteSpace: 'nowrap',
                      padding: isMobile ? '4px' : '8px'
                    }}
                  >
                    {isEditing ? (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <Tooltip title="Save">
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={handleSave}
                            disabled={isLoading}
                          >
                            <SaveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton 
                            size="small" 
                            color="default" 
                            onClick={handleCancel}
                            disabled={isLoading}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => handleEdit(actualIndex)}
                            disabled={isLoading}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDelete(actualIndex)}
                            disabled={isLoading}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={columns.length + 1} />
              </TableRow>
            )}
            {rows.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + 1} 
                  align="center"
                  sx={{ py: 3 }}
                >
                  <Typography variant="body1">No data available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ 
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: isMobile ? '0.75rem' : '0.875rem',
          }
        }}
      />
    </Paper>
  );
};

export default CustomTable;