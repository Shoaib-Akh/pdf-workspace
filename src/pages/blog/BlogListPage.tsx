import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { BookOpen, User, Calendar, ArrowRight } from 'lucide-react'

interface Blog {
  id: number
  title: string
  slug: string
  excerpt: string
  author: string
  created_at: string
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blogs')
      .then(r => r.json())
      .then(d => setBlogs(d.blogs || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout>
      <MetaTags
        title="Blog — PDF Workspace Tips, Guides & Updates"
        description="Read expert guides on PDF conversion, data extraction, OCR, and business document workflows. Tips and tutorials from the PDF Workspace team."
        canonical="https://pdfguru.site/blog"
      />

      {/* Schema.org for Blog Listing */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "PDF Workspace Blog",
        "url": "https://pdfguru.site/blog",
        "description": "Expert guides on PDF conversion, data extraction, OCR, and business document workflows."
      })}} />

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="text-center mb-12 space-y-3">
          <span className="px-3.5 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Knowledge Base
          </span>
          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Blog & Guides
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Tips, tutorials, and updates to help you get the most out of PDF Workspace.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-2xl h-52" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-zinc-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {blogs.map(blog => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="group block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-brand-400 hover:shadow-md transition-all duration-200"
              >
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 transition-colors line-clamp-2 mb-3">
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-4">
                    {blog.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-zinc-400 mt-auto">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {blog.author || 'Admin'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-brand-600 font-medium">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
