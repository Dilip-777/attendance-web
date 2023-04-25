import { useDispatch, useSelector } from "react-redux";

// material-ui
import { Box, ButtonBase, Typography } from "@mui/material";

// project imports
import { MENU_OPEN } from "@/store/actions";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {/* <Typography variant="h3" color="#5e35b1">
        Logo
      </Typography> */}
      <img style={{ width: "6rem" }} src="/logo.jpg" alt="logo" />
      <Typography variant="h6" color="#5e35b1" ml={0}>
        Attandance Management
      </Typography>
    </Box>
  );
};

export default LogoSection;
