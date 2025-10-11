import React, { useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";

interface ForgotAccessProps {
  mode: "customerId" | "password"; // determines which form to show
  onClose?: () => void;
}

const ForgotAccess: React.FC<ForgotAccessProps> = ({ mode, onClose }) => {
  const [emailOrId, setEmailOrId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!emailOrId) {
      setMessage(mode === "customerId"
        ? "Please enter your registered email."
        : "Please enter your Customer ID.");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (  mode === "customerId") {
        setMessage("Instructions to recover Customer ID have been sent to your email.");
      } else {
        setMessage("Password reset instructions have been sent to your registered email.");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h6" mb={2} align="center">
        {mode === "customerId" ? "Forgot Customer ID" : "Forgot Password"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label={mode === "customerId" ? "Registered Email" : "Customer ID"}
          variant="outlined"
          fullWidth
          margin="normal"
          value={emailOrId}
          onChange={(e) => setEmailOrId(e.target.value)}
        />

        {message && (
          <Typography color={message.includes("sent") ? "green" : "error"} fontSize={14} mt={1}>
            {message}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.2, textTransform: "none" }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Send Instructions"}
        </Button>

        {onClose && (
          <Button
            variant="text"
            fullWidth
            sx={{ mt: 1, textTransform: "none" }}
            onClick={onClose}
          >
            Back to Login
          </Button>
        )}
      </form>
    </Box>
  );
};

export default ForgotAccess;