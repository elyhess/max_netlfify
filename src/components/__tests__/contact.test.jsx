import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Contact from '../contact';

vi.mock('../../services/EmailService', () => ({
  default: vi.fn(() => Promise.resolve({ success: true })),
}));

vi.mock('../../services/imageCompressor', () => ({
  processUploadedFiles: vi.fn(() => Promise.resolve({ files: [], rejected: [] })),
  prepareAttachments: vi.fn(() => Promise.resolve({ references: [], totalBytes: 0 })),
}));

describe('Contact', () => {
  it('renders the form heading', () => {
    const { getByText } = render(<Contact />);
    expect(getByText('Get In Touch')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    const { getByPlaceholderText } = render(<Contact />);
    expect(getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Your Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(getByPlaceholderText(/Description/)).toBeInTheDocument();
    expect(getByPlaceholderText(/Placement/)).toBeInTheDocument();
  });

  it('renders disabled submit button when form is empty', () => {
    const { getByText } = render(<Contact />);
    const button = getByText('Send Message');
    expect(button).toHaveClass('btn-disabled');
  });

  it('enables submit button when all fields are filled', () => {
    const { getByPlaceholderText, getByText } = render(<Contact />);

    fireEvent.change(getByPlaceholderText('Your Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Your Email'), { target: { value: 'john@test.com' } });
    fireEvent.change(getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(getByPlaceholderText(/Description/), { target: { value: 'A tattoo idea' } });
    fireEvent.change(getByPlaceholderText(/Placement/), { target: { value: 'Arm, medium' } });

    const submitButton = getByText('Send Message');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toHaveClass('btn-disabled');
  });

  it('shows confirmation after submit', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<Contact />);

    fireEvent.change(getByPlaceholderText('Your Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Your Email'), { target: { value: 'john@test.com' } });
    fireEvent.change(getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(getByPlaceholderText(/Description/), { target: { value: 'A tattoo idea' } });
    fireEvent.change(getByPlaceholderText(/Placement/), { target: { value: 'Arm, medium' } });

    fireEvent.click(getByText('Send Message'));

    expect(await findByText('Message Sent!')).toBeInTheDocument();
  });

  it('renders Upload Reference Images button', () => {
    const { getByText } = render(<Contact />);
    expect(getByText('Upload Reference Images')).toBeInTheDocument();
  });

  it('renders the sidebar info on desktop', () => {
    const { getByText } = render(<Contact />);
    expect(getByText('MAX VK TATTOOS')).toBeInTheDocument();
    expect(getByText(/Please read the FAQ/)).toBeInTheDocument();
  });
});
