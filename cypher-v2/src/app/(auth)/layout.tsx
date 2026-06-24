export const metadata = {
  title: 'Verify Your Account - Cypher',
  description: 'Ensure your account is verified for a secure and seamless messaging experience.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
