
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mp-cdn.elgato.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**/raw/**', // Allows paths like /USER/REPO/raw/BRANCH/IMAGE.png
      },
      // THIS WILDCARD ALLOWS ANY HTTPS SOURCE:
      // If images still don't load, ensure:
      // 1. The image URL is correct and uses HTTPS.
      // 2. You've restarted your Next.js development server after any config changes.
      // Note: Allowing all domains has security implications.
      // Ensure you trust the sources of the image URLs you use.
      {
        protocol: 'https',
        hostname: '**', // Wildcard for any hostname
        port: '',
        pathname: '/**', // Allow any path
      }
    ],
  },
};

export default nextConfig;
