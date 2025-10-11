import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  autoHideDuration?: number;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  onClose,
  message,
  severity = "info",
  autoHideDuration = 3000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
