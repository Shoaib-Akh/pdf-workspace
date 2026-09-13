import { ConversionProvider, ConversionJob, ConversionResult } from '../types';

class BrowserProvider implements ConversionProvider {
  name = 'browser';

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async convert(job: ConversionJob): Promise<ConversionResult> {
    return {
      success: false,
      error: 'Use specific browser service functions',
    };
  }
}

export default new BrowserProvider();
