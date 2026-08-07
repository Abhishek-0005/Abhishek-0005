import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('renders heading', () => {
    const { getByText } = render(<div><Dashboard /></div>);
    expect(getByText('Category Breakdown')).toBeTruthy();
  });
});
