import { useHead } from '@unhead/vue'

interface SeoInput {
  title: string
  description?: string
  keywords?: string
  ogImage?: string
}

export function usePageSeo(seo: SeoInput) {
  useHead({
    title: seo.title,
    meta: [
      ...(seo.description
        ? [{ name: 'description', content: seo.description }]
        : []),
      ...(seo.keywords ? [{ name: 'keywords', content: seo.keywords }] : []),
      { property: 'og:title', content: seo.title },
      ...(seo.description
        ? [{ property: 'og:description', content: seo.description }]
        : []),
      ...(seo.ogImage ? [{ property: 'og:image', content: seo.ogImage }] : []),
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seo.title },
      ...(seo.description
        ? [{ name: 'twitter:description', content: seo.description }]
        : []),
    ],
  })
}
