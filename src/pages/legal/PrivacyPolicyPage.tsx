import React from 'react';
import { MetaTags } from '@/components/seo/MetaTags';
import { PageLayout } from '@/components/layout/PageLayout';

export function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <MetaTags
        title="Privacy Policy"
        description="Our simple, clear privacy policy. We protect your data and do not read, store, or analyze your PDF documents."
      />
      
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-zinc prose-blue">
          <h1>Privacy Policy</h1>
          <p className="text-zinc-500 font-medium">Last updated: September 2026</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 my-8">
            <p className="m-0 font-medium text-blue-900">
              <strong>The short version:</strong> We do not read, store, or analyze the contents of your PDF files. Your business is your business.
            </p>
          </div>

          <h2>1. What data we collect</h2>
          <p>
            We collect minimal information necessary to provide and improve our services. This includes basic, anonymized analytics events (like which tools are most popular) to help us focus our development efforts. We never collect the content, metadata, or names of the documents you process.
          </p>

          <h2>2. Browser processing</h2>
          <p>
            Whenever possible, our tools are designed to process files entirely within your web browser. This means your files never leave your device. The processing happens locally on your machine, ensuring complete privacy and security for your sensitive documents.
          </p>

          <h2>3. Server processing</h2>
          <p>
            Some complex tools (such as advanced OCR or AI-based extraction) require server-side processing. When you use these tools, your files are securely uploaded via encrypted connections. Once the processing is complete, the original files and any generated outputs are immediately and permanently deleted from our servers. We do not keep backups or temporary copies.
          </p>

          <h2>4. Cookies</h2>
          <p>
            We use strictly necessary cookies to maintain session state and basic functionality. We do not use third-party tracking cookies or sell your browsing data to advertisers.
          </p>

          <h2>5. Third-party services</h2>
          <p>
            By default, we do not share your information or documents with third-party services. If a specific tool requires a third-party API (for instance, an external AI model), we will explicitly state this on the tool's page so you can make an informed decision before proceeding.
          </p>

          <h2>6. Contact</h2>
          <p>
            If you have any questions or concerns about this privacy policy or our data practices, please contact us at <a href="mailto:developershoaibakhtar@gmail.com">developershoaibakhtar@gmail.com</a>.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default PrivacyPolicyPage;
