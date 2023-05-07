import { useState, useRef, useEffect, MouseEvent } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Logout from "@mui/icons-material/Logout";
import Search from "@mui/icons-material/Search";
import Settings from "@mui/icons-material/Settings";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import MainCard from "@/ui-component/cards/MainCard";

// assets
import { useRouter } from "next/router";
import Router from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { ListItem } from "@mui/material";
import FormSelect from "@/ui-component/FormSelect";
import axios from "axios";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state: any) => state.customization);
  const router = useRouter();
  const { data: session } = useSession();
  const [value, setValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<string | undefined>(
    session?.user?.role || ""
  );

  useEffect(() => {
    setRole(session?.user?.role || "");
  }, [session]);

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

  const handleChange = async (v: string) => {
    setRole(v);
    const res = await axios
      .put("/api/shiftrole", {
        id: session?.user?.id,
        role: v,
      })
      .then(async (res) => {
        await signIn("credentials", {
          email: session?.user?.email,
          specialRole: session?.user?.specialRole,
        });
        router.push("/");
      })
      .catch((err) => console.log(err));
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
        label={<Settings sx={{ fontSize: "1.3rem", stroke: 1.5 }} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Paper sx={{ maxWidth: "22rem" }}>
          <ClickAwayListener onClickAway={handleClose}>
            <MainCard
              border={false}
              content={false}
              boxShadow
              shadow={theme.shadows[16]}
            >
              <Box sx={{ p: 2, pb: 0 }}>
                <Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="h4">Good Morning,</Typography>
                    <Typography
                      component="span"
                      variant="h4"
                      sx={{ fontWeight: 400 }}
                    >
                      {session?.user?.name}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {session?.user?.role}
                  </Typography>
                </Stack>
                <OutlinedInput
                  sx={{ width: "100%", pr: 1, pl: 2, my: 2, maxWidth: "20rem" }}
                  id="input-search-profile"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Search profile options"
                  startAdornment={
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: "1.3rem", stroke: 1.5 }} />
                    </InputAdornment>
                  }
                  aria-describedby="search-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                />

                {/* <ListItem> */}
                {session?.user?.specialRole && (
                  <FormSelect
                    value={role as string}
                    handleChange={(v) => {
                      handleChange(v as string);
                    }}
                    options={[
                      { label: "TimeKeeper", value: "TimeKeeper" },
                      { value: "HR", label: "HR" },
                      { value: "PlantCommercial", label: "PlantCommercial" },
                      {
                        value: "HoCommercialAuditor",
                        label: "HoCommercialAuditor",
                      },
                      { value: "Corporate", label: "Corporate" },
                      { value: "Stores", label: "Stores" },
                      { value: "Safety", label: "Safety" },
                    ]}
                    fullWidth={true}
                    sx={{ maxWidth: "20rem", mb: 2 }}
                  />
                )}
                <Divider />
              </Box>

              <Box sx={{ p: 2, pt: 0 }}>
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
                      handleListItemClick(event, 0, "/profile")
                    }
                  >
                    <ListItemIcon>
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
