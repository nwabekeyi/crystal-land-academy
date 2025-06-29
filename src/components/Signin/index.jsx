import React, { useState, useEffect } from 'react';
import {
  CssBaseline,
  Box,
  FormControl,
  IconButton,
  Link,
  TextField,
  Typography,
  Stack,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import {
  DarkModeRounded as DarkModeRoundedIcon,
  LightModeRounded as LightModeRoundedIcon,
  ArrowBack as ArrowBackIcon,
  BadgeRounded as BadgeRoundedIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingButton from '../loadingButton';
import useAuth from '../../hooks/useAuth';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import bg1 from '../../images/signinBg.jpeg';
import bg2 from '../../assets/login_muslim_image.png';

const SignIn = () => {
  const { loading, error, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    if (!email || !password || !role) {
      alert('Please enter email, password, and select a role.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password, role);
    } catch (err) {
      console.error('Error during login:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    navigate('/'); // Fallback to home route
  };

  const [mode, setMode] = useState('dark');
  const theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === 'light'
        ? {
            background: { default: '#f5f5f5' },
            primary: { main: '#1976d2' },
            text: { primary: '#000000' },
          }
        : {
            background: { default: '#121212' },
            primary: { main: '#90caf9' },
            text: { primary: '#ffffff' },
          }),
    },
  });

  // Contact Section Component for reuse
  const ContactSection = () => (
    <Box
      sx={{
        width: { xs: '90%', sm: '70%', md: '50%' }, // Responsive width
        maxWidth: '400px', // Limit max width
        backdropFilter: 'blur(12px)', // Glassmorphism effect
        backgroundColor:
          mode === 'light'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(18, 18, 18, 0.8)', // Theme-based background
        border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border
        borderRadius: '12px', // Rounded corners
        p: { xs: 2, sm: 3 }, // Responsive padding
        textAlign: 'center',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Subtle shadow
        mt: { xs: 3, md: 0 }, // Margin-top on mobile for spacing
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: '#fff',
          fontWeight: 'bold',
          mb: 2,
          fontSize: { xs: '1.5rem', sm: '1.8rem' }, // Responsive font
        }}
      >
        Need Help?
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#fff',
          mb: 2,
          fontSize: { xs: '1rem', sm: '1.1rem' }, // Responsive font
        }}
      >
        For any issues, please contact us:
      </Typography>
      <Link
        href="tel:+2349161010145"
        underline="hover"
        sx={{
          color: mode === 'light' ? '#1976d2' : '#90caf9', // Theme-based color
          fontSize: { xs: '1.3rem', sm: '1.6rem' }, // Responsive font
          fontWeight: 'bold',
          transition: 'color 0.3s',
          '&:hover': {
            color: mode === 'light' ? '#1565c0' : '#bbdefb', // Hover effect
          },
        }}
      >
        09161010145
      </Link>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, row on tablet/desktop
          minHeight: '100vh',
          backgroundImage: `url(${mode === 'light' ? bg1 : bg2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
        }}
      >
        {/* Background Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `rgba(0, 0, 0, 0.6)`,
            opacity: mode === 'light' ? 0.4 : 0.2,
            zIndex: 0,
          }}
        />

        {/* Contact Section (Left Half on Desktop/Tablet, Hidden on Mobile) */}
        <Box
          sx={{
            width: { xs: '0', md: '60%' }, // Hidden on mobile, 60% on tablet/desktop
            display: { xs: 'none', md: 'flex' }, // Hidden on mobile, flex on tablet/desktop
            justifyContent: 'center',
            alignItems: 'center',
            p: { xs: 2, sm: 4 }, // Reduced padding on mobile
            zIndex: 1,
          }}
        >
          <ContactSection />
        </Box>

        {/* Sign-in Form (Full Width on Mobile, Right Half on Desktop/Tablet) */}
        <Box
          sx={{
            width: { xs: '100%', md: '40%' }, // Full width on mobile, 40% on tablet/desktop
            height: { xs: 'auto', md: '100vh' }, // Auto height on mobile, full height on tablet/desktop
            backdropFilter: 'blur(12px)',
            backgroundColor:
              mode === 'light'
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(18, 18, 18, 0.8)',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <IconButton
              onClick={handleBackClick}
              color="primary"
              sx={{
                p: { xs: 1.5, sm: 1 }, // Larger touch area on mobile
                '& svg': {
                  fontSize: { xs: '2rem', sm: '1.5rem' }, // Larger icon on mobile
                  color: '#fff', // Ensure visibility
                },
                zIndex: 2, // Ensure above other elements
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle hover effect
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <IconButton
              onClick={() =>
                setMode((prevMode) =>
                  prevMode === 'light' ? 'dark' : 'light'
                )
              }
              sx={{
                p: { xs: 1.5, sm: 1 }, // Larger touch area on mobile
                '& svg': {
                  fontSize: { xs: '2rem', sm: '1.5rem' }, // Larger icon on mobile
                },
                zIndex: 2, // Ensure above other elements
              }}
            >
              {mode === 'light' ? (
                <DarkModeRoundedIcon sx={{ color: '#fff' }} />
              ) : (
                <LightModeRoundedIcon />
              )}
            </IconButton>
          </Box>

          {path === '/dashboard' && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h6">
                You are not logged in, Kindly Login.
              </Typography>
            </Box>
          )}

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  size="small"
                  color="primary"
                  sx={{
                    p: { xs: 1.5, sm: 1 }, // Larger touch area on mobile
                    '& svg': {
                      fontSize: { xs: '1.8rem', sm: '1.5rem' }, // Larger icon on mobile
                      color: '#fff',
                    },
                  }}
                >
                  <BadgeRoundedIcon />
                </IconButton>
                <Typography variant="h6">Crystal Land Academy</Typography>
              </Box>
            </Box>

            <Typography variant="h4" sx={{ mb: 2 }}>
              Sign in
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">Sign in as</InputLabel>
                  <Select
                    labelId="role-label"
                    value={role}
                    label="Sign in as"
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>

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

            {/* Contact Section (Inside Form Container on Mobile) */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <ContactSection />
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2">
              © Crystal Land Academy {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SignIn;