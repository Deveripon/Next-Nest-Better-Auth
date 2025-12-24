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
import { signUp } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import OAuthButtons from './o-auth-buttons';

const signupSchema = z
    .object({
        firstName: z
            .string()
            .min(2, 'First name must be at least 2 characters'),
        lastName: z.string().min(2, 'Last name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            ),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm({
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
    } = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: SignupValues) => {
        startTransition(async () => {
            await signUp.email({
                email: values.email,
                password: values.password,
                name: `${values.firstName} ${values.lastName}`,
                callbackURL: params.get('callbackUrl') || '/dashboard',
                fetchOptions: {
                    onError: ctx => {
                        toast.error(ctx.error.message);
                    },
                    onSuccess: () => {
                        toast.success('Successfully signed up!');
                        router.push(params.get('callbackUrl') || '/dashboard');
                    },
                },
            });
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
                                    Create your account
                                </h1>
                                <p className='text-sm text-muted-foreground text-balance'>
                                    Enter your details below to create your
                                    account
                                </p>
                            </div>

                            <Field className='grid grid-cols-2 gap-4'>
                                <Field>
                                    <FieldLabel htmlFor='firstName'>
                                        First Name
                                    </FieldLabel>
                                    <Input
                                        id='firstName'
                                        placeholder='John'
                                        {...register('firstName')}
                                    />
                                    <FieldError errors={[errors.firstName]} />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='lastName'>
                                        Last Name
                                    </FieldLabel>
                                    <Input
                                        id='lastName'
                                        placeholder='Doe'
                                        {...register('lastName')}
                                    />
                                    <FieldError errors={[errors.lastName]} />
                                </Field>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor='email'>Email</FieldLabel>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='m@example.com'
                                    autoComplete='email'
                                    {...register('email')}
                                />
                                <FieldDescription>
                                    We&apos;ll use this to contact you.
                                </FieldDescription>
                                <FieldError errors={[errors.email]} />
                            </Field>

                            <Field>
                                <div className='grid grid-cols-2 gap-4'>
                                    <Field>
                                        <FieldLabel htmlFor='password'>
                                            Password
                                        </FieldLabel>
                                        <Input
                                            id='password'
                                            autoComplete='new-password'
                                            type='password'
                                            {...register('password')}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor='confirmPassword'>
                                            Confirm
                                        </FieldLabel>
                                        <Input
                                            id='confirmPassword'
                                            type='password'
                                            autoComplete='new-password'
                                            {...register('confirmPassword')}
                                        />
                                    </Field>
                                </div>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                                <FieldError
                                    errors={[
                                        errors.password,
                                        errors.confirmPassword,
                                    ]}
                                />
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
                                        'Create Account'
                                    )}
                                </Button>
                            </Field>

                            <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                                Or continue with
                            </FieldSeparator>

                            <OAuthButtons />

                            <FieldDescription className='text-center'>
                                Already have an account?{' '}
                                <a
                                    href='/login'
                                    className='underline underline-offset-4'>
                                    Sign in
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

