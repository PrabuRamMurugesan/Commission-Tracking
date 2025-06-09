module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      // crypto: require.resolve("crypto-browserify"),
      // stream: require.resolve("stream-browserify"),
      // buffer: require.resolve("buffer/"),
      // process: require.resolve("process"),
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_CRYPTO_POLYFILL: "true",
  },
};
