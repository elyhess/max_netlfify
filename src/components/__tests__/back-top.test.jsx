import React from 'react';
import { render } from '@testing-library/react';
import BackToTop from '../back-top';

describe('BackToTop', () => {
  it('renders a back-to-top link', () => {
    const { container } = render(<BackToTop />);
    const link = container.querySelector('.back-to-top');
    expect(link).toBeInTheDocument();
  });

  it('renders with an SVG chevron icon', () => {
    const { container } = render(<BackToTop />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
