import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, File as FileIcon, X, ArrowUp, ArrowDown, Download, Layers, Shield, FileText } from 'lucide-react';
import { mergePDFs } from '@/services/pdf/pdfOrganizer';

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setResultBlob(null);
    try {
      const result = await mergePDFs(files, (current, total) => {
        setProgress({ current, total });
      });
      setResultBlob(result);
    } catch (error) {
      console.error(error);
      alert('Failed to merge PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged-document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFiles([]);
    setResultBlob(null);
    setProgress({ current: 0, total: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-sm text-gray-500 flex items-center space-x-2">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>&gt;</span>
        <span>Organize PDF</span>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium">Merge PDF</span>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Merge PDF Files — Combine Multiple PDFs into One</h1>
        <p className="text-lg text-gray-600">
          Got multiple PDFs that belong together? This tool combines them into a single PDF file. Drag your files into any order before merging. Everything runs in your browser — your documents are never sent to a server.
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
          <Shield className="w-4 h-4 mr-2" />
          Browser Processing
        </div>
      </div>

      {!resultBlob && !isProcessing && (
        <div className="space-y-6">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">PDF files only</p>
            </div>
            <input type="file" className="hidden" multiple accept="application/pdf" onChange={handleFileChange} />
          </label>

          {files.length > 0 && (
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Files to merge ({files.length})</h3>
                <p className="text-sm text-gray-500">
                  Total size: {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-3 truncate">
                      <FileIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveDown(idx)} disabled={idx === files.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeFile(idx)} className="p-1 text-red-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-gray-50 flex justify-end">
                <button
                  onClick={handleMerge}
                  disabled={files.length < 2}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
                >
                  <Layers className="w-5 h-5 mr-2" />
                  Merge PDFs
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">
            {progress.total > 0 ? `Merging page ${progress.current} of ${progress.total}...` : 'Loading files...'}
          </h3>
          <p className="text-sm text-gray-500">Please wait while we process your documents in your browser.</p>
        </div>
      )}

      {resultBlob && (
        <div className="bg-white rounded-lg shadow border border-green-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Merge Complete!</h3>
            <p className="text-gray-500 mt-2">
              merged-document.pdf ({(resultBlob.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Merged PDF
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 border border-gray-300"
            >
              Merge another
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8 border-t border-gray-200 pt-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">How it works</h3>
            <ol className="space-y-4 list-decimal list-inside text-gray-600">
              <li>Upload two or more PDF files.</li>
              <li>Drag and drop the files to rearrange them in the correct order.</li>
              <li>Click "Merge PDFs" to combine them and download the result.</li>
            </ol>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              100% Private & Secure
            </h3>
            <p className="text-green-800 text-sm">
              Your files are processed directly in your web browser. They are never uploaded to any server, keeping your sensitive data completely private.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">How many PDFs can I merge?</h4>
              <p className="text-gray-600 text-sm">As many as your browser memory allows, usually up to ~500MB total.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Can I reorder pages after merging?</h4>
              <p className="text-gray-600 text-sm">Yes, you can use our Reorder Pages tool after merging.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Will bookmarks be preserved?</h4>
              <p className="text-gray-600 text-sm">Basic structure is preserved, but complex interactive elements may not be.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Is there a page limit?</h4>
              <p className="text-gray-600 text-sm">There is no strict page limit, only your device's memory limit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
