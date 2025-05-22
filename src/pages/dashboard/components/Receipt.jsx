
import React, { useRef } from "react";
import { Box, Typography, Grid, Button, Divider } from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Receipt = ({ receipt }) => {
  const receiptRef = useRef();

  const generatePDF = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, { useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "px", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt_${receipt.transactionId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Box
      ref={receiptRef}
      sx={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        backgroundColor: "#fff",
        color: "#000",
        borderRadius: "10px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        Beks Technology
      </Typography>
      <Typography variant="subtitle2" align="center" gutterBottom>
        Payment Receipt
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography fontWeight="bold">Transaction ID:</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography>{receipt.transactionId}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight="bold">Student Name:</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography>{receipt.userName}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight="bold">Program:</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography>{receipt.program}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight="bold">Amount Paid:</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography>₦{(receipt.amount ).toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight="bold">Status:</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography>{receipt.status}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight="bold">Date:</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography>{receipt.date}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" align="center">
        Thank you for your payment!
      </Typography>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={generatePDF}
        sx={{ mt: 2 }}
      >
        Download Receipt
      </Button>
    </Box>
  );
};

export default Receipt;
