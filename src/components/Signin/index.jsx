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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundImage: `url(${mode === 'light' ? bg1 : bg2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `rgba(0, 0, 0, 0.6)`,
            opacity: mode === 'light' ? 0.4 : 0.2,
          }}
        />
        <Box
          sx={{
            width: { xs: '100%', md: '40%' },
            height: '100vh',
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
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBackIcon sx={{ color: '#fff' }} />
            </IconButton>

            <IconButton
              onClick={() =>
                setMode((prevMode) =>
                  prevMode === 'light' ? 'dark' : 'light'
                )
              }
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
                <IconButton size="small" color="primary">
                  <BadgeRoundedIcon sx={{ color: '#fff' }} />
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
