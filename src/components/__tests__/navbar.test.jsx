import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

jest.mock('jquery', () => {
  const m = jest.fn(() => m);
  m.scrollspy = jest.fn();
  m.on = jest.fn();
  m.outerHeight = jest.fn(() => 50);
  return m;
});

import Navbar from '../navbar';

describe('Navbar', () => {
  it('renders a nav element with id mainNav', () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector('nav#mainNav');
    expect(nav).toBeInTheDocument();
  });
});
