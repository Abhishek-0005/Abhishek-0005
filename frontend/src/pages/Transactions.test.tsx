import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Transactions from './Transactions';

describe('Transactions', () => {
  it('renders', () => {
    const { container } = render(<div><Transactions /></div>);
    expect(container).toBeTruthy();
  });
});
