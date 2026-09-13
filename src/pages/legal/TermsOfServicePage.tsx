import React from 'react';
import { MetaTags } from '@/components/seo/MetaTags';
import { PageLayout } from '@/components/layout/PageLayout';

export function TermsOfServicePage() {
  return (
    <PageLayout>
      <MetaTags
        title="Terms of Service"
        description="Read our terms of service for using our PDF Intelligence Platform."
      />
      
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-zinc prose-blue">
          <h1>Terms of Service</h1>
          <p className="text-zinc-500 font-medium">Last updated: September 2026</p>

          <h2>1. Acceptance of terms</h2>
          <p>
            By accessing and using this platform, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services.
          </p>

          <h2>2. Description of service</h2>
          <p>
            We provide a suite of tools for processing, converting, extracting data from, and organizing PDF documents. The services are provided "as is" and "as available" without any warranties of any kind.
          </p>

          <h2>3. Free vs premium use</h2>
          <p>
            Many of our tools are available for free. However, we may impose limits on file size, processing volume, or access to certain advanced features for free users. Premium features or higher limits may be subject to subscription fees or one-time payments.
          </p>

          <h2>4. Acceptable use</h2>
          <p>
            You agree not to use our services for any illegal or unauthorized purpose. You must not abuse, harass, threaten, impersonate, or intimidate other users. You must not use our platform to process illegal, harmful, or explicitly offensive content. Automated scraping or abusive API requests are strictly prohibited and may result in a permanent ban.
          </p>

          <h2>5. File handling and privacy</h2>
          <p>
            Your privacy is important to us. Please refer to our <a href="/privacy">Privacy Policy</a> for detailed information on how we handle your files. In short: we do not claim ownership of your documents, and we automatically delete any files sent to our servers for processing.
          </p>

          <h2>6. Intellectual property</h2>
          <p>
            You retain all rights and ownership of the documents you upload. The platform itself, including its original code, designs, and branding, is the intellectual property of our company. You may not copy, modify, or distribute our intellectual property without explicit permission.
          </p>

          <h2>7. Limitation of liability</h2>
          <p>
            In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of, or inability to access or use the service.
          </p>

          <h2>8. Changes to terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of this page. Your continued use of the service after such modifications constitutes your acceptance of the new terms.
          </p>

          <h2>9. Contact</h2>
          <p>
            If you have any questions regarding these Terms of Service, please contact us at <a href="mailto:legal@example.com">legal@example.com</a>.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default TermsOfServicePage;
