import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, File as FileIcon, X, Download, Shield, Scissors } from 'lucide-react';
import { splitPDF, PageRange } from '@/services/pdf/pdfOrganizer';

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rangeInput, setRangeInput] = useState('1-2, 3-5');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobs, setResultBlobs] = useState<Blob[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResultBlobs([]);
    }
  };

  const parseRanges = (input: string): PageRange[] => {
    return input.split(',').map(part => {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [from, to] = trimmed.split('-').map(n => parseInt(n.trim(), 10));
        return { from, to };
      }
      const num = parseInt(trimmed, 10);
      return { from: num, to: num };
    }).filter(r => !isNaN(r.from) && !isNaN(r.to));
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResultBlobs([]);
    try {
      const ranges = parseRanges(rangeInput);
      const results = await splitPDF(file, ranges);
      setResultBlobs(results);
    } catch (error) {
      console.error(error);
      alert('Failed to split PDF. Please check your ranges and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setResultBlobs([]);
    setRangeInput('1-2, 3-5');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-sm text-gray-500 flex items-center space-x-2">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>&gt;</span>
        <span>Organize PDF</span>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium">Split PDF</span>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Split PDF — Separate PDF Pages into Multiple Files</h1>
        <p className="text-lg text-gray-600">
          Break a large PDF into smaller files. Split by individual pages or define custom ranges. Free, browser-based, no upload required.
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
          <Shield className="w-4 h-4 mr-2" />
          Browser Processing
        </div>
      </div>

      {!resultBlobs.length && !isProcessing && (
        <div className="space-y-6">
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">Select a PDF to split</p>
              </div>
              <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 truncate">
                  <FileIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span className="font-medium text-gray-900 truncate">{file.name}</span>
                </div>
                <button onClick={() => setFile(null)} className="p-2 text-gray-400 hover:text-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Custom Page Ranges
                </label>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 1-5, 6-10, 11"
                />
                <p className="text-xs text-gray-500">
                  Enter ranges separated by commas. E.g. '1-3, 4-6, 7-12' produces 3 PDFs.
                </p>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Preview</h4>
                  <ul className="text-sm text-blue-800 list-disc list-inside">
                    {parseRanges(rangeInput).map((r, i) => (
                      <li key={i}>Part {i + 1}: pages {r.from} to {r.to}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSplit}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Scissors className="w-5 h-5 mr-2" />
                  Split PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">Splitting your PDF...</h3>
          <p className="text-sm text-gray-500">Please wait while we process your document.</p>
        </div>
      )}

      {resultBlobs.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-green-200 p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <Scissors className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Split Complete!</h3>
          
          <div className="max-w-md mx-auto space-y-3">
            {resultBlobs.map((blob, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Part {idx + 1}</span>
                <button
                  onClick={() => downloadBlob(blob, `split-part-${idx + 1}.pdf`)}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
                >
                  <Download className="w-4 h-4 mr-1" /> Download
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={reset}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
            >
              Split another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
