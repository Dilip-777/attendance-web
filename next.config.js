/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
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

module.exports = nextConfig;
