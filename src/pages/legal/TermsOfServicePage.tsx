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

          <h2>3. Free vs premium use & subscriptions</h2>
          <p>
            Many of our tools are available for free. We also offer premium tiers (such as Cloud Pro) through subscription plans or one-time payments. Subscriptions are billed automatically on a recurring monthly or annual basis until canceled. You can cancel your subscription at any time via your customer billing portal.
          </p>

          <h2>4. Refund and Cancellation Policy</h2>
          <p>
            We want you to be completely satisfied with our service. We offer a <strong>14-day money-back guarantee</strong> on all subscription plans and digital purchases. If you are not satisfied with your purchase, you may request a full refund within 14 days of your initial transaction by contacting our support team at <a href="mailto:developershoaibakhtar@gmail.com">developershoaibakhtar@gmail.com</a>. Upon cancellation, your subscription will remain active until the end of the current billing cycle and will not renew.
          </p>

          <h2>5. Acceptable use</h2>
          <p>
            You agree not to use our services for any illegal or unauthorized purpose. You must not abuse, harass, threaten, impersonate, or intimidate other users. You must not use our platform to process illegal, harmful, or explicitly offensive content. Automated scraping or abusive API requests are strictly prohibited and may result in a permanent ban.
          </p>

          <h2>6. File handling and privacy</h2>
          <p>
            Your privacy is important to us. Please refer to our <a href="/privacy">Privacy Policy</a> for detailed information on how we handle your files. In short: we do not claim ownership of your documents, and we automatically delete any files sent to our servers for processing.
          </p>

          <h2>7. Intellectual property</h2>
          <p>
            You retain all rights and ownership of the documents you upload. The platform itself, including its original code, designs, and branding, is the intellectual property of our company. You may not copy, modify, or distribute our intellectual property without explicit permission.
          </p>

          <h2>8. Limitation of liability</h2>
          <p>
            In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of, or inability to access or use the service.
          </p>

          <h2>9. Changes to terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of this page. Your continued use of the service after such modifications constitutes your acceptance of the new terms.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions regarding these Terms of Service or refund requests, please contact us at <a href="mailto:developershoaibakhtar@gmail.com">developershoaibakhtar@gmail.com</a>.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default TermsOfServicePage;
