import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

jest.mock('jquery', () => {
  const m = jest.fn(() => m);
  m.click = jest.fn();
  m.animate = jest.fn();
  return m;
});

jest.mock('../../libs/easing.js', () => {});

import BackToTop from '../back-top';

describe('BackToTop', () => {
  it('renders a back-to-top link', () => {
    const { container } = render(<BackToTop />);
    const link = container.querySelector('.back-to-top');
    expect(link).toBeInTheDocument();
  });

  it('renders with an up chevron icon', () => {
    const { container } = render(<BackToTop />);
    const icon = container.querySelector('.fa-chevron-up');
    expect(icon).toBeInTheDocument();
  });
});
