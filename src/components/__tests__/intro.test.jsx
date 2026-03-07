import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import Intro from '../intro';

describe('Intro', () => {
  it('renders the title', () => {
    const { getByText } = render(<Intro />);
    expect(getByText('MAX VK TATTOOS')).toBeInTheDocument();
  });

  it('renders Book Now and View Work buttons', () => {
    const { getByText } = render(<Intro />);
    expect(getByText('Book Now')).toBeInTheDocument();
    expect(getByText('View Work')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    const { getByAltText } = render(<Intro />);
    expect(getByAltText('logo')).toBeInTheDocument();
  });

  it('Book Now button links to #contact', () => {
    const { getByText } = render(<Intro />);
    expect(getByText('Book Now').closest('a')).toHaveAttribute('href', '#contact');
  });

  it('View Work button links to #gallery', () => {
    const { getByText } = render(<Intro />);
    expect(getByText('View Work').closest('a')).toHaveAttribute('href', '#gallery');
  });
});
