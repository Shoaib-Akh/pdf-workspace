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

          <h2>4. Cookies & Third-Party Advertising</h2>
          <p>
            We use strictly necessary cookies to keep our application running reliably. Additionally, third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites:
          </p>
          <ul>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
          </ul>

          <h2>5. Optional donations & payment data</h2>
          <p>
            Donations to support PDF Guru are entirely optional. All payment transactions are handled exclusively by secure third-party payment processors. We do not collect, process, or store credit card numbers, bank account details, or payment credentials on our servers.
          </p>

          <h2>6. Third-party services & analytics</h2>
          <p>
            By default, we do not share your personal information or documents with third parties. We collect aggregated, anonymous usage telemetry (such as error rates or tool selection) to maintain infrastructure health. If a specific tool requires a third-party API, we will explicitly notify you beforehand.
          </p>

          <h2>7. Data Protection Rights (GDPR & CCPA)</h2>
          <p>
            Depending on your jurisdiction, you have specific rights regarding your personal data:
          </p>
          <ul>
            <li><strong>Right to Access & Portability:</strong> You may request confirmation of what personal data we hold.</li>
            <li><strong>Right to Erasure:</strong> You can request that any personal data we hold about you be permanently deleted.</li>
            <li><strong>Non-Discrimination:</strong> We will never deny services or charge different rates for exercising your privacy rights.</li>
          </ul>

          <h2>8. Contact Information</h2>
          <p>
            If you have any questions or concerns about this privacy policy, cookie practices, or our data handling, please contact our privacy officer at <a href="mailto:developershoaibakhtar@gmail.com">developershoaibakhtar@gmail.com</a>.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default PrivacyPolicyPage;
