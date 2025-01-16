import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Company = () => {
    // Retrieve tenant data from localStorage
      const navigate = useNavigate();

  const storedTenant = JSON.parse(localStorage.getItem("tenant")) || {};
  const [tenant, setTenant] = useState(storedTenant);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    Tenent_Id: tenant.Tenent_Id || "",
    Name: tenant.Name || "",
    Address: tenant.Address || "",
    Mobile: tenant.Mobile || "",
    Email: tenant.Email || "",
    Logout: tenant.Logout || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change (logo upload)
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Open and close the dialog
  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handleSubmit = async () => {
  const storedTenant = JSON.parse(localStorage.getItem("tenant"));
  const tenentId = storedTenant?.Tenent_Id;

  if (!tenentId) {
    alert("Tenant ID is required!");
    return;
  }

  const formDataObj = new FormData();

  // Append the form data
  formDataObj.append("Tenent_Id", tenentId); // Ensure Tenent_Id is correctly appended
  formDataObj.append("Name", formData.Name);
  formDataObj.append("Address", formData.Address);
  formDataObj.append("Mobile", formData.Mobile);
  formDataObj.append("Email", formData.Email);
  formDataObj.append("Logout", formData.Logout);

  // Append the logo file if available
  if (selectedFile) {
    formDataObj.append("Logo", selectedFile);
  }

  try {
    const response = await fetch("https://namami-infotech.com/GuestSmile/src/auth/edit_company.php", {
      method: "POST",
      body: formDataObj,
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Company details updated successfully.");
      // Optionally, update the tenant data in state or localStorage
      setTenant((prevTenant) => ({
        ...prevTenant,
        ...formData,
        Logo: result.logoUrl || prevTenant.Logo, // Update the logo if a new one is uploaded
      }));
      
    localStorage.removeItem("user");
    navigate("/login");

    } else {
      alert("Failed to update company details: " + result.message);
    }
  } catch (error) {
    console.error("Error updating company details:", error);
    alert("An error occurred while updating company details.");
  }
};



  return (
    <Box sx={{ padding: 0, mb: 1 }}>
      <Card sx={{ maxWidth: "800px", margin: "0 auto", boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
        <CardContent>
          <Box textAlign="center" mb={3}>
            <Avatar
              src={tenant.Logo || "/placeholder-logo.png"}
              alt="Company Logo"
              sx={{ width: 100, height: 100, margin: "0 auto", boxShadow: 2 }}
            />
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2F4F75", mt: 2 }}>
              {tenant.Name || "Company Name"}
            </Typography>
          </Box>
          <Box mb={3} textAlign="center">
            <Typography variant="body1" sx={{ color: "#115060" }}>
              {tenant.Address || "Company Address"}
            </Typography>
            <Typography variant="body1" sx={{ color: "#115060" }}>
              Email: {tenant.Email || "Email Address"} | Phone: {tenant.Mobile || "Phone Number"}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Button variant="contained" sx={{ backgroundColor: "#115060" }} onClick={handleDialogOpen}>
              <EditIcon />
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Edit Company Details</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Address"
            name="Address"
            value={formData.Address}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Mobile"
            name="Mobile"
            value={formData.Mobile}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Email"
            name="Email"
            value={formData.Email}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Logout PIN"
            name="Logout"
            value={formData.Logout}
            onChange={handleInputChange}
            margin="dense"
          />
          <Button variant="contained" component="label" sx={{ marginTop: 2, backgroundColor: "#115060" }}>
            Upload Logo
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ backgroundColor: "red", color: "white" }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: "#115060" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Company;
