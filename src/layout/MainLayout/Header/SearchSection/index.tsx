import PropTypes from "prop-types";
import { Dispatch, SetStateAction, useState } from "react";

// material-ui
import { useTheme, styled } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";

// import { shouldForwardProp } from "@mui/system";
import Search from "@mui/icons-material/Search";
import Tune from "@mui/icons-material/Tune";

const OutlineInputStyle = styled(
  OutlinedInput,
  {}
)(({ theme }) => ({
  width: 434,
  marginLeft: 16,
  paddingLeft: 16,
  paddingRight: 16,
  "& input": {
    background: "transparent !important",
    paddingLeft: "4px !important",
  },
  [theme.breakpoints.down("lg")]: {
    width: 250,
  },
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginLeft: 4,
    background: "#fff",
  },
}));

const HeaderAvatarStyle = styled(
  Avatar,
  {}
)(({ theme }) => ({
  ...theme.typography.commonAvatar,
  ...theme.typography.mediumAvatar,
  background: theme.palette.secondary.light,
  color: theme.palette.secondary.dark,
  "&:hover": {
    background: theme.palette.secondary.dark,
    color: theme.palette.secondary.light,
  },
}));

// ==============================|| SEARCH INPUT - MOBILE||============================== //

const MobileSearch = ({
  value,
  setValue,
  popupState,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  popupState: any;
}) => {
  const theme = useTheme();

  return (
    <OutlineInputStyle
      id="input-search-header"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search"
      startAdornment={
        <InputAdornment position="start">
          <Search
            sx={{
              fontSize: "1rem",
              color: theme.palette.grey[500],
              stroke: 1.5,
            }}
          />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <ButtonBase sx={{ borderRadius: "12px" }}>
            <HeaderAvatarStyle variant="rounded">
              {/* <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" /> */}
              <Tune sx={{ fontSize: "1.3rem" }} />
            </HeaderAvatarStyle>
          </ButtonBase>
          <Box sx={{ ml: 2 }}>
            <ButtonBase sx={{ borderRadius: "12px" }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  background: theme.palette.orange.light,
                  color: theme.palette.orange.dark,
                  "&:hover": {
                    background: theme.palette.orange.dark,
                    color: theme.palette.orange.light,
                  },
                }}
              >
                {/* <IconX stroke={1.5} size="1.3rem" /> */}
                <Typography fontSize="1.2rem" fontWeight="500">
                  X
                </Typography>
              </Avatar>
            </ButtonBase>
          </Box>
        </InputAdornment>
      }
      aria-describedby="search-helper-text"
      inputProps={{ "aria-label": "weight" }}
    />
  );
};

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
  const theme = useTheme();
  const [value, setValue] = useState("");

  return (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {/* <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <ButtonBase sx={{ borderRadius: "12px" }}>
                  <HeaderAvatarStyle
                    variant="rounded"
                    {...bindToggle(popupState)}
                  >
                    <Search sx={{ fontSize: "1.2rem" }} />
                  </HeaderAvatarStyle>
                </ButtonBase>
              </Box>
              <PopperStyle {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                  <>
                    <Card
                      sx={{
                        background: "#fff",
                        [theme.breakpoints.down("sm")]: {
                          border: 0,
                          boxShadow: "none",
                        },
                      }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item xs>
                            <MobileSearch
                              value={value}
                              setValue={setValue}
                              popupState={popupState}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  </>
                )}
              </PopperStyle>
            </>
          )}
        </PopupState> */}
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <OutlineInputStyle
          id="input-search-header"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              {/* <IconSearch
                stroke={1.5}
                size="1rem"
                color={theme.palette.grey[500]}
              /> */}
              <Search
                sx={{ fontSize: "1rem", color: theme.palette.grey[500] }}
              />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <ButtonBase sx={{ borderRadius: "12px" }}>
                <HeaderAvatarStyle variant="rounded">
                  {/* <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" /> */}
                  <Tune sx={{ fontSize: "1.3rem" }} />
                </HeaderAvatarStyle>
              </ButtonBase>
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          inputProps={{ "aria-label": "weight" }}
        />
      </Box>
    </>
  );
};

export default SearchSection;
