/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// module.exports = withBundleAnalyzer({
//   env: {
//     NEXT_PUBLIC_ENV: "PRODUCTION", //your next configs goes here
//   },
// });
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
    modularizeImports: {
      "@mui/material": {
        transform: "@mui/material/${member}",
        preventFullImport: true,
      },
      "@mui/icons-material": {
        transform: "@mui/icons-material/${member}",
        preventFullImport: true,
      },
    },
  },
};

module.exports = withBundleAnalyzer({
  env: {
    NEXT_PUBLIC_ENV: "PRODUCTION",
  },
  nextConfig,
});
