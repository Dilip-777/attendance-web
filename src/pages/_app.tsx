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
import { useState } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import NProgress from "nprogress";
import Head from "next/head";
import "../style.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const l = {
    borderRadius: 12,
    defaultId: "default",
    fontFamily: "'Roboto', sans-serif",
    isOpen: [],
    opened: true,
  };

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
    <Provider store={store}>
      <SessionProvider session={session}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme(l)}>
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
            {loading ? (
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
            ) : router.pathname === "/login" ||
              router.pathname === "/register" ? (
              <Component {...pageProps} />
            ) : (
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            )}
          </ThemeProvider>
        </StyledEngineProvider>
      </SessionProvider>
      <Analytics />
    </Provider>
  );
}
