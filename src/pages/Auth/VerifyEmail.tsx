import { Container, Typography, Box, Paper } from '@mui/material';
import { MailOutline } from '@mui/icons-material';

export default function VerifyEmail() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <MailOutline sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          
          <Typography component="h1" variant="h5" gutterBottom align="center">
            Check Your Email
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            We've sent you a verification email. Please check your inbox and click
            the verification link to activate your account.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center">
            If you don't see the email, please check your spam folder. The verification
            link will expire in 24 hours.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
