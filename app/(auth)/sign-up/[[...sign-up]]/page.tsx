import { SignUp } from '@clerk/nextjs'
import React from 'react'

function SignUpPage() {
  return (
    <main className='flex items-center justify-center h-screen'>
      <SignUp />
    </main>
  )
}

export default SignUpPage