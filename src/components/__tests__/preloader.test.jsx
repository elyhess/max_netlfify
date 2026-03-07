import React from 'react';
import { render } from '@testing-library/react';
import Preloader from '../preloader';

describe('Preloader', () => {
  it('renders a div with id preloader', () => {
    const { container } = render(<Preloader />);
    const preloader = container.querySelector('#preloader');
    expect(preloader).toBeInTheDocument();
  });
});
