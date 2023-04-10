import MainLayout from "@/layout/MainLayout";
import { store } from "@/store";
import theme from "@/themes";
import {
  Box,
  CircularProgress,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { SessionProvider, useSession } from "next-auth/react";
import NProgress from "nprogress";
import Head from "next/head";

const MyApp = ({ Component, pageProps }: any) => {
  const customization = useSelector((state: any) => state.customization);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  Router.events.on("routeChangeStart", () => {
    setLoading(true);
    NProgress.start();
  });
  Router.events.on("routeChangeComplete", () => {
    setLoading(false);
    NProgress.done();
  });
  NProgress.configure({ showSpinner: false });
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme(customization)}>
        <CssBaseline />
        <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
            integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </Head>
        {loading || status === "loading" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100vh",
            }}
          >
            <CircularProgress sx={{ color: "#673ab7" }} />
          </Box>
        ) : router.pathname === "/login" || router.pathname === "/register" ? (
          <Component {...pageProps} />
        ) : (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        )}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <MyApp Component={Component} pageProps={pageProps} />
      </SessionProvider>
    </Provider>
  );
}
