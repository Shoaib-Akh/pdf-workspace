import { Helmet } from 'react-helmet-async'
import { APP_CONFIG } from '@/lib/config'

interface MetaTagsProps {
  title: string
  description: string
  keywords?: string | string[]
  canonical?: string
  noindex?: boolean
  ogImage?: string
  ogType?: 'website' | 'article'
  articlePublishedTime?: string
  articleModifiedTime?: string
}

export function MetaTags({
  title,
  description,
  keywords,
  canonical,
  noindex,
  ogImage = APP_CONFIG?.defaultOgImage,
  ogType = 'website',
  articlePublishedTime,
  articleModifiedTime
}: MetaTagsProps) {
  const fullTitle = `${title} | ${APP_CONFIG?.siteName || 'PDF Guru'}`
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? `${APP_CONFIG?.siteUrl}${window.location.pathname}` : APP_CONFIG?.siteUrl)
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {ogType === 'article' && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {ogType === 'article' && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  )
}

export default MetaTags
