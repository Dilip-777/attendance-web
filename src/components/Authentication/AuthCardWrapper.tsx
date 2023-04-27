import PropTypes from "prop-types";

// material-ui
import { Box } from "@mui/material";

// project import
import MainCard from "@/ui-component/cards/MainCard";

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

const AuthCardWrapper = ({
  children,
  ...other
}: {
  children: React.ReactNode;
}) => (
  <MainCard
    sx={{
      maxWidth: { xs: 400, lg: 475 },
      margin: 0,
      "& > *": {
        flexGrow: 1,
        flexBasis: "50%",
      },
      borderRadius: "5px",
      // backgroundColor: "transparent",
    }}
    content={false}
    {...other}
  >
    <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>{children}</Box>
  </MainCard>
);

AuthCardWrapper.propTypes = {
  children: PropTypes.node,
};

export default AuthCardWrapper;
