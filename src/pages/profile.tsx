import prisma from "@/lib/prisma";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Profile() {
  const [value, setValue] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { data: session } = useSession();

  const getValues = async () => {
    const res = await axios.get(`/api/user/${session?.user?.id}`);
    setName(res.data.name);
    setEmail(res.data.email);
    setPhone(res.data.mobileNumber);
  };

  useEffect(() => {
    getValues();
  }, [session]);

  const handleSubmit = async () => {
    const body = {
      name,
      email,
      mobileNumber: phone,
    };
    const res = await axios.put(`/api/user/${session?.user?.id}`, body);
    if (res.status === 200) {
      router.push("/");
    }
  };

  const handlePasswordChange = async () => {
    const body = {
      currentPassword,
      password,
    };
    if (password === confirmPassword) {
      try {
        const res = await axios.post(`/api/user/${session?.user?.id}`, body);
        if (res.status === 200) {
          router.push("/");
        }
      } catch (err: any) {
        setError(err.response.data.message);
      }
    } else {
      setError("Passwords do not match");
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Typography variant="h3" sx={{ p: 2, m: 0, fontWeight: "500" }}>
          Profile
        </Typography>
      </Paper>
      <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
        <Typography variant="h3" sx={{ p: 2, m: 0, fontWeight: "500" }}>
          Account
        </Typography>
        <Divider sx={{ my: 1, width: "100%" }} />

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Edit Profile" {...a11yProps(0)} />
              <Tab label="Change Password" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Stack spacing={4}>
              <Typography variant="h4">Edit Profile</Typography>
              <FormControl>
                <Grid mt={2} container>
                  <Grid item xs={12} sm={6}>
                    <Stack m={2} spacing={1}>
                      <FormLabel sx={{ color: "black" }}>Name</FormLabel>
                      <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter the Name"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack m={2} spacing={1}>
                      <FormLabel sx={{ color: "black" }}>Email</FormLabel>
                      <TextField
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter the Email"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack m={2} spacing={1}>
                      <FormLabel sx={{ color: "black" }}>Phone</FormLabel>
                      <TextField
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter the Phone Number"
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  sx={{
                    ml: "auto",
                    width: "6rem",
                  }}
                  type="submit"
                  onClick={handleSubmit}
                  disabled={name === "" || email === "" || phone === ""}
                >
                  Submit
                </Button>
              </FormControl>
            </Stack>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Stack spacing={4}>
              <Typography variant="h4">Change Password</Typography>
              <FormControl>
                <Grid mt={2} container>
                  <Grid mr={2} item xs={12} sm={6}>
                    <Stack m={2} spacing={1}>
                      <FormLabel sx={{ color: "black" }}>
                        Current Password
                      </FormLabel>
                      <TextField
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter the Current Password"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack m={2} spacing={1}>
                      <FormLabel sx={{ color: "black" }}>
                        New Password
                      </FormLabel>
                      <TextField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter the New Password"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack m={2} spacing={1}>
                      <FormLabel sx={{ color: "black" }}>
                        Confirm Password
                      </FormLabel>
                      <TextField
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                      />
                    </Stack>
                  </Grid>
                </Grid>
                {error && (
                  <FormHelperText sx={{ color: "red" }}>{error}</FormHelperText>
                )}
                <Button
                  variant="contained"
                  sx={{
                    ml: "auto",
                    width: "6rem",
                  }}
                  type="submit"
                  onClick={handlePasswordChange}
                  disabled={
                    confirmPassword === "" ||
                    password === "" ||
                    currentPassword === ""
                  }
                >
                  Submit
                </Button>
              </FormControl>
            </Stack>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
