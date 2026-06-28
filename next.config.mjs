/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow reading index.html from project root in server components
  experimental: {},
  // Disable strict mode to avoid double useEffect in dev (app.js runs once)
  reactStrictMode: false,
};

export default nextConfig;
