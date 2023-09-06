var ExportPathMap = require("next/dist/server/config-shared").ExportPathMap;
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  reactStrictMode: false,

  // route home / to auto chosen seller profile
  // exportPathMap: function (defaultMap, ctx) {
  //   return {
  //     '/': { page: '/seller/0' }
  //   }
  // },
}

module.exports = nextConfig
