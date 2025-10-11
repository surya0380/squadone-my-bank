import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Link,
  CircularProgress,
} from "@mui/material";

const Login: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set the webpage title
  useEffect(() => {
    document.title = "Welcome to MyBank";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerId) {
      setError("Please enter your Customer ID.");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (customerId !== "12345") {
        setError("Customer ID is incorrect. Please try again.");
      } else {
        alert("Customer ID verified successfully!");
        setCustomerId("");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#e3f2fd", width: "100vw" }}>
      {/* 🔹 Header block */}
      <Box
        sx={{
          bgcolor: "#1565c0",
          py: 3,
          mb: 4,
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Welcome to MyBank NetBanking
        </Typography>
      </Box>

      {/* 🔹 Login card */}
      <Box display="flex" justifyContent="center" alignItems="flex-start">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: 360,
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
            Login To NetBanking
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Customer ID"
              variant="outlined"
              fullWidth
              margin="normal"
              value={customerId}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only numbers
                if (/^\d*$/.test(value)) {
                  setCustomerId(value);
                }
              }}
              error={Boolean(error)}
              helperText={error}
            />

            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Link
                href="#"
                underline="hover"
                sx={{ fontSize: 14, cursor: "pointer" }}
              >
                Forgot Customer ID?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.2,
                fontSize: "16px",
                textTransform: "none",
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Continue"
              )}
            </Button>

            {/* First time user aligned left */}
            <Box display="flex" justifyContent="flex-start" mt={2}>
              <Button variant="text" sx={{ textTransform: "none", padding: 0 }}>
                <Typography
                  component="span"
                  sx={{ color: "black", fontSize: 14, paddingRight: "10px" }}
                >
                  First time user?{" "}
                </Typography>
                <Typography
                  component="span"
                  sx={{ color: "blue", fontSize: 16 }}
                >
                  Register Now
                </Typography>
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
