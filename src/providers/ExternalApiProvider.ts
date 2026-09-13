import type { ConversionProvider, ConversionJob, ConversionResult } from '../types';

export class ExternalApiProvider implements ConversionProvider {
  name = 'external-api';

  async isAvailable(): Promise<boolean> {
    return !!import.meta.env.VITE_OCR_API_KEY || !!import.meta.env.VITE_EXTERNAL_API_URL;
  }

  async convert(job: ConversionJob): Promise<ConversionResult> {
    const isReady = await this.isAvailable();
    if (!isReady) {
      return {
        success: false,
        error: 'External API integration requires an active API key or service URL. Please configure VITE_OCR_API_KEY in your environment.',
      };
    }

    try {
      const endpoint = (import.meta.env.VITE_EXTERNAL_API_URL as string) || '/api/convert';
      const formData = new FormData();
      formData.append('file', job.inputFile);
      formData.append('outputFormat', job.outputFormat);
      if (job.options) {
        formData.append('options', JSON.stringify(job.options));
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OCR_API_KEY || ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `External API returned status ${response.status}`);
      }

      const blob = await response.blob();
      return {
        success: true,
        blob,
        fileName: `${job.inputFile.name.replace(/\.pdf$/i, '')}.${job.outputFormat}`,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'External API conversion failed.',
      };
    }
  }
}

export default new ExternalApiProvider();
