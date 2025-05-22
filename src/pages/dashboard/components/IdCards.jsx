import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button, Card, CardContent, CardMedia, Typography, Grid, Modal, CircularProgress } from '@mui/material';
import logo from '../../../assets/idCompanyLogo.jpeg';
import backendDevImg from "../../../images/backend.jpeg";
import frontendDevImg from "../../../images/frontend.jpeg";
import imgplaceholder from "../../../images/karen.jpg";
import { useSelector } from 'react-redux';

// IDCard component (not exported, used internally for generating the card)
const IDCard = ({ idCardRef }) => {
  const userData = useSelector(state => state.users.user); // Access user data from Redux store

  // Fallback data if userData is not available
  const fallbackData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '00000000000',
    role: 'student',
    studentId: 'btech/std/Data Analysis/10',
    instructorId: '',
    program: 'Data Analysis',
    profilePictureUrl: imgplaceholder,
    address: '123 Tech Street, Beks',
  };

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    studentId,
    instructorId,
    program,
    profilePictureUrl,
  } = userData || fallbackData;

  const companyName = "Beks Technology";

  return (
    <div ref={idCardRef} style={{ display: 'flex', justifyContent: "center", width: 'auto' }}>
      {/* FRONT CARD */}
      <Card sx={{
        width: 300,
        height: 450,
        margin: 'auto',
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${frontendDevImg})`,
        margin: "2px",
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(31, 58, 147, 0.1), rgba(255, 255, 255, 0.1))',
          zIndex: 1,
        }}></div>

        <CardContent style={{ position: 'relative', zIndex: 2 }}>
          {/* Company Logo and Name */}
          <Grid container direction="row" alignItems="center" justifyContent="center" spacing={1} mb={3}>
            <Grid item>
              <CardMedia
                component="img"
                image={logo}
                alt="Company Logo"
                sx={{ width: 30, height: 40 }}
              />
            </Grid>
            <Grid item>
              <Typography variant="h6" fontWeight="bold" color="#1F3A93">
                {companyName}
              </Typography>
            </Grid>
          </Grid>

          {/* Profile Picture */}
          <Grid container justifyContent="center" mb={3}>
            <Grid item>
              <CardMedia
                component="img"
                image={profilePictureUrl || fallbackData.profilePictureUrl}
                alt={firstName}
                sx={{
                  width: 60,
                  height: 60,
                  border: '4px solid #1F3A93',
                  borderRadius: '50%',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                }}
              />
            </Grid>
          </Grid>

          {/* User Name and Role */}
          <Typography variant="h5" textAlign="center" fontWeight="bold" color="#1F3A93" mb={1}>
            {firstName} {lastName}
          </Typography>
          <Typography variant="body2" textAlign="center" color="#1F3A93" mb={3}>
            {role === 'student' ? 'Student' : role === 'instructor' ? 'Instructor' : ''}
          </Typography>

          {/* User Details */}
          <Grid container spacing={2} justifyContent="left" color="#1F3A93">
            <DetailItem label="Email" value={email} />
            <DetailItem label="Phone" value={phoneNumber} />
            <DetailItem label="Program" value={program} />
            {role === 'student' && <DetailItem label="Student ID" value={studentId} />}
            {role === 'instructor' && <DetailItem label="Instructor ID" value={instructorId} />}
          </Grid>

          {/* Company Address */}
          <Typography variant="body2" textAlign="center" color="#1F3A93" mt={3} fontWeight="bold">
            {companyName}
          </Typography>
          <Typography variant="body2" textAlign="center" color="#1F3A93" fontWeight="bold">
            53, Governor's road, Anishere bus-stop, Ikotun, Lagos.
          </Typography>
        </CardContent>
      </Card>

      {/* BACK CARD */}
      <Card sx={{
        width: 300,
        height: 450,
        boxShadow: 3,
        borderRadius: 2,
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${backendDevImg})`,
        margin: '2px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <CardContent style={{ position: 'relative', zIndex: 2, padding: '30px' }}>
          {/* Top Section */}
          <Typography variant="body2" color="#1F3A93" fontWeight="bold" mb={2}>
            This is to certify that the bearer whose name, email, and phone is affixed is a student/staff of Beks.
          </Typography>
          <Typography variant="body2" color="#1F3A93" fontWeight="bold" mb={4}>
            If found, kindly return to the nearest police station or 53, Governor Road, Ikotun, Lagos.
          </Typography>

          {/* Date and ID Section */}
          <Grid container justifyContent="center" mb={4} color="#1F3A93" >
            <Grid item>
              <Typography variant="body2" fontWeight="bold" mb={1}>
                Joined Date: MM/DD/YEAR
              </Typography>
              <Typography variant="body2" fontWeight="bold" mb={1}>
                Expire Date: MM/DD/YEAR
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                Emp ID: 00-0000
              </Typography>
            </Grid>
          </Grid>

          {/* Signature Section */}
          <Grid container justifyContent="center" mb={4}>
            <Grid item textAlign="center">
              <Typography variant="body2" color="#1F3A93" fontWeight="bold">
                Your Signature
              </Typography>
              <Typography variant="body2" color="#1F3A93" fontWeight="bold" mt={1}>
                Your Sincerely
              </Typography>
            </Grid>
          </Grid>

          {/* Bottom Section - Company Info */}
          <Grid container justifyContent="center" alignItems="center" sx={{
            backgroundColor: '#1F3A93',
            padding: '20px 0',
            borderRadius: '0 0 8px 8px',
            marginTop: '20px',
          }}>
            <Grid item>
              <CardMedia
                component="img"
                image={logo}
                alt="Company Logo"
                sx={{ width: 40, height: 50, marginRight: '10px' }}
              />
            </Grid>
            <Grid item>
              <Typography variant="h6" fontWeight="bold" color="white">
                Beks Technology
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="white" mt={1}>
                info@beksTech.com
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

// Reusable DetailItem component
const DetailItem = ({ label, value }) => (
  <Grid item xs={12} container>
    <Grid item xs={4}>
      <Typography variant="body2" fontWeight="bold" color="#1F3A93">
        {label}:
      </Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography variant="body2" fontWeight="bold">
        {value}
      </Typography>
    </Grid>
  </Grid>
);

// Function to generate and upload PDF
const generatePDFAndUpload = async (idCardRef, userId) => {
  try {
    if (!idCardRef.current) throw new Error('ID card reference is not set.');

    const componentWidth = idCardRef.current.offsetWidth;
    const componentHeight = idCardRef.current.offsetHeight;

    const canvas = await html2canvas(idCardRef.current, {
      useCORS: true,
      scale: 4, // Increase scale for better quality
      width: componentWidth,
      height: componentHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'px', [componentWidth, componentHeight]);
    pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
    pdf.save('ID_Card.pdf');
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

// Loader Modal Component
const LoaderModal = ({ open }) => (
  <Modal
    open={open}
    aria-labelledby="loader-modal"
    aria-describedby="loading-indicator"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div style={{
      backgroundColor: '#1F3A93',
      padding: '20px',
      borderRadius: '8px',
      outline: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <CircularProgress color="primary" />
      <Typography variant="h6" style={{ marginTop: '16px' }}>
        Downloading...
      </Typography>
    </div>
  </Modal>
);

// Exported DownloadButton component
const DownloadIdButton = () => {
  const idCardRef = useRef(null);
  const userData = useSelector(state => state.users.user);
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleDownload = async () => {
    if (!userData?.userId) {
      console.error("User ID is required for downloading the ID card.");
      return;
    }

    setLoading(true); // Show loader
    try {
      await generatePDFAndUpload(idCardRef, userData.userId);
    } catch (error) {
      console.error("Error during PDF generation:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <>
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <IDCard idCardRef={idCardRef} />
      </div>
      <Button variant="contained" color="primary" onClick={handleDownload} sx={{ marginTop: 2 }}>
        Download ID Card as PDF
      </Button>
      <LoaderModal open={loading} /> {/* Loader Modal */}
    </>
  );
};

export default DownloadIdButton;