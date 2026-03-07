import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import Intro from '../intro';

jest.mock('react-responsive', () => ({
  useMediaQuery: () => false,
}));

describe('Intro', () => {
  it('renders the title', () => {
    const { getByText } = render(<Intro />);
    expect(getByText('MAX VK TATTOOS')).toBeInTheDocument();
  });

  it('renders Contact and FAQ buttons', () => {
    const { getByText } = render(<Intro />);
    expect(getByText('Contact')).toBeInTheDocument();
    expect(getByText('FAQ')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    const { getByAltText } = render(<Intro />);
    expect(getByAltText('logo')).toBeInTheDocument();
  });

  it('Contact button links to #contact', () => {
    const { getByText } = render(<Intro />);
    expect(getByText('Contact').closest('a')).toHaveAttribute('href', '#contact');
  });

  it('FAQ button links to #about', () => {
    const { getByText } = render(<Intro />);
    expect(getByText('FAQ').closest('a')).toHaveAttribute('href', '#about');
  });
});
