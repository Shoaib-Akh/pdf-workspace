import React, { useState } from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Feature Request', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `[${formData.subject}]\n\n${formData.message}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setTrackingId(data.trackingId);
        setSubmitted(true);
      } else {
        alert(data.error || 'Failed to send message');
      }
    } catch (err) {
      alert('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <MetaTags
        title="Contact & Support — PDF Workspace"
        description="Get in touch with the PDF Workspace engineering team. Report issues, request new document extraction tools, or give feedback."
        canonical="https://pdfworkspace.app/contact"
      />

      <div className="max-w-2xl mx-auto py-8 sm:py-16 space-y-8">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Help & Feedback
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Contact Support & Engineering
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Have a question about browser processing, or need a customized document extractor for your business? We'd love to hear from you.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Message Received!</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                Thank you for reaching out. Our engineering team reviews all feedback and will reply to your email address shortly.
              </p>
              <div className="pt-4">
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Your Name</label>
                  <input
                    id="name"
                    required
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
                  <input
                    id="email"
                    required
                    type="email"
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Topic</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-zinc-900 dark:text-white"
                >
                  <option value="Feature Request">Request a New Tool or Format</option>
                  <option value="Bug Report">Report a Conversion Issue</option>
                  <option value="Enterprise">Enterprise & Custom Workflows</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Describe your document format, challenge, or suggestion..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-zinc-900 dark:text-white"
                ></textarea>
              </div>

              <Button type="submit" disabled={loading} className="w-full min-h-[44px] flex items-center justify-center gap-2">
                {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
              </Button>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
