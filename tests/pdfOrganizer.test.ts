import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PDFDocument } from 'pdf-lib';
import {
  mergePDFs,
  splitPDF,
  extractPages,
  deletePages,
  reorderPages,
  rotatePages,
  addTextWatermark,
  addPageNumbers,
  compressPDF,
  imagesToPdf,
} from '@/services/pdf/pdfOrganizer';

async function createDummyPdfFile(pageCount: number, name = 'test.pdf'): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([300, 400]);
    page.drawText(`Page ${i + 1}`);
  }
  const bytes = await doc.save();
  return new File([bytes], name, { type: 'application/pdf' });
}

describe('services/pdf/pdfOrganizer', () => {
  it('merges multiple PDF files into a single document', async () => {
    const pdf1 = await createDummyPdfFile(2, 'doc1.pdf');
    const pdf2 = await createDummyPdfFile(3, 'doc2.pdf');

    let progressCount = 0;
    const mergedBlob = await mergePDFs([pdf1, pdf2], (current, total) => {
      progressCount = current;
      assert.strictEqual(total, 2);
    });

    assert.strictEqual(progressCount, 2);
    const arrayBuffer = await mergedBlob.arrayBuffer();
    const resultDoc = await PDFDocument.load(arrayBuffer);
    assert.strictEqual(resultDoc.getPageCount(), 5);
  });

  it('splits a PDF into multiple documents according to page ranges', async () => {
    const sourcePdf = await createDummyPdfFile(5, 'multipage.pdf');
    const ranges = [
      { from: 1, to: 2 },
      { from: 3, to: 5 },
    ];

    const blobs = await splitPDF(sourcePdf, ranges);
    assert.strictEqual(blobs.length, 2);

    const doc1 = await PDFDocument.load(await blobs[0].arrayBuffer());
    assert.strictEqual(doc1.getPageCount(), 2);

    const doc2 = await PDFDocument.load(await blobs[1].arrayBuffer());
    assert.strictEqual(doc2.getPageCount(), 3);
  });

  it('extracts specific requested pages from a PDF', async () => {
    const sourcePdf = await createDummyPdfFile(4, 'source.pdf');
    const extractedBlob = await extractPages(sourcePdf, [1, 4]);

    const resultDoc = await PDFDocument.load(await extractedBlob.arrayBuffer());
    assert.strictEqual(resultDoc.getPageCount(), 2);
  });

  it('deletes designated pages from a PDF', async () => {
    const sourcePdf = await createDummyPdfFile(5, 'to-delete.pdf');
    // Delete pages 2 and 4 (keeping 1, 3, 5)
    const resultBlob = await deletePages(sourcePdf, [2, 4]);

    const resultDoc = await PDFDocument.load(await resultBlob.arrayBuffer());
    assert.strictEqual(resultDoc.getPageCount(), 3);
  });

  it('reorders pages according to specified sequence', async () => {
    const sourcePdf = await createDummyPdfFile(3, 'reorder.pdf');
    // Original: 1, 2, 3 -> Reorder: 3, 1, 2
    const resultBlob = await reorderPages(sourcePdf, [3, 1, 2]);

    const resultDoc = await PDFDocument.load(await resultBlob.arrayBuffer());
    assert.strictEqual(resultDoc.getPageCount(), 3);
  });

  it('rotates pages by specified degrees', async () => {
    const sourcePdf = await createDummyPdfFile(2, 'rotate.pdf');
    // Rotate first page by 90 degrees
    const resultBlob = await rotatePages(sourcePdf, 90, [1]);

    const resultDoc = await PDFDocument.load(await resultBlob.arrayBuffer());
    const pages = resultDoc.getPages();
    assert.strictEqual(pages[0].getRotation().angle, 90);
    assert.strictEqual(pages[1].getRotation().angle, 0);
  });

  it('applies a text watermark across all pages', async () => {
    const sourcePdf = await createDummyPdfFile(2, 'watermark.pdf');
    const resultBlob = await addTextWatermark(sourcePdf, 'CONFIDENTIAL', {
      opacity: 0.5,
      fontSize: 32,
      rotation: 45,
    });

    const resultDoc = await PDFDocument.load(await resultBlob.arrayBuffer());
    assert.strictEqual(resultDoc.getPageCount(), 2);
    assert.ok(resultBlob.size > 0);
  });

  it('adds page numbers to pages at specified positions', async () => {
    const sourcePdf = await createDummyPdfFile(3, 'numbered.pdf');
    const resultBlob = await addPageNumbers(sourcePdf, {
      position: 'bottom-center',
      startFrom: 1,
      prefix: 'Page ',
    });

    const resultDoc = await PDFDocument.load(await resultBlob.arrayBuffer());
    assert.strictEqual(resultDoc.getPageCount(), 3);
  });

  it('compresses/re-saves a PDF', async () => {
    const sourcePdf = await createDummyPdfFile(2, 'compress.pdf');
    const resultBlob = await compressPDF(sourcePdf);

    const resultDoc = await PDFDocument.load(await resultBlob.arrayBuffer());
    assert.strictEqual(resultDoc.getPageCount(), 2);
  });

  it('converts PNG image files into a multi-page PDF', async () => {
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const pngBuffer = Buffer.from(pngBase64, 'base64');
    const imageFile1 = new File([pngBuffer], 'image1.png', { type: 'image/png' });
    const imageFile2 = new File([pngBuffer], 'image2.png', { type: 'image/png' });

    const pdfBlob = await imagesToPdf([imageFile1, imageFile2]);
    const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
    assert.strictEqual(pdfDoc.getPageCount(), 2);
  });
});
