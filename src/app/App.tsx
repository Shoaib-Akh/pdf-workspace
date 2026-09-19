import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

// Eager-loaded: homepage, tools directory, static pages
import HomePage from '@/pages/home/HomePage'
import ToolsPage from '@/pages/tools/ToolsPage'
import NotFoundPage from '@/pages/NotFoundPage'

// Lazy-loaded: secondary and hub pages
const PricingPage = lazy(() => import('@/pages/pricing/PricingPage'))
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

const BusinessToolsPage = lazy(() => import('@/pages/business/BusinessToolsPage'))
const InvoiceToExcelPage = lazy(() => import('@/pages/business/InvoiceToExcelPage'))
const QuotationToExcelPage = lazy(() => import('@/pages/business/QuotationToExcelPage'))
const ReceiptToExcelPage = lazy(() => import('@/pages/business/ReceiptToExcelPage'))
const BankStatementToExcelPage = lazy(() => import('@/pages/business/BankStatementToExcelPage'))
const BoqPdfToExcelPage = lazy(() => import('@/pages/business/BoqPdfToExcelPage'))
const TenderPdfToExcelPage = lazy(() => import('@/pages/business/TenderPdfToExcelPage'))
const PurchaseOrderToExcelPage = lazy(() => import('@/pages/business/PurchaseOrderToExcelPage'))
const ExpenseReportToExcelPage = lazy(() => import('@/pages/business/ExpenseReportToExcelPage'))
const PriceListToExcelPage = lazy(() => import('@/pages/business/PriceListToExcelPage'))

const ConstructionPdfPage = lazy(() => import('@/pages/business/ConstructionPdfPage'))
const QuantitySurveyPage = lazy(() => import('@/pages/business/QuantitySurveyPage'))
const EstimatePdfPage = lazy(() => import('@/pages/business/EstimatePdfPage'))
const BillOfQuantitiesPage = lazy(() => import('@/pages/business/BillOfQuantitiesPage'))
const BoqExtractorPage = lazy(() => import('@/pages/business/BoqExtractorPage'))

const WorkspacePage = lazy(() => import('@/pages/workspace/WorkspacePage'))

const LearnIndexPage = lazy(() => import('@/pages/learn/LearnIndexPage'))
const LearnPdfToExcelPage = lazy(() => import('@/pages/learn/articles/HowToConvertPdfToExcel'))
const LearnExtractTablesPage = lazy(() => import('@/pages/learn/articles/HowToExtractTablesFromPdf'))
const LearnBoqToExcelPage = lazy(() => import('@/pages/learn/articles/HowToConvertBoqPdfToExcel'))
const LearnPdfVsScannedPage = lazy(() => import('@/pages/learn/articles/PdfVsScannedPdf'))
const LearnHowOcrWorksPage = lazy(() => import('@/pages/learn/articles/HowOcrWorks'))
const LearnInvoiceDataPage = lazy(() => import('@/pages/learn/articles/HowToExtractInvoiceData'))
const LearnBankStatementPage = lazy(() => import('@/pages/learn/articles/HowToConvertBankStatement'))

const PrivacyPolicyPage = lazy(() => import('@/pages/legal/PrivacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('@/pages/legal/TermsOfServicePage'))

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
        <Route path="/business" element={<ToolsPage initialCategory="Business" />} />
        <Route path="/ocr" element={<ToolsPage initialCategory="OCR" />} />
        <Route path="/construction" element={<ToolsPage initialCategory="Construction" />} />
        <Route path="/images" element={<ToolsPage initialCategory="Images" />} />
        <Route path="/security" element={<ToolsPage initialCategory="Security" />} />

        {/* Pricing, Contact, Auth */}
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

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

        {/* Business */}
        <Route path="/business-pdf-tools" element={<BusinessToolsPage />} />
        <Route path="/invoice-to-excel" element={<InvoiceToExcelPage />} />
        <Route path="/quotation-to-excel" element={<QuotationToExcelPage />} />
        <Route path="/receipt-to-excel" element={<ReceiptToExcelPage />} />
        <Route path="/bank-statement-to-excel" element={<BankStatementToExcelPage />} />
        <Route path="/boq-pdf-to-excel" element={<BoqPdfToExcelPage />} />
        <Route path="/tender-pdf-to-excel" element={<TenderPdfToExcelPage />} />
        <Route path="/purchase-order-to-excel" element={<PurchaseOrderToExcelPage />} />
        <Route path="/expense-report-to-excel" element={<ExpenseReportToExcelPage />} />
        <Route path="/price-list-pdf-to-excel" element={<PriceListToExcelPage />} />

        {/* Construction */}
        <Route path="/construction-pdf-to-excel" element={<ConstructionPdfPage />} />
        <Route path="/quantity-survey-pdf-to-excel" element={<QuantitySurveyPage />} />
        <Route path="/estimate-pdf-to-excel" element={<EstimatePdfPage />} />
        <Route path="/bill-of-quantities-to-excel" element={<BillOfQuantitiesPage />} />
        <Route path="/boq-extractor" element={<BoqExtractorPage />} />
        <Route path="/boq-to-excel" element={<BoqPdfToExcelPage />} />

        {/* Workspace — noindex in MetaTags */}
        <Route path="/workspace" element={<WorkspacePage />} />

        {/* Learn */}
        <Route path="/learn" element={<LearnIndexPage />} />
        <Route path="/learn/how-to-convert-pdf-to-excel" element={<LearnPdfToExcelPage />} />
        <Route path="/learn/how-to-extract-tables-from-pdf" element={<LearnExtractTablesPage />} />
        <Route path="/learn/how-to-convert-boq-pdf-to-excel" element={<LearnBoqToExcelPage />} />
        <Route path="/learn/pdf-vs-scanned-pdf" element={<LearnPdfVsScannedPage />} />
        <Route path="/learn/how-ocr-works" element={<LearnHowOcrWorksPage />} />
        <Route path="/learn/how-to-extract-invoice-data-from-pdf" element={<LearnInvoiceDataPage />} />
        <Route path="/learn/how-to-extract-invoice-data" element={<LearnInvoiceDataPage />} />
        <Route path="/learn/how-to-convert-bank-statement-pdf-to-excel" element={<LearnBankStatementPage />} />
        <Route path="/learn/how-to-convert-bank-statement" element={<LearnBankStatementPage />} />

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
