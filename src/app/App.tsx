import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

// Eager-loaded: homepage, tools directory, static pages
import HomePage from '@/pages/home/HomePage'
import ToolsPage from '@/pages/tools/ToolsPage'
import NotFoundPage from '@/pages/NotFoundPage'

// Lazy-loaded: secondary and hub pages
const SupportPage = lazy(() => import('@/pages/support/SupportPage'))
const ContactPage = lazy(() => import('@/pages/contact/ContactPage'))
const AuthPage = lazy(() => import('@/pages/auth/AuthPage'))

// Lazy-loaded: all tool pages (heavy PDF libs only load when needed)
const PdfToJpgPage = lazy(() => import('@/pages/convert/PdfToJpgPage'))
const PdfToPngPage = lazy(() => import('@/pages/convert/PdfToPngPage'))
const PdfToWebpPage = lazy(() => import('@/pages/convert/PdfToWebpPage'))
const PdfToTxtPage = lazy(() => import('@/pages/convert/PdfToTxtPage'))
const PdfToCsvPage = lazy(() => import('@/pages/convert/PdfToCsvPage'))
const PdfToJsonPage = lazy(() => import('@/pages/convert/PdfToJsonPage'))
const PdfToHtmlPage = lazy(() => import('@/pages/convert/PdfToHtmlPage'))
const PdfToMarkdownPage = lazy(() => import('@/pages/convert/PdfToMarkdownPage'))
const PdfToDataPage = lazy(() => import('@/pages/extract/PdfToDataPage'))
const PdfToWordPage = lazy(() => import('@/pages/convert/PdfToWordPage'))
const WordToPdfPage = lazy(() => import('@/pages/convert/WordToPdfPage'))
const PdfToExcelPage = lazy(() => import('@/pages/convert/PdfToExcelPage'))
const ExcelToPdfPage = lazy(() => import('@/pages/convert/ExcelToPdfPage'))
const PdfToPowerPointPage = lazy(() => import('@/pages/convert/PdfToPowerPointPage'))
const PowerPointToPdfPage = lazy(() => import('@/pages/convert/PowerPointToPdfPage'))

const MergePdfPage = lazy(() => import('@/pages/organize/MergePdfPage'))
const SplitPdfPage = lazy(() => import('@/pages/organize/SplitPdfPage'))
const CompressPdfPage = lazy(() => import('@/pages/organize/CompressPdfPage'))
const EditPdfPage = lazy(() => import('@/pages/organize/EditPdfPage'))
const RotatePdfPage = lazy(() => import('@/pages/organize/RotatePdfPage'))
const DeletePdfPagesPage = lazy(() => import('@/pages/organize/DeletePdfPagesPage'))
const ExtractPdfPagesPage = lazy(() => import('@/pages/organize/ExtractPdfPagesPage'))
const ReorderPdfPagesPage = lazy(() => import('@/pages/organize/ReorderPdfPagesPage'))
const WatermarkPdfPage = lazy(() => import('@/pages/organize/WatermarkPdfPage'))
const AddPageNumbersPage = lazy(() => import('@/pages/organize/AddPageNumbersPage'))
const PasswordProtectPage = lazy(() => import('@/pages/organize/PasswordProtectPage'))
const UnlockPdfPage = lazy(() => import('@/pages/organize/UnlockPdfPage'))

const JpgToPdfPage = lazy(() => import('@/pages/convert/JpgToPdfPage'))
const PngToPdfPage = lazy(() => import('@/pages/convert/PngToPdfPage'))
const GifToPdfPage = lazy(() => import('@/pages/convert/GifToPdfPage'))
const BmpToPdfPage = lazy(() => import('@/pages/convert/BmpToPdfPage'))
const ImagesToPdfPage = lazy(() => import('@/pages/convert/ImagesToPdfPage'))

const OcrPdfPage = lazy(() => import('@/pages/ocr/OcrPdfPage'))
const ScannedPdfToTextPage = lazy(() => import('@/pages/ocr/ScannedPdfToTextPage'))
const ScannedPdfToWordPage = lazy(() => import('@/pages/ocr/ScannedPdfToWordPage'))
const ScannedPdfToExcelPage = lazy(() => import('@/pages/ocr/ScannedPdfToExcelPage'))

const WorkspacePage = lazy(() => import('@/pages/workspace/WorkspacePage'))

const LearnIndexPage = lazy(() => import('@/pages/learn/LearnIndexPage'))
const LearnPdfToExcelPage = lazy(() => import('@/pages/learn/articles/HowToConvertPdfToExcel'))
const LearnExtractTablesPage = lazy(() => import('@/pages/learn/articles/HowToExtractTablesFromPdf'))
const LearnPdfVsScannedPage = lazy(() => import('@/pages/learn/articles/PdfVsScannedPdf'))
const LearnHowOcrWorksPage = lazy(() => import('@/pages/learn/articles/HowOcrWorks'))

const PrivacyPolicyPage = lazy(() => import('@/pages/legal/PrivacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('@/pages/legal/TermsOfServicePage'))

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const BlogListPage = lazy(() => import('@/pages/blog/BlogListPage'))
const BlogDetailPage = lazy(() => import('@/pages/blog/BlogDetailPage'))

import PageLoadingSpinner from '@/components/shared/PageLoadingSpinner'

export default function App() {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Routes>
        {/* Core & Directory */}
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />

        {/* Category Hubs */}
        <Route path="/convert" element={<ToolsPage initialCategory="Convert" />} />
        <Route path="/extract" element={<ToolsPage initialCategory="Extract" />} />
        <Route path="/organize" element={<ToolsPage initialCategory="Organize" />} />
        <Route path="/ocr" element={<ToolsPage initialCategory="OCR" />} />
        <Route path="/images" element={<ToolsPage initialCategory="Images" />} />
        <Route path="/security" element={<ToolsPage initialCategory="Security" />} />

        {/* Support, Contact, Auth, Admin & Status */}
        <Route path="/support" element={<SupportPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />

        {/* Convert */}
        <Route path="/pdf-to-jpg" element={<PdfToJpgPage />} />
        <Route path="/pdf-to-png" element={<PdfToPngPage />} />
        <Route path="/pdf-to-webp" element={<PdfToWebpPage />} />
        <Route path="/pdf-to-image" element={<PdfToJpgPage />} />
        <Route path="/pdf-to-txt" element={<PdfToTxtPage />} />
        <Route path="/pdf-to-text" element={<PdfToTxtPage />} />
        <Route path="/pdf-to-csv" element={<PdfToCsvPage />} />
        <Route path="/pdf-to-json" element={<PdfToJsonPage />} />
        <Route path="/pdf-to-html" element={<PdfToHtmlPage />} />
        <Route path="/pdf-to-markdown" element={<PdfToMarkdownPage />} />
        <Route path="/pdf-to-data" element={<PdfToDataPage />} />
        <Route path="/pdf-to-word" element={<PdfToWordPage />} />
        <Route path="/pdf-to-doc" element={<PdfToWordPage />} />
        <Route path="/pdf-to-docx" element={<PdfToWordPage />} />
        <Route path="/pdf-to-excel" element={<PdfToExcelPage />} />
        <Route path="/pdf-to-powerpoint" element={<PdfToPowerPointPage />} />

        {/* Reverse convert */}
        <Route path="/word-to-pdf" element={<WordToPdfPage />} />
        <Route path="/doc-to-pdf" element={<WordToPdfPage />} />
        <Route path="/docx-to-pdf" element={<WordToPdfPage />} />
        <Route path="/excel-to-pdf" element={<ExcelToPdfPage />} />
        <Route path="/xlsx-to-pdf" element={<ExcelToPdfPage />} />
        <Route path="/xls-to-pdf" element={<ExcelToPdfPage />} />
        <Route path="/powerpoint-to-pdf" element={<PowerPointToPdfPage />} />
        <Route path="/ppt-to-pdf" element={<PowerPointToPdfPage />} />
        <Route path="/pptx-to-pdf" element={<PowerPointToPdfPage />} />
        <Route path="/jpg-to-pdf" element={<JpgToPdfPage />} />
        <Route path="/png-to-pdf" element={<PngToPdfPage />} />
        <Route path="/gif-to-pdf" element={<GifToPdfPage />} />
        <Route path="/bmp-to-pdf" element={<BmpToPdfPage />} />
        <Route path="/webp-to-pdf" element={<JpgToPdfPage />} />
        <Route path="/images-to-pdf" element={<ImagesToPdfPage />} />

        {/* Organize */}
        <Route path="/merge-pdf" element={<MergePdfPage />} />
        <Route path="/split-pdf" element={<SplitPdfPage />} />
        <Route path="/compress-pdf" element={<CompressPdfPage />} />
        <Route path="/edit-pdf" element={<EditPdfPage />} />
        <Route path="/pdf-editor" element={<EditPdfPage />} />
        <Route path="/rotate-pdf" element={<RotatePdfPage />} />
        <Route path="/delete-pdf-pages" element={<DeletePdfPagesPage />} />
        <Route path="/extract-pdf-pages" element={<ExtractPdfPagesPage />} />
        <Route path="/reorder-pdf-pages" element={<ReorderPdfPagesPage />} />
        <Route path="/watermark-pdf" element={<WatermarkPdfPage />} />
        <Route path="/add-page-numbers" element={<AddPageNumbersPage />} />
        <Route path="/password-protect-pdf" element={<PasswordProtectPage />} />
        <Route path="/unlock-pdf" element={<UnlockPdfPage />} />

        {/* OCR */}
        <Route path="/ocr-pdf" element={<OcrPdfPage />} />
        <Route path="/pdf-ocr" element={<OcrPdfPage />} />
        <Route path="/scanned-pdf-to-text" element={<ScannedPdfToTextPage />} />
        <Route path="/scanned-pdf-to-word" element={<ScannedPdfToWordPage />} />
        <Route path="/scanned-pdf-to-excel" element={<ScannedPdfToExcelPage />} />

        {/* Workspace — noindex in MetaTags */}
        <Route path="/workspace" element={<WorkspacePage />} />

        {/* Learn */}
        <Route path="/learn" element={<LearnIndexPage />} />
        <Route path="/learn/how-to-convert-pdf-to-excel" element={<LearnPdfToExcelPage />} />
        <Route path="/learn/how-to-extract-tables-from-pdf" element={<LearnExtractTablesPage />} />
        <Route path="/learn/pdf-vs-scanned-pdf" element={<LearnPdfVsScannedPage />} />
        <Route path="/learn/how-ocr-works" element={<LearnHowOcrWorksPage />} />

        {/* Legal */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
