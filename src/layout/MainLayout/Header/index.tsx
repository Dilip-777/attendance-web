import { useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
// import LogoSection from "../LogoSection";
import dynamic from "next/dynamic";
const LogoSection = dynamic(() => import("../LogoSection"));
const SearchSection = dynamic(() => import("./SearchSection"));
const ProfileSection = dynamic(() => import("./ProfileSection"));
const NotificationSection = dynamic(() => import("./NotificationSection"));
// import SearchSection from "./SearchSection";
// import ProfileSection from "./ProfileSection";
// import NotificationSection from "./NotificationSection";
import MenuBook from "@mui/icons-material/MenuBook";
import { IconButton } from "@mui/material";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({
  handleLeftDrawerToggle,
}: {
  handleLeftDrawerToggle: () => void;
}) => {
  const theme = useTheme();

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: "flex",
          [theme.breakpoints.down("md")]: {
            width: "auto",
          },
        }}
      >
        <Box
          component="span"
          sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}
        >
          <LogoSection />
        </Box>
        {/* <ButtonBase sx={{ borderRadius: "12px" }}> */}
        <IconButton
          sx={{ borderRadius: "12px", p: 0 }}
          onClick={handleLeftDrawerToggle}
        >
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
            color="inherit"
          >
            <MenuBook sx={{ fontSize: "1.3rem", stroke: 1.5 }} />
          </Avatar>
        </IconButton>
      </Box>

      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

export default Header;
