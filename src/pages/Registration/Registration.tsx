import  { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Avatar,
   Link,
  Paper,
  Grid
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountNumber:''
  });

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // TODO: Add validation or API integration here
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} sm={6}> */}
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            {/* </Grid> */}
            {/* <Grid item xs={12} sm={6}> */}
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                id="accountNumber"
                label="account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </Grid>
            {/* <Grid item xs={12}> */}
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            {/* </Grid> */}
            {/* <Grid item xs={12}> */}
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
            {/* </Grid>
            <Grid item xs={12}> */}
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            {/* </Grid>
          </Grid> */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>

          <Grid container justifyContent="flex-end">
            {/* <Grid item> */}
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          {/* </Grid> */}
        </Box>
      </Paper>
    </Container>
  );
}
