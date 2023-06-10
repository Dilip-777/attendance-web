import { useRef } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
// import { Avatar, Box, ButtonBase } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import NotificationsActive from "@mui/icons-material/NotificationsActive";

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();
  const anchorRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down("md")]: {
            mr: 2,
          },
        }}
      >
        <ButtonBase sx={{ borderRadius: "12px" }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: "all .2s ease-in-out",
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light,
              },
            }}
            ref={anchorRef}
            aria-haspopup="true"
            color="inherit"
          >
            <NotificationsActive sx={{ stroke: 1.5, fontSize: "1.3rem" }} />
          </Avatar>
        </ButtonBase>
      </Box>
    </>
  );
};

export default NotificationSection;
