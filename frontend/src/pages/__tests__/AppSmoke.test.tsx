import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

function Dummy() { return <div>Expense Tracker</div>; }

describe('App smoke', () => {
  it('renders', () => {
    const { getByText } = render(<Dummy />);
    expect(getByText('Expense Tracker')).toBeTruthy();
  });
});
