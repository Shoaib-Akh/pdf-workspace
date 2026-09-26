import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { APP_CONFIG } from '@/lib/config'
import { User, Calendar, ArrowLeft, AlertCircle } from 'lucide-react'

// HTML tags and attributes allowed in blog content
const BLOG_ALLOWED_TAGS = [
  'h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'em',
  'a', 'img', 'blockquote', 'code', 'pre', 'br', 'hr',
]
const BLOG_ALLOWED_ATTR = ['href', 'src', 'alt', 'class', 'target', 'rel']

function sanitizeBlogContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: BLOG_ALLOWED_TAGS,
    ALLOWED_ATTR: BLOG_ALLOWED_ATTR,
    FORCE_BODY: true,
  })
}

interface Blog {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  meta_description: string
  author: string
  created_at: string
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/blogs/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setNotFound(true)
        else setBlog(d.blog)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto py-20 px-4 space-y-4 animate-pulse">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
          <div className="space-y-3 mt-8">
            {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded" />)}
          </div>
        </div>
      </PageLayout>
    )
  }

  if (notFound || !blog) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto py-20 px-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Blog Post Not Found</h1>
          <p className="text-zinc-500 mt-2 mb-6">This article may have been removed or the link is incorrect.</p>
          <Link to="/blog" className="text-brand-600 hover:underline font-medium flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </PageLayout>
    )
  }

  const canonicalUrl = `${APP_CONFIG.siteUrl}/blog/${blog.slug}`
  const metaDesc = blog.meta_description || blog.excerpt || `Read ${blog.title} on ${APP_CONFIG.name} Blog.`
  const datePublished = new Date(blog.created_at).toISOString()

  // Schema.org Article markup
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": metaDesc,
    "author": { "@type": "Person", "name": blog.author || 'Admin' },
    "publisher": {
      "@type": "Organization",
      "name": APP_CONFIG.name,
      "url": APP_CONFIG.siteUrl
    },
    "datePublished": datePublished,
    "dateModified": datePublished,
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl }
  }

  // Sanitize blog content before rendering to prevent stored XSS
  const sanitizedContent = sanitizeBlogContent(blog.content)

  return (
    <PageLayout>
      <MetaTags
        title={`${blog.title} — ${APP_CONFIG.name} Blog`}
        description={metaDesc}
        canonical={canonicalUrl}
      />

      {/* Schema.org Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Open Graph / Social sharing tags */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={blog.title} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={blog.title} />
      <meta name="twitter:description" content={metaDesc} />

      <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link to="/" className="hover:text-zinc-600">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-zinc-600">Blog</Link>
          <span>/</span>
          <span className="text-zinc-600 dark:text-zinc-300 line-clamp-1">{blog.title}</span>
        </nav>

        {/* Blog Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight mb-4">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-zinc-400 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> {blog.author || 'Admin'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time dateTime={datePublished}>
                {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </span>
          </div>
        </header>

        {/* Blog Content — Sanitized HTML from database (DOMPurify allowlist applied) */}
        <div
          className="prose prose-zinc dark:prose-invert max-w-none
            prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:font-semibold
            prose-p:leading-relaxed prose-p:text-zinc-700 dark:prose-p:text-zinc-300
            prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-zinc-700 dark:prose-li:text-zinc-300
            prose-strong:font-semibold prose-strong:text-zinc-900 dark:prose-strong:text-white
            prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-blockquote:border-l-4 prose-blockquote:border-brand-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-zinc-500
            prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Back to Blog */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </Link>
        </div>
      </article>
    </PageLayout>
  )
}
