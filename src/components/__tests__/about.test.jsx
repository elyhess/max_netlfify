import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import About from '../about';

jest.mock('react-responsive', () => ({
  useMediaQuery: () => false,
}));

describe('About', () => {
  it('renders the FAQ heading', () => {
    const { getByText } = render(<About />);
    expect(getByText('FAQ')).toBeInTheDocument();
  });

  it('renders all 6 FAQ questions', () => {
    const { container } = render(<About />);
    const questions = container.querySelectorAll('.faq-q');
    // Each Q&A has a "Q:" div and an "A:" span = 12 total
    expect(questions.length).toBe(12);
  });

  it('renders first question text', () => {
    const { getByText } = render(<About />);
    expect(getByText(/How do I get tattooed by you/)).toBeInTheDocument();
  });

  it('renders the logo image on desktop', () => {
    const { getByAltText } = render(<About />);
    expect(getByAltText('logo')).toBeInTheDocument();
  });
});
