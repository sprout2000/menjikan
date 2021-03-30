import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { App } from '../src/App';

describe('App component', () => {
  test('render App', () => {
    render(<App />);
    screen.debug();
  });
});
