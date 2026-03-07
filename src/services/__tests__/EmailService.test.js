jest.mock('emailjs-com', () => ({
  sendForm: jest.fn(() => Promise.resolve({ status: 200, text: 'OK' })),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  localStorage.clear();
  process.env.REACT_APP_EJS_SERVICE = 'test_service';
  process.env.REACT_APP_EJS_TEMPLATE = 'test_template';
  process.env.REACT_APP_EJS_PK = 'test_pk';
});

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

describe('EmailService (production mode)', () => {
  it('calls emailjs.sendForm with correct parameters', () => {
    process.env.REACT_APP_MOCK_EMAIL = 'false';
    const sendEmail = require('../EmailService').default;
    const emailjs = require('emailjs-com');
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
  it('does not call emailjs.sendForm', () => {
    process.env.REACT_APP_MOCK_EMAIL = 'true';
    const sendEmail = require('../EmailService').default;
    const emailjs = require('emailjs-com');
    const mockForm = buildMockForm({ firstName: 'John', email: 'john@test.com' });
    sendEmail(mockForm);
    expect(emailjs.sendForm).not.toHaveBeenCalled();
  });

  it('saves submission to localStorage', () => {
    process.env.REACT_APP_MOCK_EMAIL = 'true';
    const sendEmail = require('../EmailService').default;
    const mockForm = buildMockForm({ firstName: 'John', email: 'john@test.com', phone: '555-1234' });
    sendEmail(mockForm);

    const submissions = JSON.parse(localStorage.getItem('mock_email_submissions'));
    expect(submissions).toHaveLength(1);
    expect(submissions[0].data.firstName).toBe('John');
    expect(submissions[0].data.email).toBe('john@test.com');
    expect(submissions[0].data.phone).toBe('555-1234');
    expect(submissions[0].timestamp).toBeDefined();
  });

  it('appends to existing submissions', () => {
    process.env.REACT_APP_MOCK_EMAIL = 'true';
    const sendEmail = require('../EmailService').default;
    sendEmail(buildMockForm({ firstName: 'John' }));
    sendEmail(buildMockForm({ firstName: 'Jane' }));

    const submissions = JSON.parse(localStorage.getItem('mock_email_submissions'));
    expect(submissions).toHaveLength(2);
    expect(submissions[0].data.firstName).toBe('John');
    expect(submissions[1].data.firstName).toBe('Jane');
  });

  it('returns a resolved promise', async () => {
    process.env.REACT_APP_MOCK_EMAIL = 'true';
    const sendEmail = require('../EmailService').default;
    const result = await sendEmail(buildMockForm({ firstName: 'John' }));
    expect(result.status).toBe(200);
    expect(result.text).toBe('OK (mock)');
  });
});
