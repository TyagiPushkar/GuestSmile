import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import axios from 'axios';

const columns = [
  { id: 'EmpId', label: 'EmpId', minWidth: 50 },
  { id: 'Name', label: 'Name', minWidth: 150 },
  { id: 'Email', label: 'Email', minWidth: 200 },
  { id: 'Mobile', label: 'Mobile', minWidth: 150 },
  { id: 'Role', label: 'Role', minWidth: 100 },
  { id: 'Department', label: 'Department', minWidth: 150 },
  { id: 'Active', label: 'Status', minWidth: 100 },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    Name: '',
    Email: '',
    Department: '',
    Mobile: '',
    EmpId: '',
    Active: 1,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.TenantId) {
      const tenantId = user.TenantId;
      axios
        .get(`https://namami-infotech.com/GuestSmile/src/employees/get_employee.php?tenantid=${tenantId}`)
        .then((response) => {
          if (response.data.status === 'success') {
            setEmployees(response.data.employees);
          } else {
            console.error('Error:', response.data.message);
          }
        })
        .catch((error) => console.error('Fetch error:', error));
    } else {
      console.error('TenantId is not available in user object or localStorage');
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.TenantId) {
      const tenantId = user.TenantId;

      axios
        .post('https://namami-infotech.com/GuestSmile/src/employees/add_employee.php', {
          ...newEmployee,
          TenantId: tenantId,
        })
        .then((response) => {
          if (response.data.status === 'success') {
            fetchEmployees(); // Refresh the employee list
            handleCloseModal(); // Close the modal
          } else {
            console.error('Error:', response.data.message);
          }
        })
        .catch((error) => console.error('Add error:', error));
    }
  };

  const toggleEmployeeStatus = (empId, currentStatus) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.TenantId) {
      const tenantId = user.TenantId;
      const newStatus = currentStatus === 1 ? 0 : 1;

      axios
        .post('https://namami-infotech.com/GuestSmile/src/employees/active_employee.php', {
          EmpId: empId,
          TenantId: tenantId,
          Active: newStatus,
        })
        .then((response) => {
          if (response.data.status === 'success') {
            fetchEmployees();
          } else {
            console.error('Error:', response.data.message);
          }
        })
        .catch((error) => console.error('Status toggle error:', error));
    }
  };

  return (
    <div sx={{ width: '100%', margin: 'auto', p: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
          Employee List
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          sx={{ mb: 2, backgroundColor: '#115060' }}
        >
          Add Employee
        </Button>
      </div>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'black' }}>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  style={{
                    minWidth: col.minWidth,
                    backgroundColor: '#115060',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover key={row.EmpId}>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {col.id === 'Active' ? (
                      <IconButton
                        onClick={() => toggleEmployeeStatus(row.EmpId, row.Active)}
                        color={row.Active === 1 ? 'success' : 'error'}
                      >
                        {row.Active === 1 ? <CheckCircle /> : <Cancel />}
                      </IconButton>
                    ) : (
                      row[col.id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        count={employees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Add Employee Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Employee
          </Typography>
          <TextField
            label="Name"
            name="Name"
            fullWidth
            sx={{ mb: 2 }}
            value={newEmployee.Name}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            name="Email"
            fullWidth
            sx={{ mb: 2 }}
            value={newEmployee.Email}
            onChange={handleInputChange}
          />
          <TextField
            label="Department"
            name="Department"
            fullWidth
            sx={{ mb: 2 }}
            value={newEmployee.Department}
            onChange={handleInputChange}
          />
          <TextField
            label="Mobile"
            name="Mobile"
            fullWidth
            sx={{ mb: 2 }}
            value={newEmployee.Mobile}
            onChange={handleInputChange}
          />
          <TextField
            label="Employee ID"
            name="EmpId"
            fullWidth
            sx={{ mb: 2 }}
            value={newEmployee.EmpId}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleAddEmployee}>
            Add Employee
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
