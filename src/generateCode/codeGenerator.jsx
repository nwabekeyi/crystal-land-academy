import React, { useState } from "react";
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Modal from "../pages/dashboard/components/modal";
import useApi from "../hooks/useApi";
import { endpoints } from "../utils/constants";
import ActionButton from "../pages/dashboard/components/actionButton";

const CodeGenerator = () => {
  const [codes, setCodes] = useState(""); // Local state for handling codes
  const [modalOpen, setModalOpen] = useState(false); // State to handle modal visibility
  const [studentType, setStudentType] = useState(""); // State to store selected student type
  const [amountPaid, setAmountPaid] = useState(""); // State to handle amount paid by online students
  const [dialogOpen, setDialogOpen] = useState(false); // State for the dialog visibility

  // Hook for making API calls
  const { loading, callApi, error } = useApi();

  // Function to generate the code
  const generateCode = async () => {
    const length = 11;
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    // Generate a random 11-character alphanumeric code
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Append additional information for online students
    if (studentType === "online") {
      result += `/onlinestudent/${amountPaid}`;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const newCode = {
      code: result,
      studentType,
      amountPaid: studentType === "online" ? amountPaid : null,
      generatedDate: formattedDate,
      generatedTime: formattedTime,
      used: false,
      error: null, // Default to null, assuming no error initially
      isAuthenticated: false, // Default as not authenticated
      userId: null, // Optional, currently null unless linked to a user
    };

    try {
      const url = endpoints.STORE_CODE
      // Send the generated code to the backend
      await callApi(url, "POST", newCode);

      // Update local state and display the modal
      setCodes(result);
      setModalOpen(true);
    } catch (err) {
      console.error("Error saving code to the database:", error);
      alert(`Failed to save code to the database. Error: ${error}`);
    }

    setDialogOpen(false); // Close the dialog
    setAmountPaid(""); // Reset amountPaid input
    setStudentType(""); // Reset student type
  };

  // Function to handle the dialog submission
  const handleDialogSubmit = () => {
    if (studentType === "online" && !amountPaid) {
      alert("Please enter the amount paid.");
      return;
    }
    generateCode();
  };

  return (
    <div
      style={{
        padding: " 0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: "20px" }}>
      <ActionButton 
          onClick={() => setDialogOpen(true)}
          content= {loading ? "Generating..." : "Generate Code"}
      />
        

        {/* Dialog to select student type */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Select Student Type</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <ActionButton 
                onClick={() => setStudentType("offline")}
                content= 'Oflline Students'
              />

              <ActionButton 
                onClick={() => setStudentType("online")}
                content= 'Online Students'
              />
              {studentType === "online" && (
                <TextField
                  label="Amount Paid"
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  fullWidth
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
          <ActionButton 
                onClick={() => setDialogOpen(false)}
                content= 'Cancel'
              />

              <ActionButton 
                onClick={handleDialogSubmit}
                content= 'Confirm'
              />
          </DialogActions>
        </Dialog>

        {/* Modal to display the generated code */}
        {modalOpen && (
          <Modal
            open={true}
            onClose={() => setModalOpen(false)}
            title="This is your generated code below:"
            noConfirm
          >
            <p>{codes}</p>
          </Modal>
        )}
      </Box>
    </div>
  );
};

export default CodeGenerator;
