import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Reports from './Reports';

describe('Reports', () => {
  it('renders', () => {
    const { container } = render(<div><Reports /></div>);
    expect(container).toBeTruthy();
  });
});
