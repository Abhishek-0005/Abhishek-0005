import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Categories from './Categories';

describe('Categories', () => {
  it('renders', () => {
    const { container } = render(<div><Categories /></div>);
    expect(container).toBeTruthy();
  });
});
