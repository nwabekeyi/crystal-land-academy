import React, { useState, useEffect } from 'react';
import { CssBaseline, Box, FormControl, IconButton, Link, TextField, Typography, Stack } from '@mui/material';
import { DarkModeRounded as DarkModeRoundedIcon, LightModeRounded as LightModeRoundedIcon, ArrowBack as ArrowBackIcon, BadgeRounded as BadgeRoundedIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingButton from '../loadingButton'; // Adjust path as needed
import useAuth from '../../hooks/useAuth'; // Import useAuth hook
import { createTheme, ThemeProvider } from '@mui/material/styles';

const SignIn = () => {
  const { loading, error, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading button
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const currentUser = useSelector((state) => state.users.user);

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setIsSubmitting(true); // Set loading state for submit button
    try {
      await login(email, password);
    } catch (err) {
      console.error('Error during login:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom dark and light theme
  const [mode, setMode] = useState('dark'); // Change 'light' to 'dark'
  const theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === 'light'
        ? {
            background: {
              default: '#f5f5f5',
            },
            primary: {
              main: '#1976d2', // Blue
            },
            text: {
              primary: '#000000',
            },
          }
        : {
            background: {
              default: '#121212',
            },
            primary: {
              main: '#90caf9', // Light blue for dark mode
            },
            text: {
              primary: '#ffffff',
            },
          }),
    },
  });
console.log(path)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundImage: `url(${mode === 'light' ? 'https://dl.dropboxusercontent.com/scl/fi/rb1js15gzgvjv0uqqx1nb/babtech.avif?rlkey=6v5sts1e0ome1pf11sz3d1uj8&st=2lfn1ea0&dl=0' : 'https://dl.dropboxusercontent.com/scl/fi/3xy7u0os5rin8xah74itf/study-group-learning-library-1.jpg?rlkey=3nc77e9tiuhwgorog066pcyry&st=d7pccgkj&dl=0'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
        }}
      >
        {/* Dark Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `rgba(0, 0, 0, 0.6)`, // Dark overlay for light mode
            opacity: mode === 'light' ? 0.4 : 0.2, // Only apply overlay in light mode
          }}
        />

        <Box
          sx={{
            width: { xs: '100%', md: '40%' }, // Adjust the width for responsiveness
            height: '100vh',
            backdropFilter: 'blur(12px)',
            backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(18, 18, 18, 0.8)', // Adjusted for light/dark mode
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 1, // Ensure content is on top of the overlay
          }}
        >
          <Box
            sx={{
              width: '100%', // Full width
              display: 'flex',
              justifyContent: 'space-between', // Distribute space between the icons
              alignItems: 'center', // Align the icons vertically in the center
              mb: 2, // Add margin bottom to separate from the form
            }}
          >
            {/* Back button */}
            <IconButton
              onClick={() => navigate(-1)} // Navigate to the previous page
              color="primary"
            >
              <ArrowBackIcon sx={{ color: '#fff' }}/>
            </IconButton>

            {/* Dark/Light Mode Toggle */}
            <IconButton
              onClick={() => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))}
            >
              {mode === 'light' ? <DarkModeRoundedIcon sx={{ color: '#fff' }}/> : <LightModeRoundedIcon />}
            </IconButton>
          </Box >

          {
            path === '/dashboard' && 
            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
               <Typography variant="h6">You are not logged in, Kindly Login.</Typography>
            </Box>
          }

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton size="small" color="primary">
                  <BadgeRoundedIcon sx={{ color: '#fff' }}/>
                </IconButton>
                <Typography variant="h6">Beks e-learning</Typography>
              </Box>
            </Box>

            <Typography variant="h4" sx={{ mb: 2 }}>
              Sign in
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormControl>

                {error && <Typography color="error">{error}</Typography>}

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  isLoading={isSubmitting || loading}
                  fullWidth
                >
                  Continue
                </LoadingButton>

                <Link href="/forgot-password" underline="hover">
                  Forgot password?
                </Link>
              </Stack>
            </form>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2">© Beks technologies {new Date().getFullYear()}</Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SignIn;
