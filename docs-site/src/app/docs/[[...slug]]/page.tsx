import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page'
import { createRelativeLink } from 'fumadocs-ui/mdx'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { getPageImage, source } from '@/lib/source'
import { getMDXComponents } from '@/mdx-components'

interface PageParams {
  slug?: string[]
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>
}): Promise<ReactNode> {
  const resolvedParams = await params
  const page = source.getPage(resolvedParams.slug)
  if (!page) notFound()

  const Mdx = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <Mdx
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams(): { slug?: string[] }[] {
  return source.generateParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const resolvedParams = await params
  const page = source.getPage(resolvedParams.slug)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  }
}
