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
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: "#2F4F75",
                    marginBottom: "10px",
                  }}
                >
                  Visitor ID Card
                </Typography>
                <Divider sx={{ background: "#115060", height: "2px", margin: "10px 0" }} />
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={2}
                  alignItems="center"
                  sx={{ marginBottom: "10px" }}
                >
                  <Box>
                    <img
                      src={visit.IdProofPhoto || "/placeholder-image.png"}
                      alt="Visitor"
                      className="clickable-image"
                      onClick={() => handleImageClick(visit.IdProofPhoto)}
                    />
                  </Box>
                  <Box>
                    <Typography>
                      <strong>Name:</strong> {visit.VisitorName || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Mobile:</strong> {visit.Mobile || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {visit.Email || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Company:</strong> {visit.VisitorCompName || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>{visit.IdProof}:</strong> {visit.IdProofNumber || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Visitor Id:</strong> {visit.VisitorId || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Date:</strong> {visit.EntryDate || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Meeting Person:</strong> {visit.MeetingPerson || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Entry Time:</strong> {visit.EntryTime || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Exit Time:</strong> {visit.ExitTime || "N/A"}
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
