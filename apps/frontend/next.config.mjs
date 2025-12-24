/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const backendUrl = process.env.BACKEND_API_URL;

        return [
            {
                // When you call this in your frontend code
                source: '/api/v1/:path*',
                // It proxies to the URL in your .env
                destination: `${backendUrl}/:path*`,
            },
        ];
    },
};

export default nextConfig;