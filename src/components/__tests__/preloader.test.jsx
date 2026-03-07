import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

jest.mock('jquery', () => {
  const m = jest.fn(() => m);
  m.on = jest.fn();
  return m;
});

import Preloader from '../preloader';

describe('Preloader', () => {
  it('renders a div with id preloader', () => {
    const { container } = render(<Preloader />);
    const preloader = container.querySelector('#preloader');
    expect(preloader).toBeInTheDocument();
  });
});
