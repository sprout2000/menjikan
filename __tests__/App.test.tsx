import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { App } from '../src/App';

describe('App component', () => {
  test('render App', () => {
    const { getByRole } = render(<App />);

    expect(getByRole('img')).toHaveAttribute('src');
    expect(getByRole('heading')).toHaveTextContent('03:00');
    expect(getByRole('slider')).toBeVisible();
    expect(getByRole('button')).toBeVisible();
  });
});
