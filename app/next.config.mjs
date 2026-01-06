/** @type {import('next').NextConfig} */
const nextConfig = {
  /* CRITICAL FIX: 
     Force Next.js to build to the 'dist' folder.
     Your Vercel project is configured to look for 'dist' (legacy Vite setting).
     This ensures Vercel finds the build files.
  */
  distDir: 'dist',
};

export default nextConfig;
