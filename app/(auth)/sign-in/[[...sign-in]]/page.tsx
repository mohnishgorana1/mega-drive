'use client'

import { SignIn, useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

function SignInPage() {
  const { user } = useUser();
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/';
  useEffect(() => {
    if (user) {
      router.push('/');  // Redirect to the homepage if the user is already signed in
    }
  }, [user, router, redirectUrl]);
  return (
    <main className='flex h-screen items-center justify-center'>
      {
        !user &&
        <SignIn
          path='/sign-in'
          routing='path'
          afterSignOutUrl={'/'}
        />
      }
    </main>
  )
}

export default SignInPage