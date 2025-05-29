import React, { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import myImage from "../images/student-code-auth.jpeg"
import mobileImg from "../pages/homePage/assets/crystal-land-log-removebg.png";
import Navbar from "../pages/homePage/components/Header";
import Footer from "../pages/homePage/components/Footer";
import { Button } from "../components/ButtonElement";
import useApi from "../hooks/useApi"; // Adjust the path as necessary
import { endpoints } from "../utils/constants";
import LoadingButton from "../components/loadingButton";


const CodeAuthenticator = () => {
  const [inputCode, setInputCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const url =  endpoints.CODE_AUTH

  // Use the useApi hook
  const { callApi, loading, data, error: apiError } = useApi();

  const handleInputChange = (e) => {
    setInputCode(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("Input Code:", inputCode);

    await callApi(url, "POST", { inputCode });

    if (apiError) {
      setError(apiError);
      setIsAuthenticated(false);
    } else if (data) {
      const { message, usedDate, usedTime } = data;
      setIsAuthenticated(true);
      setError("");
      alert(`User authenticated successfully. Used Date: ${usedDate}, Time: ${usedTime}`);
      navigate("/offlineSignup");
    }

    setInputCode(""); // Clear the input field after submission
  };

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
        }}
      >
        {/* Image placeholder on the left */}
        <Box
  sx={{
    width: { xs: "0%", md: "100%" },
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
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      color: "#fff",
      padding: "40px",
      borderRadius: "12px",
      width: "70%",
      maxWidth: "600px",
      textAlign: "center",
    }}
  >
    <Typography variant="h4" fontWeight="bold" gutterBottom>
      Get Started with a Registration Code
    </Typography>
    <Typography variant="h6" mt={2}>
      Contact <strong>+234 812 345 6789</strong> to receive your unique code.
    </Typography>
    <Typography variant="body1" mt={1}>
      Enter the code here to begin your enrollment process.
    </Typography>
  </Box>
</Box>


        {/* Form Section */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            padding: "20px",
            placeContent: "center",
            alignItems: "center",
            height: "auto",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            color='#15131D'
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.2em", md: "2em" },
            }}
          >
            Crystal land academy
          </Typography>
          <Box
            sx={{
              display: "grid",
              width: "auto",
              padding: "20px",
              placeContent: "center",
              alignItems: "center",
              height: "auto",
            }}
          >
            <img
              src={mobileImg}
              alt="coding image "
              style={{ height: "150px", width: "150px" }}
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "100%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "5%",
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Enter OTP
            </Typography>

            <TextField
              label="Enter Code"
              variant="outlined"
              value={inputCode}
              onChange={handleInputChange}
              inputProps={{ minLength: 11 }}
              sx={{ marginBottom: "10px", width: "100%" }}
            />


            <LoadingButton
                  onClick={handleSubmit} 
                  type="submit"
                  variant="contained"
                  color="primary"
                  isLoading={loading}
                  fullWidth
                >
                  Submit
                </LoadingButton>


            {(error || apiError) && (
              <Typography color="error" sx={{ marginTop: "20px" }}>
                {error || apiError}
              </Typography>
            )}

            {isAuthenticated && (
              <Typography
                color="primary"
                sx={{ marginTop: "20px", color: "green" }}
              >
                Code authenticated successfully!
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default CodeAuthenticator;
