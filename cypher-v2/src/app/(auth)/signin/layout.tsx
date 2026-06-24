import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  alternates: {
    canonical: '/signin',
  },
}

export default function SigninLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
