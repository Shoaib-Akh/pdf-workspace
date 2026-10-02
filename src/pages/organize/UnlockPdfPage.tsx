import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import ProcessingModeTag from '@/components/pdf/ProcessingModeTag'
import ServerRequiredState from '@/components/pdf/ServerRequiredState'
import { Link } from 'react-router-dom'

export default function UnlockPdfPage() {
  return (
    <PageLayout>
      <MetaTags
        title="Unlock PDF — Remove PDF Password Online"
        description="Unlock password-protected PDF files. Secure server-side decryption engine currently in development."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <ProcessingModeTag mode="server" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl dark:text-white">
            Unlock PDF — Remove Password Restrictions
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Strip passwords and restrictions from encrypted PDF documents you own. Robust decryption engine launching soon.
          </p>
        </div>

        <ServerRequiredState
          toolName="Unlock PDF"
          alternateToolSlug="merge-pdf"
          alternateToolName="Merge PDF"
        />

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Related Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/merge-pdf" className="text-sm text-blue-600 hover:underline">
              Merge PDF &rarr;
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/compress-pdf" className="text-sm text-blue-600 hover:underline">
              Compress PDF &rarr;
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
