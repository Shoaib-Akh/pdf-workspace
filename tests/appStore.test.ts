import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { useAppStore } from '@/store/appStore';

describe('store/appStore (Zustand Global State)', () => {
  beforeEach(() => {
    useAppStore.getState().reset();
  });

  it('initializes with default idle state', () => {
    const state = useAppStore.getState();
    assert.strictEqual(state.currentFile, null);
    assert.strictEqual(state.processingState, 'idle');
    assert.strictEqual(state.processingStage, '');
    assert.strictEqual(state.processingProgress, 0);
    assert.strictEqual(state.error, null);
  });

  it('updates current file when setCurrentFile is called', () => {
    const file = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
    useAppStore.getState().setCurrentFile(file);

    const state = useAppStore.getState();
    assert.strictEqual(state.currentFile?.name, 'document.pdf');

    useAppStore.getState().setCurrentFile(null);
    assert.strictEqual(useAppStore.getState().currentFile, null);
  });

  it('updates processing state and progress lifecycle', () => {
    useAppStore.getState().setProcessingState('processing');
    useAppStore.getState().setProcessingStage('Extracting tables...');
    useAppStore.getState().setProcessingProgress(65);

    let state = useAppStore.getState();
    assert.strictEqual(state.processingState, 'processing');
    assert.strictEqual(state.processingStage, 'Extracting tables...');
    assert.strictEqual(state.processingProgress, 65);

    useAppStore.getState().setProcessingState('success');
    useAppStore.getState().setProcessingProgress(100);

    state = useAppStore.getState();
    assert.strictEqual(state.processingState, 'success');
    assert.strictEqual(state.processingProgress, 100);
  });

  it('records and clears error states', () => {
    useAppStore.getState().setError('Password required to decrypt');
    assert.strictEqual(useAppStore.getState().error, 'Password required to decrypt');

    useAppStore.getState().setError(null);
    assert.strictEqual(useAppStore.getState().error, null);
  });

  it('tracks recent tools without duplicates and caps at 5', () => {
    const store = useAppStore.getState();
    store.addRecentTool('pdf-to-jpg');
    store.addRecentTool('merge-pdf');
    store.addRecentTool('split-pdf');
    store.addRecentTool('invoice-to-excel');
    store.addRecentTool('boq-extractor');

    let tools = useAppStore.getState().recentTools;
    assert.deepStrictEqual(tools, [
      'boq-extractor',
      'invoice-to-excel',
      'split-pdf',
      'merge-pdf',
      'pdf-to-jpg',
    ]);

    // Adding an existing tool brings it to the front
    useAppStore.getState().addRecentTool('merge-pdf');
    tools = useAppStore.getState().recentTools;
    assert.strictEqual(tools[0], 'merge-pdf');
    assert.strictEqual(tools.length, 5);

    // Adding a 6th unique tool drops the oldest
    useAppStore.getState().addRecentTool('rotate-pdf');
    tools = useAppStore.getState().recentTools;
    assert.strictEqual(tools[0], 'rotate-pdf');
    assert.strictEqual(tools.length, 5);
    assert.ok(!tools.includes('pdf-to-jpg'));
  });

  it('resets all processing and file states on reset()', () => {
    const file = new File(['data'], 'invoice.pdf');
    useAppStore.getState().setCurrentFile(file);
    useAppStore.getState().setProcessingState('error');
    useAppStore.getState().setError('Corrupted file');
    useAppStore.getState().setProcessingProgress(40);

    useAppStore.getState().reset();

    const state = useAppStore.getState();
    assert.strictEqual(state.currentFile, null);
    assert.strictEqual(state.processingState, 'idle');
    assert.strictEqual(state.processingProgress, 0);
    assert.strictEqual(state.error, null);
  });
});
