import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  TextField,
  Button,
  Pagination,
  Box,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Papa from "papaparse";
import { DateRange, Download, Person } from "@mui/icons-material";
import IDCard from "../components/IDCard";

const baseUrl = "https://namami-infotech.com/GuestSmile/src/visit/uploads/";
const apiUrl = "https://namami-infotech.com/GuestSmile/src/visit/get_visit.php";

const columns = [
  { id: "idCard", label: "ID Card", minWidth: 50 }, // New column for the icon
  { id: "EntryDate", label: "Date", minWidth: 150 },
  { id: "VisitorId", label: "Visitor ID", minWidth: 100 },
  { id: "VisitorPhoto", label: "Visitor", minWidth: 150 },
  { id: "VisitorName", label: "Visitor Name", minWidth: 150 },
  { id: "VisitorCompName", label: "Company Name", minWidth: 200 },
  { id: "EntryTime", label: "Entry Time", minWidth: 150 },
  { id: "ExitTime", label: "Exit Time", minWidth: 150 },
  { id: "IdProofPhoto", label: "ID Proof Photo", minWidth: 150 },
];

const VisitTable = () => {
  const [visits, setVisits] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [openPhoto, setOpenPhoto] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [openCard, setOpenCard] = useState(false);

  const handleRowClick = (visit) => {
    setSelectedVisit(visit);
    setOpenCard(true);
  };

  const handleCloseCard = () => {
    setOpenCard(false);
    setSelectedVisit(null);
  };

  useEffect(() => {
    fetchVisits();
  }, [page, rowsPerPage, fromDate, toDate]);

  const fetchVisits = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams({
      TenantId: '1',
      page,
      rowsPerPage,
      ...(fromDate && { fromDate: fromDate.toISOString().split('T')[0] }),
      ...(toDate && { toDate: toDate.toISOString().split('T')[0] }),
    });

    const response = await fetch(`${apiUrl}?${params}`);
    const data = await response.json();
    if (data.status === 'success') {
      const formattedVisits = data.visits.map((visit) => {
        const [entryDate, entryTime] = visit.CreatedAt.split(' ');
        const formattedDate = new Date(entryDate).toLocaleDateString('en-GB'); // Format to dd/mm/yyyy
        const entryTimeWithoutSeconds = entryTime.slice(0, 5); // Remove seconds
        const exitTime = visit.ExitTime ? visit.ExitTime.split(' ')[1].slice(0, 5) : 'N/A';

        const visitorPhoto = visit.VisitorPhoto.startsWith('http')
          ? visit.VisitorPhoto
          : `${baseUrl}${visit.VisitorPhoto.replace('../', '')}`;
        const idProofPhoto = visit.IdProofPhoto.startsWith('http')
          ? visit.IdProofPhoto
          : `${baseUrl}${visit.IdProofPhoto.replace('../', '')}`;

        return {
          ...visit,
          EntryDate: formattedDate,
          EntryTime: entryTimeWithoutSeconds,
          ExitTime: exitTime,
          VisitorPhoto: visitorPhoto,
          IdProofPhoto: idProofPhoto,
        };
      });
      setVisits(formattedVisits);
      setTotalPages(data.totalPages);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    setLoading(false);
  }
};


  const handleExportCSV = () => {
    const csvData = visits.map((row) => {
      const { VisitorPhoto, IdProofPhoto, ...rest } = row;
      return rest;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "filtered_visits.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handleOpenPhoto = (photoUrl) => {
    setCurrentPhoto(photoUrl);
    setOpenPhoto(true);
  };

  const handleClosePhoto = () => {
    setOpenPhoto(false);
    setCurrentPhoto("");
  };

  return (
    <div style={{ width: "100%", margin: "auto", padding: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography variant="h6" style={{ marginBottom: 16, fontWeight: "bold", textAlign: "center" }}>
          Guest List
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <DateRange style={{ marginRight: 8 }} />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={setFromDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <span style={{ marginLeft: 16, marginRight: 16 }}>to</span>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={setToDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <IconButton color="primary" onClick={handleExportCSV}>
          <Download />
        </IconButton>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 16 }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer style={{ maxHeight: 450 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow style={{ backgroundColor: "#115060" }}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      style={{
                        minWidth: col.minWidth,
                        backgroundColor: "#115060",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {visits.map((row) => (
                  <TableRow hover key={row.VisitorId}>
                    <TableCell>
                      <IconButton onClick={() => handleRowClick(row)}>
                        <Person color="primary" />
                      </IconButton>
                    </TableCell>
                    {columns.slice(1).map((col) => (
                      <TableCell key={col.id}>
                        {col.id === "VisitorPhoto" || col.id === "IdProofPhoto" ? (
                          <img
                            src={row[col.id] || "/placeholder-image.png"}
                            alt={col.label}
                            style={{ width: 50, height: 50, cursor: "pointer" }}
                            onClick={() => handleOpenPhoto(row[col.id])}
                          />
                        ) : (
                          row[col.id] || "N/A"
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
          </Box>

          <div style={{ marginTop: 16 }}>
            Rows per page:
            <select value={rowsPerPage} onChange={handleRowsPerPageChange} style={{ marginLeft: 8 }}>
              {[10, 25, 50].map((rows) => (
                <option key={rows} value={rows}>
                  {rows}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <Dialog open={openPhoto} onClose={handleClosePhoto} maxWidth="lg">
        <DialogContent>
          <img src={currentPhoto} alt="Full size" style={{ width: "400px", height: "400px" }} />
        </DialogContent>
      </Dialog>

      {/* Render the IDCard */}
      <IDCard open={openCard} onClose={handleCloseCard} visit={selectedVisit} />
    </div>
  );
};

export default VisitTable;
