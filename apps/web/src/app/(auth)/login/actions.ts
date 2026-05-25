'use server'

import { signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch {
    return { error: 'Email o contraseña incorrectos' }
  }

  redirect('/')
}
