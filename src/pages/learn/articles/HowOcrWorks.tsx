import React from 'react'
import MetaTags from '@/components/seo/MetaTags'
import PageLayout from '@/components/layout/PageLayout'
import JsonLd, { buildArticleSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/components/seo/JsonLd'
import { APP_CONFIG } from '@/lib/config'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Sparkles,
  Cpu,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Lock,
  Layers,
  Zap,
  Sliders,
  BookOpen
} from 'lucide-react'

export default function HowOcrWorks() {
  const pageUrl = `${APP_CONFIG.url}/learn/how-ocr-works`

  const articleSchema = buildArticleSchema({
    title: 'How OCR Works on PDF Documents: From Pixels to Searchable Text',
    description: 'A comprehensive engineering guide to optical character recognition, binarization algorithms, neural LSTM segmentation, and in-browser WebAssembly execution.',
    url: pageUrl,
    publishedTime: '2026-09-02T08:00:00Z',
    modifiedTime: '2026-09-12T10:00:00Z',
    authorName: 'PDF Guru Engineering Team',
  })

  const faqSchema = buildFAQSchema([
    {
      question: 'What is the minimum DPI required for accurate OCR?',
      answer: 'For standard typed business documents, 300 DPI is the industry benchmark. Recognition accuracy drops significantly below 150 DPI because character serifs and loops blend together. Resolutions above 400 DPI increase processing time and memory usage without meaningful accuracy gains.',
    },
    {
      question: 'How does Tesseract.js run inside the browser without a server?',
      answer: 'Tesseract.js compiles the native C/C++ Tesseract engine into WebAssembly (WASM). It loads trained LSTM neural network language models directly into browser memory and offloads processing to dedicated Web Workers, ensuring the main UI thread never freezes.',
    },
    {
      question: 'Can browser OCR read handwritten text (ICR)?',
      answer: 'Standard open-source OCR engines like Tesseract excel at printed typography (computer-generated fonts, typewriter text). Cursive handwriting or irregular script requires Intelligent Character Recognition (ICR) models powered by specialized cloud vision models.',
    },
    {
      question: 'Is client-side OCR completely private?',
      answer: 'Yes. Because the WebAssembly binary runs locally on your computer’s CPU/GPU via the browser runtime, not a single byte of your document is sent across the network.',
    },
  ])

  const breadcrumbsSchema = buildBreadcrumbSchema([
    { name: 'Home', url: APP_CONFIG.url },
    { name: 'Learn', url: `${APP_CONFIG.url}/learn` },
    { name: 'How OCR Works', url: pageUrl },
  ])

  return (
    <PageLayout>
      <MetaTags
        title="How OCR Works on PDF Documents — Complete Technical Guide"
        description="Understand the science of Optical Character Recognition: image binarization, neural character extraction, Tesseract WebAssembly, and browser vs cloud trade-offs."
        canonical={pageUrl}
        ogType="article"
        articlePublishedTime="2026-09-02T08:00:00Z"
        articleModifiedTime="2026-09-12T10:00:00Z"
      />
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbsSchema} />

      <article className="max-w-4xl mx-auto space-y-10 py-4 sm:py-8">
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
        </Link>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
              OCR & Computer Vision
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5" /> 8 min read
            </span>
            <span className="text-xs text-zinc-400">• Published Sep 2026 • Technical Review</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            How OCR Works on PDF Documents: From Pixels to Searchable Text
          </h1>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            To a computer, a scanned PDF is nothing more than a static grid of colored pixels. Optical Character Recognition (OCR) bridges the divide between visual representation and machine-readable text. Here is the engineering behind modern neural OCR.
          </p>
        </header>

        {/* Table of Contents */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" /> In This Guide
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-brand-600 dark:text-brand-400">
            <li><a href="#the-problem" className="hover:underline">1. The Pixel-to-Text Problem</a></li>
            <li><a href="#four-phases" className="hover:underline">2. The 4 Phases of Modern OCR</a></li>
            <li><a href="#dpi-benchmarks" className="hover:underline">3. DPI & Resolution Benchmarks</a></li>
            <li><a href="#wasm-browser" className="hover:underline">4. Tesseract & WebAssembly in the Browser</a></li>
            <li><a href="#browser-vs-cloud" className="hover:underline">5. Browser OCR vs Cloud OCR APIs</a></li>
            <li><a href="#best-practices" className="hover:underline">6. Best Practices for Clean Scans</a></li>
            <li><a href="#faq" className="hover:underline">7. Frequently Asked Questions</a></li>
          </ul>
        </div>

        {/* Content Body */}
        <div className="prose dark:prose-invert max-w-none space-y-10 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <section id="the-problem" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              1. The Pixel-to-Text Problem: Scanned vs Native PDFs
            </h2>
            <p>
              When a PDF is exported directly from Microsoft Word or Google Docs, the software encodes each word as explicit unicode character codes paired with font metrics. Finding or selecting the word <code>"Invoice"</code> takes nanoseconds because the byte string <code>0x0049 0x006E 0x0076...</code> is explicitly stored inside the file structure.
            </p>
            <p>
              When a physical sheet of paper is fed through a flatbed scanner or snapped with a mobile camera, the scanner has zero understanding of letters. It records an RGB or grayscale bitmap array:
            </p>
            <div className="p-4 bg-zinc-900 text-zinc-100 rounded-xl font-mono text-xs overflow-x-auto">
              {`// What the computer actually sees in a scanned page image:
[
  [255, 255, 255, 240,  12,  12, 245, 255],
  [255, 255, 255, 230,  10,  10, 240, 255],
  [255, 255, 255, 240,  14,  14, 250, 255],
  ... 2,479 rows x 3,508 columns of integer values
]`}
            </div>
            <p>
              OCR algorithms must inspect these millions of numeric values, distinguish ink markings from background paper noise, group ink clusters into character glyphs, and predict which unicode character was intended.
            </p>
          </section>

          {/* Section 2 */}
          <section id="four-phases" className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              2. The 4 Phases of Modern Neural OCR
            </h2>
            <p>
              Modern engines like Google’s Tesseract 5 split document processing into four sequential stages:
            </p>

            <div className="space-y-4 not-prose">
              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Phase 1: Pre-Processing & Binarization
                  </span>
                  <Sliders className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-base">Cleaning the Digital Canvas</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Before analyzing typography, the engine normalizes the image. <strong>Deskew algorithms</strong> detect the dominant horizontal angle of text baselines and rotate the canvas. <strong>Otsu thresholding</strong> computes an optimal luminance cutoff, turning grayscale pixels into binary 1s (black ink) and 0s (white background). Mathematical morphology removes scanner speckles, coffee stains, and bleed-through shadows from the reverse side of thin paper.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Phase 2: Page Layout Analysis & Segmentation
                  </span>
                  <Layers className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-base">Detecting Lines, Columns, and Blocks</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Connected component analysis identifies contiguous clusters of black pixels (blobs). The engine evaluates spacing statistics to differentiate character spacing, word spaces, and paragraph breaks. It separates multi-column newspaper layouts from standard single-column legal agreements, preventing text lines across adjacent columns from being accidentally merged into a scrambled sentence.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Phase 3: Neural Character Recognition (LSTM / CNN)
                  </span>
                  <Cpu className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-base">Long Short-Term Memory (LSTM) Line Recognition</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Historical OCR attempted to isolate individual letters and match them to static font templates. Modern Tesseract 4+ treats text lines as continuous 1D visual signals. A recurrent neural network (LSTM) scans horizontally across the line slice by slice, calculating probability distributions across all known characters. The network evaluates context: whether a vertical bar is more likely an <code>'l'</code> (lowercase L), a <code>'1'</code> (one), or an <code>'I'</code> (capital i) based on preceding and following glyphs.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Phase 4: Post-Processing & Lexicon Matching
                  </span>
                  <Zap className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-base">Dictionary & Grammar Validation</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Raw neural outputs pass through linguistic filters. Words are cross-checked against comprehensive language dictionaries, common numeric patterns (dates, telephone numbers, currency formulas), and n-gram probability tables. If the model is torn 51%/49% between <code>"c0mputer"</code> and <code>"computer"</code>, the language model tips the scale to the valid dictionary token.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="dpi-benchmarks" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              3. DPI & Resolution Benchmarks: Finding the Sweet Spot
            </h2>
            <p>
              The single biggest factor affecting OCR accuracy is scan resolution, measured in <strong>DPI (Dots Per Inch)</strong>. If the DPI is too low, character counters (the inner loop of <code>'e'</code>, <code>'o'</code>, <code>'a'</code>) collapse into solid black dots. If it is too high, processing time multiplies with zero accuracy benefit.
            </p>

            <div className="overflow-x-auto not-prose my-6">
              <table className="w-full text-left text-xs sm:text-sm border-collapse border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead className="bg-zinc-100 dark:bg-zinc-800/60 font-semibold text-zinc-900 dark:text-zinc-100">
                  <tr>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Resolution</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">A4 Pixel Dimensions</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Average Accuracy</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Processing Speed</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr className="bg-red-50/50 dark:bg-red-950/20">
                    <td className="p-3 font-semibold text-red-600 dark:text-red-400">72 DPI</td>
                    <td className="p-3 font-mono text-zinc-500">595 × 842 px</td>
                    <td className="p-3 text-red-600 font-bold">50% – 65%</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">&lt; 0.5s / page</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">Avoid. Severe character merge.</td>
                  </tr>
                  <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                    <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">150 DPI</td>
                    <td className="p-3 font-mono text-zinc-500">1,240 × 1,754 px</td>
                    <td className="p-3 text-amber-600 font-bold">85% – 92%</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">~1.2s / page</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">Acceptable for large headings.</td>
                  </tr>
                  <tr className="bg-emerald-50/50 dark:bg-emerald-950/20 font-medium">
                    <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">300 DPI (Optimal)</td>
                    <td className="p-3 font-mono text-zinc-500">2,480 × 3,508 px</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">98.5% – 99.8%</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">~2.8s / page</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">Gold standard for OCR.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-700 dark:text-zinc-300">600 DPI</td>
                    <td className="p-3 font-mono text-zinc-500">4,960 × 7,016 px</td>
                    <td className="p-3 font-bold text-zinc-700 dark:text-zinc-300">99.0%</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">~11.5s / page</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">Wasteful. Bloats file sizes 4x.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section id="wasm-browser" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              4. Tesseract & WebAssembly: How In-Browser OCR Works
            </h2>
            <p>
              Until recently, high-accuracy OCR required either installing a C++ binary locally (like desktop Abbyy FineReader) or posting documents to remote cloud servers.
            </p>
            <p>
              By utilizing <strong>Emscripten</strong>, the complete C++ Tesseract codebase is compiled to a portable <code>.wasm</code> binary. When you drag a file into our platform:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li><strong>PDF Canvas Rendering:</strong> <code>pdf.js</code> renders each page into an in-memory <code>&lt;canvas&gt;</code> element at a 2.0x device pixel scale (~192–200 DPI).</li>
              <li><strong>Web Worker Delegation:</strong> The image bitmap is transferred to a dedicated background Web Worker thread via <code>postMessage</code>, guaranteeing your web browser's UI never stutters or freezes.</li>
              <li><strong>Model Streaming:</strong> Trained neural weights (such as <code>eng.traineddata</code>, ~4 MB) are cached locally in the browser's IndexedDB after the first load.</li>
              <li><strong>Zero Upload:</strong> Not a single image pixel or word leaves your device.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="browser-vs-cloud" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              5. In-Browser OCR vs Cloud OCR APIs: Honest Trade-offs
            </h2>
            <p>
              We believe in technical transparency. Here is how client-side WebAssembly OCR compares to cloud APIs like AWS Textract or Google Cloud Document AI:
            </p>

            <div className="overflow-x-auto not-prose my-6">
              <table className="w-full text-left text-xs sm:text-sm border-collapse border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead className="bg-zinc-100 dark:bg-zinc-800/60 font-semibold text-zinc-900 dark:text-zinc-100">
                  <tr>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Criteria</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">In-Browser OCR (Tesseract WASM)</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-800">Cloud APIs (AWS / Google / Azure)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-white">Privacy & Compliance</td>
                    <td className="p-3 text-emerald-600 font-bold">100% Private (No data leaves RAM)</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">Data transmitted to cloud provider servers</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-white">Standard Typed Text</td>
                    <td className="p-3 text-emerald-600 font-bold">Excellent (98%+ accuracy)</td>
                    <td className="p-3 text-emerald-600 font-bold">Excellent (99%+ accuracy)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-white">Cursive Handwriting</td>
                    <td className="p-3 text-amber-600 font-medium">Poor to Moderate</td>
                    <td className="p-3 text-emerald-600 font-bold">High (Large Transformer models)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-white">Processing Cost</td>
                    <td className="p-3 text-emerald-600 font-bold">Free (Runs on your CPU)</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">$1.50 – $15.00 per 1,000 pages</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-white">Internet Dependency</td>
                    <td className="p-3 text-emerald-600 font-bold">Works fully offline once cached</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">Requires continuous internet connection</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6 */}
          <section id="best-practices" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              6. Best Practices: How to Get 99%+ Accuracy When Scanning
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Always Scan at 300 DPI</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Select 300 DPI in your scanner hardware software. This gives neural networks sufficient pixel depth to separate punctuation marks like commas from periods.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Align Paper Against the Guide</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Skew greater than 15 degrees degrades line bounding boxes. Keep the edge of the document flush against the paper tray guide.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Use Grayscale over Color</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Unless highlighting or signatures require color review, grayscale scanning avoids chromatic aberration around thin letter strokes.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Flatten Fold Creases</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Heavy shadow lines across fold creases can be misinterpreted as hyphens or horizontal rule borders by segmentation algorithms.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="faq" className="space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              7. Frequently Asked Questions
            </h2>

            <div className="space-y-4 not-prose">
              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  What is the difference between OCR and ICR?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  OCR (Optical Character Recognition) targets printed, machine-generated fonts like Arial, Times New Roman, or Courier. ICR (Intelligent Character Recognition) is an advanced subtype specifically trained to decode varied human handwriting and cursive strokes.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  Can OCR recover text from blurry mobile camera photos?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Blurry photos suffer from perspective distortion and focal blur. Before OCR can succeed, the photo must be un-warped using homography perspective correction and contrast-boosted to sharpen blurry letter edges.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  How fast is in-browser WebAssembly OCR?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  On a modern laptop or smartphone, Tesseract WASM processes a standard 300 DPI text page in roughly 1.5 to 3.0 seconds per page, utilizing SIMD (Single Instruction, Multiple Data) CPU acceleration.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <div className="p-8 bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-zinc-900 dark:to-brand-950/30 border border-brand-200 dark:border-brand-800/40 rounded-3xl space-y-4 not-prose">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Try In-Browser OCR on Your Scanned Documents
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                  Convert scanned PDFs and paper photos into searchable text and editable tables. 100% private WebAssembly processing.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/ocr-pdf"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition"
                >
                  <Sparkles className="w-4 h-4" /> OCR PDF Online
                </Link>
                <Link
                  to="/scanned-pdf-to-text"
                  className="px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  Scanned PDF to Text
                </Link>
              </div>
            </div>
          </div>

          {/* Author Box */}
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4 not-prose">
            <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-base flex-shrink-0">
              PW
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">PDF Guru Engineering Team</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Specialists in document imaging algorithms, WebAssembly compilation, and client-side privacy architectures.
              </p>
            </div>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}
