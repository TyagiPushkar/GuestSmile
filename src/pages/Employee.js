import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import axios from 'axios';

const columns = [
  { id: 'EmpId', label: 'EmpId', minWidth: 50 },
  { id: 'Name', label: 'Name', minWidth: 150 },
  { id: 'Email', label: 'Email', minWidth: 200 },
  { id: 'Mobile', label: 'Mobile', minWidth: 150 },
  { id: 'Role', label: 'Role', minWidth: 100 },
  { id: 'Department', label: 'Department', minWidth: 150 },
];

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // Retrieve user object from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.TenantId) {
      const tenantId = user.TenantId;  // Using TenantId from localStorage
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
  }, []);

  return (
    <div sx={{ width: '100%', margin: 'auto', mt: 0, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
        Employee List
      </Typography>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#9FAFC9' }}>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  style={{
                    minWidth: col.minWidth,
                    backgroundColor: '#9FAFC9',
                    color: 'black',
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
                  <TableCell key={col.id}>{row[col.id]}</TableCell>
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
    </div>
  );
}
