import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import {
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Divider,
  Alert,
  Paper,
  Grid
} from '@mui/material';
import { Google as GoogleIcon, Email as EmailIcon, House as HouseIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  
  const navigate = useNavigate();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setError(error instanceof AuthError ? error.message : 'An error occurred during sign in');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      setError(error instanceof AuthError ? error.message : 'An error occurred during Google sign in');
    }
  };

  // Define motion components
  const MotionBox = motion(Box);

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4 }}>
      <Grid container spacing={4} alignItems="center" sx={{ minHeight: '90vh' }}>
        {/* Left side - Hero Section */}
        <Grid item xs={12} md={6}>
          <MotionBox
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                EasyRent
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Simplify your property management journey
              </Typography>
            </Box>
            
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
              <Grid container spacing={2}>
                {[
                  { icon: <HouseIcon color="primary" />, text: 'Effortlessly manage multiple properties' },
                  { icon: <EmailIcon color="primary" />, text: 'Streamlined communication with tenants' },
                  { icon: <GoogleIcon color="primary" />, text: 'Smart analytics and reporting' }
                ].map((feature, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {feature.icon}
                      <Typography variant="body1">{feature.text}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </MotionBox>
        </Grid>

        {/* Right side - Auth Form */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              opacity: 1,
              maxWidth: 400,
              mx: 'auto'
            }}
          >
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom align="center">
                  Welcome Back
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleEmailSignIn}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                  />
                  
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                </form>

                <Divider sx={{ my: 2 }}>OR</Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                  sx={{ mb: 2 }}
                >
                  Continue with Google
                </Button>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/auth/signup')}
                    sx={{
                      minWidth: 200,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      }
                    }}
                  >
                    Create Account
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
