import { ConversionProvider, ConversionJob, ConversionResult } from '../types';

class BackendProvider implements ConversionProvider {
  name = 'backend';

  async isAvailable(): Promise<boolean> {
    return !!import.meta.env.VITE_BACKEND_URL;
  }

  async convert(job: ConversionJob): Promise<ConversionResult> {
    return {
      success: false,
      error: 'Backend processing not yet available.',
    };
  }
}

export default new BackendProvider();
