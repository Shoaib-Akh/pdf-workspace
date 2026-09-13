import { Helmet } from 'react-helmet-async'
import { APP_CONFIG } from '@/lib/config'

interface MetaTagsProps {
  title: string
  description: string
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
  canonical,
  noindex,
  ogImage = APP_CONFIG?.defaultOgImage,
  ogType = 'website',
  articlePublishedTime,
  articleModifiedTime
}: MetaTagsProps) {
  const fullTitle = `${title} | ${APP_CONFIG?.siteName || 'PDF Workspace'}`
  const url = canonical || APP_CONFIG?.siteUrl

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {url && <meta property="og:url" content={url} />}
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
