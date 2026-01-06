/** @type {import('next').NextConfig} */
const nextConfig = {
  /* CRITICAL FIX: 
     Vercel is stuck looking for the 'dist' folder from your old project setup.
     This setting forces Next.js to build into 'dist' (instead of the default .next)
     so Vercel can find the files it expects.
  */
  distDir: 'dist',
};

export default nextConfig;
