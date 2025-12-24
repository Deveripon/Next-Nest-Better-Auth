import { Geist, Geist_Mono, Newsreader } from 'next/font/google';

import '@/app/globals.css';
import { Providers } from '@/components/providers';
import { SmoothScroll } from '@/components/smooth-scroll';
import { Toaster } from '@/components/ui/sonner';

const fontSans = Geist({
    subsets: ['latin'],
    variable: '--font-sans',
});

const fontMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
});

const fontSerif = Newsreader({
    subsets: ['latin'],
    style: ['italic', 'normal'],
    variable: '--font-serif',
});

export const metadata = {
    title: 'NextNest Starter | Premium Fullstack Toolkit',
    description:
        'The ultimate starter kit for Next.js, NestJS, Tailwind CSS 4, Prisma, and BetterAuth. Scalable, type-safe, and industry-ready.',
    keywords: [
        'Next.js',
        'NestJS',
        'Tailwind CSS',
        'Prisma',
        'BetterAuth',
        'Starter Kit',
        'Monorepo',
        'TypeScript',
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning className='scroll-smooth'>
            <body
                suppressHydrationWarning
                className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} font-sans antialiased min-h-screen overflow-x-hidden`}>
                <Toaster />
                <SmoothScroll />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

