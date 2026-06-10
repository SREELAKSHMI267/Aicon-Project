
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth-form';
import Logo from '@/components/logo';
import { useUser } from '@/firebase';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || (!isUserLoading && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 bg-white border border-slate-200 shadow-xl rounded-2xl p-6">
      <div className="text-center">
        <Logo className="justify-center mb-4" iconSize={24} textSize="text-2xl" />
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      <AuthForm mode="login" />
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-slate-500 hover:text-slate-700 hover:underline"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
