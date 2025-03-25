import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to EasyRent
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Manage your properties efficiently with our comprehensive property management system.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/signup')}
        sx={{ mt: 4 }}
      >
        Get Started
      </Button>
    </Container>
  );
}
