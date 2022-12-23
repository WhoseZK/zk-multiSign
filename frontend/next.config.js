/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
        // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
      readline: false
    };

    return config;
  },
  // mock address
  env: {
    "registryAddress": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    "factoryAddress": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
  }
};

module.exports = nextConfig;
