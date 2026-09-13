import browserProvider from './BrowserProvider';
import backendProvider from './BackendProvider';
import externalApiProvider from './ExternalApiProvider';
import type { ConversionProvider, ProcessingMode } from '../types';

export function getProvider(mode: ProcessingMode): ConversionProvider {
  switch (mode) {
    case 'browser':
      return browserProvider;
    case 'server':
      return backendProvider;
    case 'external-api':
      return externalApiProvider;
    default:
      return browserProvider;
  }
}

export {
  browserProvider,
  backendProvider,
  externalApiProvider,
};
