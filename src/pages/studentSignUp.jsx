import React from "react";
import { Box, Typography } from "@mui/material";
import SignUpForm from "../components/signUp";
import Navbar from "../pages/homePage/components/Header";
import Footer from "../pages/homePage/components/Footer";
import myImage from "../pages/homePage/assets/islamic_learning.png"; // Reuse the same image as CodeAuthenticator or replace with your own

const OfflineSignUp = () => {
  return (
    <Box>
      {/* Navbar */}
      <Navbar />

      {/* Body */}
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        {/* Background Image with Dark Overlay */}
        <Box
          sx={{
            width: { xs: "0%", md: "50%" },
            height: "100%",
            display: { xs: "none", md: "block" },
            backgroundImage: `url(${myImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay
              color: "#fff",
              padding: "40px",
              borderRadius: "12px",
              width: "70%",
              maxWidth: "600px",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Complete Your Enrollment
            </Typography>
            <Typography variant="h6" mt={2}>
              Fill out the form to join Crystal Land Academy.
            </Typography>
            <Typography variant="body1" mt={1}>
              Contact <strong>+234 812 345 6789</strong> for assistance.
            </Typography>
          </Box>
        </Box>

        {/* Form Section */}
        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", md: "50%" },
            padding: " 20px",
            placeContent: "center",
            alignItems: "center",
            height: "auto",
            flexDirection: "column",
            backgroundColor: "#fff",
            overflowY: 'scroll'
          }}
        >
          <Box
            sx={{
              width: "100%",
              padding: "5%",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              height: '100%'
            }}
          >
            <SignUpForm studentReg role="student" />
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default OfflineSignUp;