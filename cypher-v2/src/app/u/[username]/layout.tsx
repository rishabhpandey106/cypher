import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username;
 
  return {
    title: `Send a secret message to @${username}`,
    description: `Send an anonymous message to @${username} safely and securely on Cypher.`,
    alternates: {
      canonical: `/u/${username}`,
    },
  }
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
