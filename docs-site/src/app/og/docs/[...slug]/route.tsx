import { generate as DefaultImage } from 'fumadocs-ui/og'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'

import { getPageImage, source } from '@/lib/source'

export const revalidate = false

interface RouteParams {
  slug: string[]
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<RouteParams> },
): Promise<ImageResponse> {
  const { slug } = await params
  const page = source.getPage(slug.slice(0, -1))
  if (!page) notFound()

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site="Genshin Manager"
    />,
    {
      width: 1200,
      height: 630,
    },
  )
}

export function generateStaticParams(): { slug: string[] }[] {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }))
}
