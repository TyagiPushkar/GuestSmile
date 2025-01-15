import React, { useState } from "react";
import {
  CardContent,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogContent,
  Divider,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import "../assets/css/IDCard.css";

const IDCard = ({ open, onClose, visit }) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Get tenant details from localStorage
  const tenant = JSON.parse(localStorage.getItem("tenant")) || {};

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedImage(null);
  };

  if (!visit) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            background: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <DialogContent style={{ position: "relative", background: "transparent" }}>
          <IconButton
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "white",
              zIndex: 100,
            }}
            onClick={onClose}
          >
            <Close />
          </IconButton>
          <div className="card-container">
            <div className="card">
             <CardContent className="id-card-content">
  {/* Company Logo Watermark */}
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      opacity: 0.2, 
      zIndex: 0,   
    }}
  >
    <img
      src={tenant.Logo || "/placeholder-logo.png"} // Company Logo
      alt="Company Logo"
      style={{
        height: "300px", // Adjust size for watermark effect
        width: "auto",
        transform: "rotate(0deg)", // Adjust rotation for watermark effect
      }}
    />
  </Box>

  {/* Top Section: Visitor ID */}
  <Box display="flex" justifyContent="center" mb={2} zIndex={1}>
    <Typography
      variant="h6"
      sx={{ fontWeight: "bold", color: "#115060" }}
    >
      Visitor ID - {visit.VisitorId || "N/A"}
    </Typography>
  </Box>

  {/* Visitor Image in the Center */}
  <Box display="flex" justifyContent="center" mb={1} zIndex={1}>
    <img
      src={visit.VisitorPhoto || "/placeholder-image.png"}
      alt="Visitor"
      className="clickable-image"
      onClick={() => handleImageClick(visit.VisitorPhoto)}
      style={{ maxHeight: "150px", borderRadius: "10px", zIndex: 100 }}
    />
  </Box>

  {/* Visitor Details */}
  <Box sx={{ paddingLeft: "70px", zIndex: 1 }}>
    <Typography>
      <strong>Name &nbsp;: &nbsp; {visit.VisitorName || "N/A"}</strong>
    </Typography>
    <Typography>
      <strong>Mobile &nbsp;: &nbsp;{visit.Mobile || "N/A"}</strong>
    </Typography>
    <Typography>
      <strong>Email &nbsp;: &nbsp;{visit.Email || "N/A"}</strong>
    </Typography>
    <Typography>
      <strong>{visit.IdProof} &nbsp;: &nbsp;{visit.IdProofNumber || "N/A"}</strong>
    </Typography>
    <Typography>
      <strong>Company &nbsp;: &nbsp;{visit.VisitorCompName || "N/A"}</strong>
    </Typography>
    <Typography>
      <strong>In Date Time &nbsp;: &nbsp;{visit.EntryDate || "N/A"} {visit.EntryTime || "N/A"}</strong>
    </Typography>
    <Typography>
      <strong>Meeting Person &nbsp;: &nbsp;{visit.MeetingPerson || "N/A"}</strong>
    </Typography>
  </Box>

  <Divider sx={{ background: "#115060", height: "4px", margin: "20px 0" }} />

  {/* Bottom Section: Company Info */}
  <Box display="flex" justifyContent="center" zIndex={1}>
    <Box textAlign="center">
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2F4F75" }}>
        {tenant.Name || "Company Name"}
      </Typography>
      <Typography variant="body2" sx={{ color: "#2F4F75", marginBottom: "5px" }}>
        {tenant.Address || "Company Address"}
      </Typography>
      <Typography variant="body2" sx={{ color: "#2F4F75", marginBottom: "10px" }}>
        {tenant.Email || "Email"} | {tenant.Mobile || "Phone"}
      </Typography>
    </Box>
  </Box>
</CardContent>

            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      {selectedImage && (
        <Dialog
          open={imageDialogOpen}
          onClose={handleCloseImageDialog}
          PaperProps={{
            style: {
              background: "transparent",
              boxShadow: "none",
            },
          }}
        >
          <DialogContent style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={selectedImage}
              alt="Zoomed"
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default IDCard;
