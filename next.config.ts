const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ca.slack-edge.com",
      },
    ],
  },
};

export default nextConfig;
