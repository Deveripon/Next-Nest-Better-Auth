'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    Box,
    ChevronRight,
    Cpu,
    GitMerge,
    Github,
    Globe,
    Layers,
    Palette,
    Play,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

// --- Components ---

const Beam = ({
    delay,
    duration,
    color = 'var(--primary)',
}: {
    delay: string;
    duration: string;
    color?: string;
}) => (
    <div
        className='absolute -top-40 -right-[1px] w-[1px] h-40 bg-gradient-to-b from-transparent via-[var(--beam-color)] to-transparent animate-beam opacity-0 shadow-[0_0_15px_var(--beam-color)]'
        style={
            {
                '--beam-color': color,
                animationDelay: delay,
                animationDuration: duration,
            } as React.CSSProperties
        }
    />
);

const SpotlightCard = ({
    children,
    className,
    delay = '0ms',
    beamColor,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: string;
    beamColor?: string;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative rounded-2xl bg-[#172c48]/5 border border-white/[0.05] p-6 overflow-hidden hover:bg-[#172c48]/20 transition-all duration-500 fade-up-element ${className}`}
            style={{ transitionDelay: delay }}>
            <div
                className='absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${beamColor || 'rgba(0, 183, 168, 0.05)'}, transparent 40%)`,
                }}
            />
            {children}
        </div>
    );
};

const FadeUp = ({
    children,
    delay = '0ms',
    className = '',
}: {
    children: React.ReactNode;
    delay?: string;
    className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                const entry = entries[0];
                if (entry?.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-[4px]'} ${className}`}
            style={{ transitionDelay: delay }}>
            {children}
        </div>
    );
};

// --- Main Page ---

export default function Page() {
    const [mouseGlobal, setMouseGlobal] = useState({ x: '50%', y: '50%' });

    useEffect(() => {
        const handleGlobalMouse = (e: MouseEvent) => {
            setMouseGlobal({ x: `${e.clientX}px`, y: `${e.clientY}px` });
        };
        window.addEventListener('mousemove', handleGlobalMouse);
        return () => window.removeEventListener('mousemove', handleGlobalMouse);
    }, []);

    return (
        <div className='relative min-h-screen selection:bg-[#00b7a8]/30 selection:text-white'>
            {/* Ambient Background */}
            <div className='fixed inset-0 pointer-events-none z-0'>
                <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#172c48]/30 blur-[100px] rounded-full mix-blend-screen opacity-50' />
                <div className='absolute top-[-100px] left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-[#00b7a8]/10 blur-[120px] rounded-full' />
                <div
                    className='fixed inset-0 transition-opacity duration-300 z-0'
                    style={{
                        background: `radial-gradient(600px circle at ${mouseGlobal.x} ${mouseGlobal.y}, rgba(0, 183, 168, 0.03), transparent 40%)`,
                    }}
                />
            </div>

            {/* Grid Lines & Beams */}
            <div className='fixed inset-0 pointer-events-none z-0 max-w-7xl mx-auto border-x border-white/[0.03]'>
                <div className='grid grid-cols-6 md:grid-cols-12 h-full w-full'>
                    {[...Array(11)].map((_, i) => (
                        <div
                            key={i}
                            className='border-r border-white/[0.03] h-full hidden md:block relative overflow-hidden'>
                            {i % 2 === 0 && (
                                <Beam
                                    delay={`${i * 0.5}s`}
                                    duration={`${7 + (i % 3) * 2}s`}
                                    color={i % 4 === 0 ? '#00b7a8' : '#172c48'}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <nav className='sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#050505]/80 backdrop-blur-md'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <span className='text-[#00b7a8] flex items-center justify-center p-1.5 rounded-lg bg-[#00b7a8]/10 border border-[#00b7a8]/20'>
                            <Layers className='w-5 h-5' />
                        </span>
                        <span className='text-lg font-bold tracking-tight text-white'>
                            NextNest
                        </span>
                    </div>

                    <div className='hidden md:flex items-center gap-8'>
                        <Link
                            href='#features'
                            className='text-xs font-medium text-gray-400 hover:text-[#00b7a8] transition-colors'>
                            Features
                        </Link>
                        <Link
                            href='#stack'
                            className='text-xs font-medium text-gray-400 hover:text-[#00b7a8] transition-colors'>
                            Tech Stack
                        </Link>
                        <Link
                            href='#pricing'
                            className='text-xs font-medium text-gray-400 hover:text-[#00b7a8] transition-colors'>
                            Pricing
                        </Link>
                    </div>

                    <div className='flex items-center gap-4'>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='hidden md:flex text-gray-400 hover:text-white'>
                            Sign in
                        </Button>
                        <Button className='rounded-full h-9 px-5 text-[11px] font-bold tracking-wide text-[#050505] bg-[#00b7a8] hover:bg-[#00b7a8]/90 transition-all border-none'>
                            GET STARTED
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className='relative z-10'>
                {/* Hero Section */}
                <section className='relative pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center'>
                    <FadeUp>
                        <Link
                            href='#pricing'
                            className='group relative inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] pr-4 pl-1.5 py-1.5 hover:border-white/20 transition-all mb-10'>
                            <span className='rounded-full bg-[#00b7a8]/10 border border-[#00b7a8]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#00b7a8] tracking-widest uppercase'>
                                V1.0 IS LIVE
                            </span>
                            <span className='text-xs font-medium text-gray-400 flex items-center gap-1 group-hover:text-gray-200 transition-colors'>
                                The ultimate monorepo starter
                                <ChevronRight className='w-3 h-3 text-gray-600' />
                            </span>
                        </Link>
                    </FadeUp>

                    <FadeUp delay='100ms'>
                        <h1 className='text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-white leading-[1.05] mb-6'>
                            Ship Smarter.
                            <br />
                            <span className='font-serif italic font-normal text-[#00b7a8] inline-block mt-2'>
                                Accelerate.
                            </span>
                        </h1>
                    </FadeUp>

                    <FadeUp delay='200ms' className='max-w-2xl mx-auto'>
                        <p className='text-lg md:text-xl text-gray-400 font-medium leading-relaxed mb-12'>
                            A premium Next.js & NestJS starter kit with
                            BetterAuth, Prisma, and Tailwind 4. Built for
                            developers who refuse to waste time on boilerplate.
                        </p>
                    </FadeUp>

                    <FadeUp
                        delay='300ms'
                        className='flex flex-col sm:flex-row gap-4 justify-center items-center w-full'>
                        <Button className='group h-14 px-8 rounded-full bg-[#00b7a8] hover:bg-[#00b7a8]/90 text-[#050505] font-bold text-lg shadow-[0_0_20px_-5px_rgba(0,183,168,0.4)] transition-all'>
                            Start Building Now
                            <Sparkles className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
                        </Button>

                        <Button
                            variant='outline'
                            className='h-14 pl-2 pr-6 rounded-full bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] text-white font-bold backdrop-blur-sm transition-all'>
                            <div className='w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3'>
                                <Play className='w-4 h-4 text-black fill-current ml-0.5' />
                            </div>
                            Watch Demo
                        </Button>
                    </FadeUp>

                    {/* Logo Cloud / Tech Stack Marquee */}
                    <FadeUp delay='400ms' className='mt-24 w-full'>
                        <p className='text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-10'>
                            Powered By Industry Standards
                        </p>
                        <div className='relative flex overflow-hidden group'>
                            <MarqueeContent />
                        </div>
                    </FadeUp>
                </section>

                {/* Features Section */}
                <section
                    id='features'
                    className='relative py-24 px-6 max-w-7xl mx-auto border-t border-white/[0.05]'>
                    <FadeUp className='text-center max-w-2xl mx-auto mb-16'>
                        <h2 className='text-4xl md:text-5xl font-serif italic text-white tracking-tight mb-4'>
                            Stop wasting{' '}
                            <span className='text-[#00b7a8] not-italic font-sans font-bold'>
                                precious weeks.
                            </span>
                        </h2>
                        <p className='text-gray-400 text-lg font-medium leading-relaxed'>
                            Generic starters are bloated. NextNest is
                            laser-focused on performance, security, and
                            developer joy.
                        </p>
                    </FadeUp>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <SpotlightCard delay='0ms'>
                            <div className='h-40 w-full mb-6 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-4 select-none'>
                                <div className='w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#00b7a8]/20 to-[#172c48]/20 border border-white/10 flex items-center justify-center shadow-2xl'>
                                    <GitMerge className='w-10 h-10 text-[#00b7a8]' />
                                </div>
                                <div className='absolute bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white/5 rounded-full overflow-hidden'>
                                    <div className='h-full bg-[#00b7a8] w-2/3 animate-pulse' />
                                </div>
                            </div>
                            <div className='flex items-center gap-2 mb-2'>
                                <span className='text-[10px] font-bold text-[#00b7a8] bg-[#00b7a8]/10 px-2 py-0.5 rounded border border-[#00b7a8]/20'>
                                    READY
                                </span>
                            </div>
                            <h3 className='text-xl text-white font-bold mb-2 tracking-tight'>
                                Shared Types
                            </h3>
                            <p className='text-sm text-gray-500 leading-relaxed font-medium'>
                                End-to-end type safety. Your NestJS models and
                                Next.js frontend stay in perfect sync.
                            </p>
                        </SpotlightCard>

                        <SpotlightCard
                            delay='100ms'
                            beamColor='rgba(7, 141, 139, 0.05)'>
                            <div className='h-40 w-full mb-6 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center select-none'>
                                <div className='text-center'>
                                    <div className='text-5xl font-bold text-[#00b7a8] tracking-tighter'>
                                        0.8s
                                    </div>
                                    <div className='text-[10px] text-gray-600 uppercase tracking-widest mt-2 font-bold'>
                                        Dev Reload
                                    </div>
                                </div>
                                <div className='absolute bottom-0 left-0 w-full h-0.5 bg-gray-800'>
                                    <div
                                        className='h-full bg-[#00b7a8] w-1/2 animate-beam'
                                        style={
                                            {
                                                animationDuration: '2s',
                                            } as React.CSSProperties
                                        }
                                    />
                                </div>
                            </div>
                            <div className='flex items-center gap-2 mb-2'>
                                <span className='text-[10px] font-bold text-[#078d8b] bg-[#078d8b]/10 px-2 py-0.5 rounded border border-[#078d8b]/20'>
                                    ULTRAFAST
                                </span>
                            </div>
                            <h3 className='text-xl text-white font-bold mb-2 tracking-tight'>
                                Turbo Powered
                            </h3>
                            <p className='text-sm text-gray-500 leading-relaxed font-medium'>
                                Optimized TurboRepo configuration for
                                lightning-fast builds and local development.
                            </p>
                        </SpotlightCard>

                        <SpotlightCard
                            delay='200ms'
                            beamColor='rgba(23, 44, 72, 0.15)'>
                            <div className='h-40 w-full mb-6 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center select-none'>
                                <div className='w-16 h-16 rounded-full border-2 border-dashed border-[#00b7a8]/50 flex items-center justify-center relative animate-spin-slow'>
                                    <ShieldCheck className='w-8 h-8 text-[#00b7a8]' />
                                </div>
                                <div className='absolute top-4 right-4'>
                                    <Badge
                                        variant='outline'
                                        className='bg-[#00b7a8]/5 text-[#00b7a8] border-[#00b7a8]/20'>
                                        SECURE
                                    </Badge>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 mb-2'>
                                <span className='text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20'>
                                    BUILT-IN
                                </span>
                            </div>
                            <h3 className='text-xl text-white font-bold mb-2 tracking-tight'>
                                BetterAuth Pro
                            </h3>
                            <p className='text-sm text-gray-500 leading-relaxed font-medium'>
                                Pre-configured social logins, session
                                management, and RBAC. Production ready from day
                                one.
                            </p>
                        </SpotlightCard>
                    </div>
                </section>

                {/* Tech Stack Grid */}
                <section
                    id='stack'
                    className='relative py-24 px-6 max-w-7xl mx-auto'>
                    <FadeUp className='text-center mb-16'>
                        <h2 className='text-4xl md:text-6xl font-serif text-white mb-6 tracking-tight'>
                            Modern. Scalable.
                            <br />
                            <span className='italic text-[#00b7a8]'>
                                Opinionated.
                            </span>
                        </h2>
                        <p className='text-gray-400 text-lg max-w-2xl mx-auto font-medium'>
                            We chose the best tools so you don't have to. Every
                            piece of the stack is integrated for maximum
                            efficiency.
                        </p>
                    </FadeUp>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                        <StackItem
                            icon={<Globe className='w-6 h-6' />}
                            name='Next.js 15'
                            desc='React 19, Server Actions'
                        />
                        <StackItem
                            icon={<Cpu className='w-6 h-6' />}
                            name='NestJS 11'
                            desc='Modular Backend Architecture'
                        />
                        <StackItem
                            icon={<Github className='w-6 h-6' />}
                            name='TurboRepo'
                            desc='Optimized Monorepo Tooling'
                        />
                        <StackItem
                            icon={<Palette className='w-6 h-6' />}
                            name='Tailwind 4'
                            desc='The Latest CSS Engine'
                        />
                        <StackItem
                            icon={<Box className='w-6 h-6' />}
                            name='Prisma ORM'
                            desc='Type-safe Database Access'
                        />
                        <StackItem
                            icon={<ShieldCheck className='w-6 h-6' />}
                            name='BetterAuth'
                            desc='Modern Auth Middleware'
                        />
                        <StackItem
                            icon={<Layers className='w-6 h-6' />}
                            name='Shadcn UI'
                            desc='Premium Accessible Components'
                        />
                        <StackItem
                            icon={<Sparkles className='w-6 h-6' />}
                            name='TypeScript'
                            desc='Robust & Type-Safe Code'
                        />
                    </div>
                </section>

                {/* Final CTA */}
                <section className='w-full relative py-32 overflow-hidden border-t border-white/10 bg-[#020617]'>
                    <div className='absolute inset-0 bg-gradient-to-t from-[#172c48]/20 to-transparent pointer-events-none' />
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#00b7a8]/5 blur-[100px] rounded-full pointer-events-none' />

                    <FadeUp className='relative max-w-4xl mx-auto px-6 flex flex-col items-center text-center z-10'>
                        <h2 className='text-5xl md:text-7xl font-serif text-white tracking-tight leading-[1.1] mb-8'>
                            Ready to{' '}
                            <span className='italic text-transparent bg-clip-text bg-gradient-to-br from-[#00b7a8] to-[#172c48]'>
                                Dominate
                            </span>
                            <br /> the market?
                        </h2>
                        <p className='text-lg text-gray-400 font-medium max-w-xl mb-10'>
                            Join 500+ developers building high-performance
                            startups with the NextNest ecosystem.
                        </p>
                        <Button className='h-14 px-10 rounded-full bg-[#00b7a8] text-[#050505] font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_-5px_rgba(0,183,168,0.5)]'>
                            Start Your Project
                            <ArrowRight className='ml-2 w-6 h-6' />
                        </Button>
                    </FadeUp>
                </section>
            </main>

            {/* Footer */}
            <footer className='py-12 px-6 border-t border-white/5 bg-[#050505] relative z-10'>
                <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8'>
                    <div className='flex items-center gap-2'>
                        <span className='text-[#00b7a8] flex items-center justify-center p-1 rounded-md bg-[#00b7a8]/10'>
                            <Layers className='w-4 h-4' />
                        </span>
                        <span className='text-sm font-bold text-white'>
                            NextNest Starter
                        </span>
                    </div>
                    <div className='flex gap-8 text-[11px] font-bold text-gray-600 uppercase tracking-widest'>
                        <Link
                            href='#'
                            className='hover:text-gray-200 transition-colors'>
                            Docs
                        </Link>
                        <Link
                            href='#'
                            className='hover:text-gray-200 transition-colors'>
                            Privacy
                        </Link>
                        <Link
                            href='#'
                            className='hover:text-gray-200 transition-colors'>
                            Twitter
                        </Link>
                        <Link
                            href='#'
                            className='hover:text-gray-200 transition-colors'>
                            Feedback
                        </Link>
                    </div>
                    <p className='text-[10px] text-gray-700 font-bold uppercase tracking-widest'>
                        © 2025 ALL RIGHTS RESERVED.
                    </p>
                </div>
            </footer>
        </div>
    );
}

// --- Helper Components ---

function TechLogo({ name, src }: { name: string; src?: string }) {
    return (
        <div className='flex items-center gap-2 group/logo opacity-50 hover:opacity-100 transition-all duration-300'>
            <div className='w-8 h-8 relative flex items-center justify-center grayscale group-hover/logo:grayscale-0 transition-all'>
                {src ? (
                    <img
                        src={src}
                        alt={name}
                        className='w-full h-full object-contain'
                    />
                ) : (
                    <div className='w-8 h-8 bg-white/10 rounded flex items-center justify-center'>
                        <Box className='w-4 h-4 text-gray-400' />
                    </div>
                )}
            </div>
            <span className='text-sm font-bold text-gray-500 group-hover/logo:text-gray-200 transition-colors cursor-default'>
                {name}
            </span>
        </div>
    );
}

const TECH_STACK = [
    {
        name: 'Next.js',
        src: 'https://cdn.worldvectorlogo.com/logos/next-js.svg',
    },
    { name: 'NestJS', src: 'https://cdn.worldvectorlogo.com/logos/nestjs.svg' },
    {
        name: 'Prisma',
        src: 'https://cdn.worldvectorlogo.com/logos/prisma-2.svg',
    },
    {
        name: 'PostgreSQL',
        src: 'https://cdn.worldvectorlogo.com/logos/postgresql.svg',
    },
    {
        name: 'Tailwind CSS',
        src: 'https://cdn.worldvectorlogo.com/logos/tailwindcss.svg',
    },
    { name: 'BetterAuth', src: '/images/better-auth.png' },
    {
        name: 'TurboRepo',
        src: '/images/turborepo.jpg',
    },
    {
        name: 'TypeScript',
        src: 'https://cdn.worldvectorlogo.com/logos/typescript.svg',
    },
];

function MarqueeContent() {
    return (
        <div className='flex animate-marquee whitespace-nowrap gap-16 items-center min-w-full pr-16'>
            {TECH_STACK.map((tech, i) => (
                <TechLogo key={i} name={tech.name} src={tech.src} />
            ))}
            {/* Duplicate for seamless loop */}
            {TECH_STACK.map((tech, i) => (
                <TechLogo key={`dup-${i}`} name={tech.name} src={tech.src} />
            ))}
        </div>
    );
}

function StackItem({
    icon,
    name,
    desc,
}: {
    icon: React.ReactNode;
    name: string;
    desc: string;
}) {
    return (
        <div className='p-6 rounded-2xl border border-white/[0.03] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all group'>
            <div className='mb-4 text-[#00b7a8] group-hover:scale-110 transition-transform origin-left'>
                {icon}
            </div>
            <h4 className='text-white font-bold mb-1'>{name}</h4>
            <p className='text-[11px] text-gray-600 font-bold uppercase tracking-wider'>
                {desc}
            </p>
        </div>
    );
}

