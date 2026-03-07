import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@emailjs/browser', () => ({
  default: {
    sendForm: vi.fn(() => Promise.resolve({ status: 200, text: 'OK' })),
  },
}));

function buildMockForm(fields) {
  const form = document.createElement('form');
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  return { current: form };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  localStorage.clear();
});

describe('EmailService (production mode)', () => {
  it('calls emailjs.sendForm with correct parameters', async () => {
    vi.stubEnv('VITE_MOCK_EMAIL', 'false');
    vi.stubEnv('VITE_EJS_SERVICE', 'test_service');
    vi.stubEnv('VITE_EJS_TEMPLATE', 'test_template');
    vi.stubEnv('VITE_EJS_PK', 'test_pk');

    const { default: sendEmail } = await import('../EmailService.js');
    const emailjs = (await import('@emailjs/browser')).default;
    const mockForm = buildMockForm({ firstName: 'John', email: 'john@test.com' });
    sendEmail(mockForm);
    expect(emailjs.sendForm).toHaveBeenCalledWith(
      'test_service',
      'test_template',
      mockForm.current,
      'test_pk'
    );
  });
});

describe('EmailService (mock mode)', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_MOCK_EMAIL', 'true');
  });

  it('does not call emailjs.sendForm', async () => {
    const { default: sendEmail } = await import('../EmailService.js');
    const emailjs = (await import('@emailjs/browser')).default;
    const mockForm = buildMockForm({ firstName: 'John', email: 'john@test.com' });
    sendEmail(mockForm);
    expect(emailjs.sendForm).not.toHaveBeenCalled();
  });

  it('saves submission to localStorage', async () => {
    const { default: sendEmail } = await import('../EmailService.js');
    const mockForm = buildMockForm({ firstName: 'John', email: 'john@test.com', phone: '555-1234' });
    sendEmail(mockForm);

    const submissions = JSON.parse(localStorage.getItem('mock_email_submissions'));
    expect(submissions).toHaveLength(1);
    expect(submissions[0].data.firstName).toBe('John');
    expect(submissions[0].data.email).toBe('john@test.com');
    expect(submissions[0].data.phone).toBe('555-1234');
    expect(submissions[0].timestamp).toBeDefined();
  });

  it('appends to existing submissions', async () => {
    const { default: sendEmail } = await import('../EmailService.js');
    sendEmail(buildMockForm({ firstName: 'John' }));
    sendEmail(buildMockForm({ firstName: 'Jane' }));

    const submissions = JSON.parse(localStorage.getItem('mock_email_submissions'));
    expect(submissions).toHaveLength(2);
    expect(submissions[0].data.firstName).toBe('John');
    expect(submissions[1].data.firstName).toBe('Jane');
  });

  it('returns a resolved promise', async () => {
    const { default: sendEmail } = await import('../EmailService.js');
    const result = await sendEmail(buildMockForm({ firstName: 'John' }));
    expect(result.status).toBe(200);
    expect(result.text).toBe('OK (mock)');
  });
});
