import { useState, useRef, useEffect, MouseEvent } from "react";

import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popover,
  Popper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "@/ui-component/cards/MainCard";
import Transitions from "@/ui-component/extended/Transitions";
import UpgradePlanCard from "./UpgradePlanCard";
import { Logout, Search, Settings, VerifiedUser } from "@mui/icons-material";

// assets
import { IconLogout, IconSearch, IconSettings, IconUser } from "@tabler/icons";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state: any) => state.customization);
  const router = useRouter();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState("");
  const [notification, setNotification] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef<HTMLInputElement>(null);
  const handleLogout = async () => {
    console.log("Logout");
  };

  const handleClose = (event: globalThis.MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };
  const handleClose1 = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    index: number,
    route = ""
  ) => {
    setSelectedIndex(index);
    handleClose1(event);

    if (route && route !== "") {
      router.push(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      if (anchorRef && anchorRef.current) {
        anchorRef.current.focus();
      }
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: "48px",
          alignItems: "center",
          borderRadius: "27px",
          transition: "all .2s ease-in-out",
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            "& svg": {
              stroke: theme.palette.primary.light,
            },
          },
          "& .MuiChip-label": {
            lineHeight: 0,
          },
        }}
        icon={
          <Avatar
            src="/user-round.svg"
            sx={{
              ...theme.typography.mediumAvatar,
              margin: "8px 0 8px 8px !important",
              cursor: "pointer",
            }}
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={
          //   <IconSettings
          //     style={{ strokeWidth: 1.5, width: "1.5rem", height: "1.5rem" }}
          //   />
          <Settings sx={{ fontSize: "1.3rem", stroke: 1.5 }} />
        }
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      {/* <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      > */}
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MainCard
              border={false}
              content={false}
              boxShadow
              shadow={theme.shadows[16]}
            >
              <Box sx={{ p: 2 }}>
                <Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="h4">Good Morning,</Typography>
                    <Typography
                      component="span"
                      variant="h4"
                      sx={{ fontWeight: 400 }}
                    >
                      Johne Doe
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2">Project Admin</Typography>
                </Stack>
                <OutlinedInput
                  sx={{ width: "100%", pr: 1, pl: 2, my: 2 }}
                  id="input-search-profile"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Search profile options"
                  startAdornment={
                    <InputAdornment position="start">
                      {/* <IconSearch
                            stroke={1.5}
                            size="1rem"
                            color={theme.palette.grey[500]}
                          /> */}
                      <Search sx={{ fontSize: "1.3rem", stroke: 1.5 }} />
                    </InputAdornment>
                  }
                  aria-describedby="search-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                />
                <Divider />
              </Box>

              <Box sx={{ p: 2 }}>
                <List
                  component="nav"
                  sx={{
                    width: "100%",
                    maxWidth: 350,
                    minWidth: 300,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: "10px",
                    [theme.breakpoints.down("md")]: {
                      minWidth: "100%",
                    },
                    "& .MuiListItemButton-root": {
                      mt: 0.5,
                    },
                  }}
                >
                  <ListItemButton
                    sx={{
                      borderRadius: `${customization.borderRadius}px`,
                    }}
                    selected={selectedIndex === 0}
                    onClick={(event) =>
                      handleListItemClick(
                        event,
                        0,
                        "/user/account-profile/profile1"
                      )
                    }
                  >
                    <ListItemIcon>
                      {/* <IconSettings stroke={1.5} size="1.3rem" /> */}
                      <Settings sx={{ fontSize: "1.3rem", stroke: 1.5 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          Account Settings
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{
                      borderRadius: `${customization.borderRadius}px`,
                    }}
                    selected={selectedIndex === 1}
                    onClick={(event) =>
                      handleListItemClick(
                        event,
                        1,
                        "/user/social-profile/posts"
                      )
                    }
                  >
                    <ListItemIcon>
                      {/* <IconUser stroke={1.5} size="1.3rem" /> */}
                      <VerifiedUser sx={{ fontSize: "1.3rem" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Grid
                          container
                          spacing={1}
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="body2">
                              Social Profile
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Chip
                              label="02"
                              size="small"
                              sx={{
                                bgcolor: theme.palette.warning.dark,
                                color: theme.palette.background.default,
                              }}
                            />
                          </Grid>
                        </Grid>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{
                      borderRadius: `${customization.borderRadius}px`,
                    }}
                    selected={selectedIndex === 4}
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <ListItemIcon>
                      <Logout sx={{ fontSize: "1.3rem", stroke: 1.5 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="body2">Logout</Typography>}
                    />
                  </ListItemButton>
                </List>
              </Box>
            </MainCard>
          </ClickAwayListener>
        </Paper>
      </Popover>
    </>
  );
};

export default ProfileSection;
