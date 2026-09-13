import React from 'react';
import { Link } from 'react-router-dom';
import { MetaTags } from '@/components/seo/MetaTags';
import { PageLayout } from '@/components/layout/PageLayout';
import { getFeaturedTools } from '@/data/tools';
import { ArrowRight, Search } from 'lucide-react';

export function NotFoundPage() {
  const popularTools = getFeaturedTools().slice(0, 6);

  return (
    <PageLayout>
      <MetaTags
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has moved."
        noindex={true}
      />
      
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="text-9xl font-black text-blue-600 tracking-tight mb-4">404</h1>
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Page not found</h2>
          <p className="text-lg text-zinc-600 mb-10 max-w-xl mx-auto">
            The page you're looking for doesn't exist or has moved. Let's get you back on track with one of our popular tools.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <Link
              to="/tools"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse all tools
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-zinc-200 text-base font-medium rounded-lg text-zinc-700 bg-white hover:bg-zinc-50 hover:text-zinc-900 transition-colors w-full sm:w-auto"
            >
              Go home
            </Link>
          </div>

          {popularTools.length > 0 && (
            <div className="text-left border-t border-zinc-200 pt-12">
              <h3 className="text-xl font-bold text-zinc-900 mb-6 text-center">Popular Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularTools.map(tool => (
                  <Link
                    key={tool.slug}
                    to={`/${tool.slug}`}
                    className="flex items-center p-4 bg-white rounded-xl border border-zinc-200 hover:border-blue-500 hover:shadow-sm transition-all group"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{tool.name}</h4>
                      <p className="text-sm text-zinc-500 truncate">{tool.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default NotFoundPage;
