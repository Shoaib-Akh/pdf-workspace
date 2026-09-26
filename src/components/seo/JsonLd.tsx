import type { AppConfig } from '@/lib/config'

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function buildWebSiteSchema(config: AppConfig): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: config.siteUrl,
  }
}

export function buildOrganizationSchema(config: AppConfig): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.siteName,
    url: config.siteUrl,
    logo: config.defaultOgImage,
  }
}

export function buildWebApplicationSchema(tool: { name: string; description: string; url: string }): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any'
  }
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

export function buildArticleSchema(article: { title: string; description: string; url: string; publishedTime: string; modifiedTime: string; authorName: string }): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime,
    author: {
      '@type': 'Person',
      name: article.authorName
    }
  }
}

export default JsonLd
