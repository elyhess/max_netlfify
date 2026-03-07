import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Contact from '../contact';

jest.mock('react-responsive', () => ({
  useMediaQuery: () => false,
}));

jest.mock('../../services/EmailService', () => jest.fn());

jest.mock('compressorjs', () => {
  return jest.fn();
});

describe('Contact', () => {
  it('renders the form heading', () => {
    const { getByText } = render(<Contact />);
    expect(getByText('Send A Message')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    const { getByPlaceholderText } = render(<Contact />);
    expect(getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Your Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(getByPlaceholderText(/Description/)).toBeInTheDocument();
    expect(getByPlaceholderText('Location & size')).toBeInTheDocument();
  });

  it('renders disabled submit button when form is empty', () => {
    const { getByText } = render(<Contact />);
    const button = getByText('Send Message');
    expect(button).toHaveClass('disable-button');
  });

  it('enables submit button when all fields are filled', () => {
    const { getByPlaceholderText, getAllByText } = render(<Contact />);

    fireEvent.change(getByPlaceholderText('Your Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Your Email'), { target: { value: 'john@test.com' } });
    fireEvent.change(getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(getByPlaceholderText(/Description/), { target: { value: 'A tattoo idea' } });
    fireEvent.change(getByPlaceholderText('Location & size'), { target: { value: 'Arm, medium' } });

    const buttons = getAllByText('Send Message');
    const submitButton = buttons.find(b => b.getAttribute('type') === 'submit');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveClass('btn-primary');
  });

  it('shows confirmation after submit', () => {
    const { getByPlaceholderText, getAllByText, getByText } = render(<Contact />);

    fireEvent.change(getByPlaceholderText('Your Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Your Email'), { target: { value: 'john@test.com' } });
    fireEvent.change(getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(getByPlaceholderText(/Description/), { target: { value: 'A tattoo idea' } });
    fireEvent.change(getByPlaceholderText('Location & size'), { target: { value: 'Arm, medium' } });

    const buttons = getAllByText('Send Message');
    const submitButton = buttons.find(b => b.getAttribute('type') === 'submit');
    fireEvent.click(submitButton);

    expect(getByText('Your message has been sent.')).toBeInTheDocument();
  });

  it('renders Upload Images button', () => {
    const { getByText } = render(<Contact />);
    expect(getByText('Upload Images')).toBeInTheDocument();
  });

  it('renders the sidebar info on desktop', () => {
    const { getByText } = render(<Contact />);
    expect(getByText('MAX VK TATTOOS')).toBeInTheDocument();
    expect(getByText(/Please read the FAQ/)).toBeInTheDocument();
  });
});
