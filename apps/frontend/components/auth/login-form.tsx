'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import OAuthButtons from './o-auth-buttons';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const router = useRouter();
    const params = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: LoginValues) => {
        startTransition(async () => {
            await signIn.email(
                {
                    email: values.email,
                    password: values.password,
                    callbackURL: params.get('callbackUrl') || '/dashboard',
                },
                {
                    onSuccess: () => {
                        toast.success('Successfully logged in!');
                        router.push(params.get('callbackUrl') || '/dashboard');
                    },
                    onError: ctx => {
                        toast.error(ctx.error.message);
                    },
                }
            );
        });
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className='p-0 overflow-hidden'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='p-6 md:p-8'>
                        <FieldGroup>
                            <div className='flex flex-col items-center gap-2 text-center'>
                                <h1 className='text-2xl font-bold'>
                                    Welcome back
                                </h1>
                                <p className='text-sm text-balance text-muted-foreground'>
                                    Login to your account
                                </p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor='email'>Email</FieldLabel>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='m@example.com'
                                    autoComplete='email'
                                    {...register('email')}
                                />
                                <FieldError errors={[errors.email]} />
                            </Field>
                            <Field>
                                <div className='flex items-center'>
                                    <FieldLabel htmlFor='password'>
                                        Password
                                    </FieldLabel>
                                    <a
                                        href='#'
                                        className='ml-auto text-sm underline-offset-2 hover:underline'>
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id='password'
                                    type='password'
                                    autoComplete='current-password'
                                    {...register('password')}
                                />
                                <FieldError errors={[errors.password]} />
                            </Field>
                            <Field>
                                <Button
                                    type='submit'
                                    className='w-full'
                                    disabled={isPending}>
                                    {isPending ? (
                                        <Loader2
                                            size={16}
                                            className='animate-spin'
                                        />
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                            </Field>
                            <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                                Or continue with
                            </FieldSeparator>
                            <OAuthButtons />
                            <FieldDescription className='text-center'>
                                Don&apos;t have an account?{' '}
                                <a
                                    href='/signup'
                                    className='underline underline-offset-4'>
                                    Sign up
                                </a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    <div className='relative hidden bg-muted md:block'>
                        <img
                            src='/images/auth.svg'
                            alt='Image'
                            className='absolute bottom-1 w-full object-cover object-bottom'
                        />
                    </div>
                </CardContent>
            </Card>
            <FieldDescription className='px-6 text-center'>
                By clicking continue, you agree to our{' '}
                <a href='#'>Terms of Service</a> and{' '}
                <a href='#'>Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}

