import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  ALL_TOOLS,
  getFeaturedTools,
  getToolBySlug,
  getToolsByCategory,
  getRelatedTools,
} from '@/data/tools';
import { TOOL_CATEGORIES } from '@/lib/constants';

describe('data/tools (Platform Tools Registry)', () => {
  it('contains an extensive catalog of tools', () => {
    assert.ok(ALL_TOOLS.length >= 30, `Expected at least 30 tools, found ${ALL_TOOLS.length}`);
  });

  it('guarantees unique slugs across all tool definitions', () => {
    const slugs = ALL_TOOLS.map(t => t.slug);
    const uniqueSlugs = new Set(slugs);
    assert.strictEqual(slugs.length, uniqueSlugs.size, 'All tool slugs must be unique');
  });

  it('ensures every tool has valid formatting and metadata', () => {
    const validCategories = new Set(TOOL_CATEGORIES.map(c => c.id));

    for (const tool of ALL_TOOLS) {
      assert.ok(tool.slug && /^[a-z0-9-]+$/.test(tool.slug), `Invalid slug format: ${tool.slug}`);
      assert.ok(tool.name && tool.name.trim().length > 0, `Tool missing name: ${tool.slug}`);
      assert.ok(tool.description && tool.description.trim().length > 0, `Tool missing description: ${tool.slug}`);
      assert.ok(validCategories.has(tool.category), `Invalid category "${tool.category}" in tool: ${tool.slug}`);
      assert.ok(
        tool.processingMode === 'browser' || tool.processingMode === 'server',
        `Invalid processingMode "${tool.processingMode}" in tool: ${tool.slug}`
      );
      assert.ok(Array.isArray(tool.inputFormats) && tool.inputFormats.length > 0, `Missing input formats: ${tool.slug}`);
      assert.ok(Array.isArray(tool.outputFormats) && tool.outputFormats.length > 0, `Missing output formats: ${tool.slug}`);
      assert.ok(typeof tool.available === 'boolean', `Missing boolean available flag: ${tool.slug}`);
    }
  });

  describe('getFeaturedTools', () => {
    it('returns only featured tools', () => {
      const featured = getFeaturedTools();
      assert.ok(featured.length > 0);
      assert.ok(featured.length <= 8);
      for (const tool of featured) {
        assert.strictEqual(tool.featured, true);
      }
    });
  });

  describe('getToolBySlug', () => {
    it('returns correct tool definition for valid slug', () => {
      const tool = getToolBySlug('invoice-to-excel');
      assert.ok(tool);
      assert.strictEqual(tool?.slug, 'invoice-to-excel');
      assert.strictEqual(tool?.category, 'business');
      assert.strictEqual(tool?.processingMode, 'browser');
    });

    it('returns undefined for nonexistent slug', () => {
      const tool = getToolBySlug('non-existent-tool');
      assert.strictEqual(tool, undefined);
    });
  });

  describe('getToolsByCategory', () => {
    it('returns all tools belonging to a category', () => {
      const organizeTools = getToolsByCategory('organize');
      assert.ok(organizeTools.length >= 5);
      for (const tool of organizeTools) {
        assert.strictEqual(tool.category, 'organize');
      }
    });

    it('is case-insensitive and trims whitespace', () => {
      const lower = getToolsByCategory('construction');
      const upper = getToolsByCategory('  CONSTRUCTION  ');
      assert.strictEqual(lower.length, upper.length);
      assert.ok(lower.length > 0);
    });

    it('returns empty array for unknown category', () => {
      const results = getToolsByCategory('astrology');
      assert.deepStrictEqual(results, []);
    });
  });

  describe('getRelatedTools', () => {
    it('returns related tools in the same category excluding the requested tool', () => {
      const related = getRelatedTools('pdf-to-jpg');
      assert.ok(related.length > 0);
      assert.ok(related.length <= 5);
      for (const tool of related) {
        assert.strictEqual(tool.category, 'convert');
        assert.notStrictEqual(tool.slug, 'pdf-to-jpg');
      }
    });

    it('returns empty array when tool slug is not found', () => {
      const related = getRelatedTools('unknown-slug');
      assert.deepStrictEqual(related, []);
    });
  });
});
