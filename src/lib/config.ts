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

const url = import.meta.env.VITE_APP_URL || 'https://pdfguru.site'
const name = import.meta.env.VITE_APP_NAME || 'PDF Guru'
const description = import.meta.env.VITE_APP_DESCRIPTION || 'Convert, extract, and transform PDF documents into usable data — your expert PDF toolkit.'
const tagline = import.meta.env.VITE_APP_TAGLINE || 'Your Expert PDF Toolkit.'

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
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'developershoaibakhtar@gmail.com',
  defaultOgImage: `${url}/og/home.jpg`,
}
