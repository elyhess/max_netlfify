import React from 'react';
import { render } from '@testing-library/react';
import BackToTop from '../back-top';

describe('BackToTop', () => {
  it('renders a back-to-top button', () => {
    const { container } = render(<BackToTop />);
    const button = container.querySelector('button.back-to-top');
    expect(button).toBeInTheDocument();
  });

  it('renders with an SVG chevron icon', () => {
    const { container } = render(<BackToTop />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
