import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    newUser: '/registro',
    verifyRequest: '/verificar',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isAuthRoute =
        nextUrl.pathname.startsWith('/comunidad') ||
        nextUrl.pathname.startsWith('/perfil') ||
        nextUrl.pathname.startsWith('/reservas') ||
        nextUrl.pathname.startsWith('/online')

      if (isAdminRoute) {
        return isLoggedIn
      }
      if (isAuthRoute) {
        return isLoggedIn
      }
      return true
    },
    session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
      }
      return session
    },
  },
  providers: [],
}
