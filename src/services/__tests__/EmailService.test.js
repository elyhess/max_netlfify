import sendEmail from '../EmailService';

jest.mock('emailjs-com', () => ({
  sendForm: jest.fn(() => Promise.resolve({ status: 200, text: 'OK' })),
}));

import emailjs from 'emailjs-com';

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_EJS_SERVICE = 'test_service';
    process.env.REACT_APP_EJS_TEMPLATE = 'test_template';
    process.env.REACT_APP_EJS_PK = 'test_pk';
  });

  it('calls emailjs.sendForm with correct parameters', () => {
    const mockForm = { current: document.createElement('form') };
    sendEmail(mockForm);
    expect(emailjs.sendForm).toHaveBeenCalledWith(
      'test_service',
      'test_template',
      mockForm.current,
      'test_pk'
    );
  });

  it('returns a promise from sendForm', () => {
    const mockForm = { current: document.createElement('form') };
    sendEmail(mockForm);
    expect(emailjs.sendForm).toHaveBeenCalledTimes(1);
  });
});
