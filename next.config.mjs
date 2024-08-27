// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self'; connect-src 'self' https://*.solana.com/  https://api.dscvr.one https://api1.stg.dscvr.one https://*.helius-rpc.com; script-src 'self'; style-src 'self'; img-src 'self'; ",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
