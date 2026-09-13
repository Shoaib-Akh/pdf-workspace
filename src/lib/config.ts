export interface AppConfig {
  appName: string
  name: string
  siteName: string
  appUrl: string
  url: string
  siteUrl: string
  appDescription: string
  description: string
  appTagline: string
  tagline: string
  supportEmail: string
  defaultOgImage: string
}

const url = import.meta.env.VITE_APP_URL || 'https://pdfworkspace.app'
const name = import.meta.env.VITE_APP_NAME || 'PDF Workspace'
const description = import.meta.env.VITE_APP_DESCRIPTION || 'Convert, extract, and transform PDF documents into usable data.'
const tagline = import.meta.env.VITE_APP_TAGLINE || 'Turn PDFs into usable data.'

export const APP_CONFIG: AppConfig = {
  appName: name,
  name,
  siteName: name,
  appUrl: url,
  url,
  siteUrl: url,
  appDescription: description,
  description,
  appTagline: tagline,
  tagline,
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || '',
  defaultOgImage: `${url}/og/home.jpg`,
}
