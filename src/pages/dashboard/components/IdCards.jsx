import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button, Card, CardContent, CardMedia, Typography, Grid, Modal, CircularProgress } from '@mui/material';
import logo from '../../../pages/homePage/assets/crystal-land-log-removebg.png'; // Update with your logo path
import backendDevImg from '../../../images/backend.jpeg'; // Update with your background image
import frontendDevImg from '../../../images/frontend.jpeg'; // Update with your background image
import imgplaceholder from '../../../images/karen.jpg'; // Update with your placeholder image
import { useSelector } from 'react-redux';

// Font imports with fallback
try {
  import('@fontsource/roboto/400.css');
  import('@fontsource/roboto/700.css');
} catch (error) {
  console.warn('Failed to load Roboto fonts, falling back to Arial:', error);
}

// Helper function to format date (MM/DD/YYYY)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  } catch {
    return 'N/A';
  }
};

// Helper function to calculate expire date (1 year from createdAt)
const getExpireDate = (createdAt) => {
  if (!createdAt) return 'N/A';
  try {
    const date = new Date(createdAt);
    date.setFullYear(date.getFullYear() + 1);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  } catch {
    return 'N/A';
  }
};

// IDCard component
const IDCard = ({ idCardRef }) => {
  const userData = useSelector((state) => state.users.user);

  // Fallback data based on provided schemas
  const fallbackData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '08137912280',
    role: 'student',
    studentId: 'CLIA/PRI/01',
    teacherId: 'TEA27750JD',
    currentClassLevel: {
      section: 'Primary',
      className: 'Primary 6',
      subclass: 'A',
      academicYear: { name: '2007/2008' },
    },
    subject: [{ name: 'English Language' }],
    qualification: 'BSc',
    profilePictureUrl: imgplaceholder,
    createdAt: new Date().toISOString(),
    guardians: [{ phone: '08137912280' }],
  };

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    studentId,
    teacherId,
    currentClassLevel,
    subject,
    qualification,
    profilePictureUrl,
    createdAt,
    guardians,
  } = userData || fallbackData;

  const companyName = 'Crystal Land Academy';
  const companyAddress = 'Crystal_Land Intl Academy, Beside Awujoola Mosque, Ologuneru-ido road, Ibadan, Oyo state';
  const companyEmail = 'info@crystallandacademy.com';

  // Use guardian's phone for students
  const phone = role === 'student' && guardians?.length ? guardians[0].phone : phoneNumber;

  return (
    <div ref={idCardRef} style={{ display: 'flex', justifyContent: 'center', width: '1012px', height: '638px' }}>
      {/* FRONT CARD */}
      <Card
        sx={{
          width: 506, // 3.375" at 300 DPI
          height: 638, // 2.125" at 300 DPI
          margin: '2px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          backgroundColor: '#fff',
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${frontendDevImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '3px solid #1F3A93',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(31, 58, 147, 0.1), rgba(255, 255, 255, 0.1))',
            zIndex: 1,
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            top: 5,
            left: 5,
            right: 5,
            bottom: 5,
            border: '1px dashed #1F3A93',
            borderRadius: '8px',
            zIndex: 1,
          },
        }}
      >
        <CardContent
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Header: Logo and Company Name */}
          <Grid container direction="column" alignItems="center" spacing={1} mb={2}>
            <Grid item>
              <CardMedia
                component="img"
                image={logo}
                alt="Company Logo"
                sx={{ width: 70, height: 70, borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
              />
            </Grid>
            <Grid item>
              <Typography
                variant="h5"
                fontFamily="Roboto, Arial, sans-serif"
                fontWeight={700}
                color="#1F3A93"
                textAlign="center"
              >
                {companyName}
              </Typography>
            </Grid>
          </Grid>

          {/* Profile Picture and Details */}
          <Grid container spacing={2} alignItems="center" justifyContent="center" mb={2}>
            <Grid item>
              <CardMedia
                component="img"
                image={profilePictureUrl || fallbackData.profilePictureUrl}
                alt={`${firstName} ${lastName}`}
                sx={{
                  width: 120,
                  height: 160,
                  border: '2px solid #1F3A93',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                }}
              />
            </Grid>
            <Grid item>
              <Grid container direction="column" spacing={1} color="#1F3A93">
                <Grid item>
                  <Typography
                    variant="h6"
                    fontFamily="Roboto, Arial, sans-serif"
                    fontWeight={700}
                    color="#1F3A93"
                  >
                    {firstName} {lastName}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontFamily="Roboto, Arial, sans-serif"
                    fontWeight={500}
                    color="#1F3A93"
                  >
                    {role === 'student' ? 'Student' : 'Teacher'}
                  </Typography>
                </Grid>
                <DetailItem label="Email" value={email || 'N/A'} />
                <DetailItem label="Phone" value={phone || 'N/A'} />
                {role === 'student' && (
                  <>
                    <DetailItem
                      label="Class"
                      value={
                        currentClassLevel?.section && currentClassLevel?.className && currentClassLevel?.subclass
                          ? `${currentClassLevel.section} ${currentClassLevel.className} ${currentClassLevel.subclass}`
                          : 'N/A'
                      }
                    />
                    <DetailItem label="Student ID" value={studentId || 'N/A'} />
                    <DetailItem label="Academic Year" value={currentClassLevel?.academicYear?.name || 'N/A'} />
                  </>
                )}
                {role === 'teacher' && (
                  <>
                    <DetailItem label="Subject" value={subject?.[0]?.name || 'N/A'} />
                    <DetailItem label="Teacher ID" value={teacherId || 'N/A'} />
                    <DetailItem label="Qualification" value={qualification || 'N/A'} />
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* Footer: Company Address */}
          <Grid
            container
            justifyContent="center"
            sx={{
              backgroundColor: '#1F3A93',
              padding: '10px 0',
              borderRadius: '0 0 12px 12px',
              position: 'absolute',
              bottom: 0,
              width: '100%',
              zIndex: 2,
            }}
          >
            <Typography
              variant="caption"
              fontFamily="Roboto, Arial, sans-serif"
              color="white"
              textAlign="center"
            >
              {companyAddress}
            </Typography>
          </Grid>
        </CardContent>
      </Card>

      {/* BACK CARD */}
      <Card
        sx={{
          width: 506,
          height: 638,
          margin: '2px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          backgroundColor: '#fff',
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${backendDevImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '3px solid #1F3A93',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(31, 58, 147, 0.1), rgba(255, 255, 255, 0.1))',
            zIndex: 1,
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            top: 5,
            left: 5,
            right: 5,
            bottom: 5,
            border: '1px dashed #1F3A93',
            borderRadius: '8px',
            zIndex: 1,
          },
        }}
      >
        <CardContent
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Certification Text */}
          <Typography
            variant="body2"
            fontFamily="Roboto, Arial, sans-serif"
            fontWeight={700}
            color="#1F3A93"
            textAlign="center"
            mb={2}
          >
            This certifies that the bearer, whose name, email, and phone are affixed, is a{' '}
            {role === 'student' ? 'student' : 'teacher'} of {companyName}.
          </Typography>
          <Typography
            variant="body2"
            fontFamily="Roboto, Arial, sans-serif"
            fontWeight={700}
            color="#1F3A93"
            textAlign="center"
            mb={3}
          >
            If found, please return to the nearest police station or {companyAddress}.
          </Typography>

          {/* Date and ID Section */}
          <Grid container justifyContent="center" mb={3} color="#1F3A93">
            <Grid item>
              <Typography
                variant="body2"
                fontFamily="Roboto, Arial, sans-serif"
                fontWeight={700}
                mb={1}
              >
                Joined Date: {formatDate(createdAt)}
              </Typography>
              <Typography
                variant="body2"
                fontFamily="Roboto, Arial, sans-serif"
                fontWeight={700}
                mb={1}
              >
                Expire Date: {getExpireDate(createdAt)}
              </Typography>
              <Typography variant="body2" fontFamily="Roboto, Arial, sans-serif" fontWeight={700}>
                {role === 'student' ? 'Student ID' : 'Teacher ID'}: {role === 'student' ? studentId : teacherId}
              </Typography>
            </Grid>
          </Grid>

          {/* Signature Section */}
          <Grid container justifyContent="center" mb={3}>
            <Grid item textAlign="center">
              <Typography
                variant="body2"
                fontFamily="Roboto, Arial, sans-serif"
                color="#1F3A93"
                fontWeight={700}
              >
                Authorized Signature
              </Typography>
              <div
                style={{
                  height: '40px',
                  borderBottom: '2px solid #1F3A93',
                  width: '150px',
                  margin: '10px auto',
                }}
              />
              <Typography
                variant="body2"
                fontFamily="Roboto, Arial, sans-serif"
                color="#1F3A93"
                fontWeight={700}
              >
                {companyName}
              </Typography>
            </Grid>
          </Grid>

          {/* Footer: Company Info */}
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundColor: '#1F3A93',
              padding: '10px 0',
              borderRadius: '0 0 12px 12px',
              position: 'absolute',
              bottom: 0,
              width: '100%',
              zIndex: 2,
            }}
          >
            <Grid item>
              <CardMedia
                component="img"
                image={logo}
                alt="Company Logo"
                sx={{ width: 50, height: 50, marginRight: '10px', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                fontFamily="Roboto, Arial, sans-serif"
                fontWeight={700}
                color="white"
              >
                {companyName}
              </Typography>
              <Typography
                variant="caption"
                fontFamily="Roboto, Arial, sans-serif"
                color="white"
              >
                {companyEmail}
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
  <Grid item container alignItems="center">
    <Grid item xs={4}>
      <Typography
        variant="body2"
        fontFamily="Roboto, Arial, sans-serif"
        fontWeight={700}
        color="#1F3A93"
      >
        {label}:
      </Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography
        variant="body2"
        fontFamily="Roboto, Arial, sans-serif"
        fontWeight={400}
        color="#1F3A93"
      >
        {value}
      </Typography>
    </Grid>
  </Grid>
);

// Function to generate and upload PDF
const generatePDFAndUpload = async (idCardRef, userId) => {
  try {
    if (!idCardRef.current) throw new Error('ID card reference is not set.');
    if (!userId) throw new Error('User ID is required.');

    const canvas = await html2canvas(idCardRef.current, {
      useCORS: true,
      scale: 4,
      width: 1012,
      height: 638,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1012, 638],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 1012, 638);
    pdf.save(`${userId}_ID_Card.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
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
    <div
      style={{
        backgroundColor: '#1F3A93',
        padding: '20px',
        borderRadius: '8px',
        outline: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <CircularProgress sx={{ color: 'white' }} />
      <Typography
        variant="h6"
        fontFamily="Roboto, Arial, sans-serif"
        color="white"
        mt={2}
      >
        Downloading...
      </Typography>
    </div>
  </Modal>
);

// DownloadIdButton component
const DownloadIdButton = () => {
  const idCardRef = useRef(null);
  const userData = useSelector((state) => state.users.user);
  const [loading, setLoading] = useState(false);

  // Log userData for debugging
  console.log('User Data:', JSON.stringify(userData, null, 2));

  const handleDownload = async () => {
    if (!userData?._id && !userData?.studentId && !userData?.teacherId) {
      console.error('User ID is required for downloading the ID card.');
      return;
    }

    setLoading(true);
    try {
      const userId = userData.studentId || userData.teacherId || userData._id;
      await generatePDFAndUpload(idCardRef, userId);
    } catch (error) {
      console.error('Error during PDF generation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <IDCard idCardRef={idCardRef} />
      </div>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#1F3A93',
          fontFamily: 'Roboto, Arial, sans-serif',
          fontWeight: 700,
          padding: '10px 20px',
          borderRadius: '8px',
          '&:hover': { backgroundColor: '#153068' },
        }}
        onClick={handleDownload}
      >
        Download ID Card
      </Button>
      <LoaderModal open={loading} />
    </>
  );
};

export default DownloadIdButton;