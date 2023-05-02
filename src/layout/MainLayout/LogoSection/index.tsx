import { Box, Typography } from "@mui/material";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <img style={{ width: "6rem" }} src="/logo.jpg" alt="logo" />
      <Typography variant="h6" color="#5e35b1" ml={0}>
        Attendance Management
      </Typography>
    </Box>
  );
};

export default LogoSection;
