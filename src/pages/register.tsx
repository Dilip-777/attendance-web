// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";

// project imports
import AuthWrapper1 from "../components/Authentication/AuthWrapper1";
import AuthCardWrapper from "../components/Authentication/AuthCardWrapper";
import AuthRegister from "../components/Authentication/auth-forms/AuthRegister";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

// assets

// ===============================|| AUTH3 - REGISTER ||=============================== //

const Register = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AuthWrapper1>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "calc(100vh - 68px)" }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction={matchDownSM ? "column-reverse" : "row"}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item>
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <Typography
                            color={theme.palette.secondary.main}
                            gutterBottom
                            variant={matchDownSM ? "h3" : "h2"}
                          >
                            Create User
                          </Typography>
                          <Typography
                            variant="caption"
                            fontSize="16px"
                            textAlign={matchDownSM ? "center" : "inherit"}
                          >
                            Enter the credentials to continue
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthRegister />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}></Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Register;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (session?.user?.role !== "Admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
