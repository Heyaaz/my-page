import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com'

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Heeyaa — Developer & Builder',
    template: '%s | Heeyaa',
  },
  description: '개발자이자 빌더. 코드로 문제를 풀고, 글로 생각을 쌓습니다.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName: 'Heeyaa',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export function buildPostMetadata(title: string, description: string, image?: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image && { images: [{ url: image }] }),
    },
  }
}
