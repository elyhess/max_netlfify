import { vi, describe, it, expect, beforeEach } from 'vitest';

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  globalThis.fetch = vi.fn();
});

describe('sendInquiry', () => {
  it('POSTs JSON to /api/inquiry', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const { default: sendInquiry } = await import('../EmailService.js');
    const payload = {
      firstName: 'John',
      email: 'john@test.com',
      phone: '555-1234',
      description: 'A tattoo idea',
      location: 'Arm',
      references: [],
    };

    await sendInquiry(payload);

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });

  it('returns parsed JSON on success', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const { default: sendInquiry } = await import('../EmailService.js');
    const result = await sendInquiry({ firstName: 'John', email: '', phone: '', description: '', location: '', references: [] });
    expect(result.success).toBe(true);
  });

  it('throws when the server returns an error', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Email delivery is not configured.' }),
    });

    const { default: sendInquiry } = await import('../EmailService.js');

    await expect(
      sendInquiry({ firstName: 'John', email: 'john@test.com', phone: '', description: '', location: '', references: [] })
    ).rejects.toThrow('Email delivery is not configured.');
  });

  it('throws a generic message when error response is not JSON', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.reject(new Error('not json')),
    });

    const { default: sendInquiry } = await import('../EmailService.js');

    await expect(
      sendInquiry({ firstName: 'John', email: '', phone: '', description: '', location: '', references: [] })
    ).rejects.toThrow('Failed to send inquiry.');
  });
});
