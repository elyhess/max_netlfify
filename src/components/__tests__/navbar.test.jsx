import React from 'react';
import { render } from '@testing-library/react';
import Navbar from '../navbar';

describe('Navbar', () => {
  it('renders a nav element with id mainNav', () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector('nav#mainNav');
    expect(nav).toBeInTheDocument();
  });
});
