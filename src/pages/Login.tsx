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
import ForgotAccess from "../components/ForgotPassword";
import ForgotCustomerId from "../components/ForgotPassword";
import CustomSnackbar from "../components/CustomSnackbar";

const validCustomerIds = ["12345", "67890", "11111", "22222"]; // Example valid IDs
// Using an object
const validCustomerDetails: Record<
  string,
  {
    Name: string;
    AccountNumber: string;
    Password: string;
    AccountType: string[];
  }
> = {
  "12345": {
    Name: "Latha",
    AccountNumber: "0012345",
    Password: "pw12345",
    AccountType: ["Savings", "Current", "Joint"],
  },
  "67890": {
    Name: "Kiran",
    AccountNumber: "0067890",
    Password: "pw67890",
    AccountType: ["Current"],
  },
  "11111": {
    Name: "Anita",
    AccountNumber: "0011111",
    Password: "pw11111",
    AccountType: ["Joint"],
  },
  "22222": {
    Name: "Ravi",
    AccountNumber: "0022222",
    Password: "pw22222",
    AccountType: ["Savings"],
  },
};

const Login: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotCustomerId, setShowForgotCustomerId] = useState(false);
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [forgotMode, setForgotMode] = useState<
    "customerId" | "password" | null
  >(null);

  // Set webpage title
  useEffect(() => {
    document.title = "Welcome to MyBank";
  }, []);

  const handleCustomerIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerId) {
      setError("Please enter your Customer ID.");
      return;
    }

    if (!validCustomerIds.includes(customerId)) {
      setError("Customer ID does not exist. Please try again.");
      return;
    }

    // Customer ID exists → show password field and disable Customer ID
    setShowPasswordField(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    const customer = validCustomerDetails[customerId];
    if (customer && password === customer.Password) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSnackbarMessage(`Login successful! Welcome ${customer.Name}`);
        setSnackbarOpen(true);

        // Reset form
        setCustomerId("");
        setPassword("");
        setShowPasswordField(false);
      }, 1000);
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  // If Forgot Customer ID is clicked, show that component instead of login
  if (showForgotCustomerId) {
    return (
      <Box
        sx={{ minHeight: "100vh", bgcolor: "#e3f2fd", width: "100vw", p: 3 }}
      >
        <ForgotCustomerId onClose={() => setShowForgotCustomerId(false)} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#e3f2fd", width: "100vw" }}>
      {/* Header */}
      <Box
        sx={{
          width: "100%",
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

      {/* Login Card */}
      <Box display="flex" justifyContent="center" alignItems="flex-start">
        {forgotMode ? (
          // Conditional rendering of ForgotAccess
          <ForgotAccess mode={forgotMode} onClose={() => setForgotMode(null)} />
        ) : (
          // Original login card
          <Paper elevation={4} sx={{ p: 4, width: 360, borderRadius: 3 }}>
            <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
              Login To NetBanking
            </Typography>

            <form
              onSubmit={
                showPasswordField ? handleLoginSubmit : handleCustomerIdSubmit
              }
            >
              {/* Customer ID */}
              <TextField
                label="Customer ID"
                variant="outlined"
                fullWidth
                margin="normal"
                value={customerId}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) setCustomerId(value); // Numbers only
                }}
                error={Boolean(error)}
                helperText={error}
                disabled={showPasswordField} // Disable after valid ID
              />

              {showPasswordField && (
                <>
                  {/* Password field appears only after valid Customer ID */}
                  <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              )}

              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Link
                  href="#"
                  underline="hover"
                  sx={{ fontSize: 14, cursor: "pointer" }}
                  onClick={() => {
                    if (!showPasswordField) setForgotMode("customerId");
                    else setForgotMode("password");
                  }}
                >
                  {showPasswordField
                    ? "Forgot Password?"
                    : "Forgot Customer ID?"}
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1.2, fontSize: "16px", textTransform: "none" }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : showPasswordField ? (
                  "Login"
                ) : (
                  "Continue"
                )}
              </Button>

              {/* First time user */}
              <Box display="flex" justifyContent="flex-start" mt={2}>
                <Button
                  variant="text"
                  sx={{ textTransform: "none", fontSize: 14, padding: 0 }}
                >
                  <Typography
                    component="span"
                    sx={{ color: "black", fontSize: 14 }}
                  >
                    First time user?{" "}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{ color: "blue", fontSize: 14 }}
                  >
                    Register Now
                  </Typography>
                </Button>
              </Box>
            </form>
          </Paper>
        )}
      </Box>
      {/* Snackbar */}
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity="success"
      />
    </Box>
  );
};

export default Login;
