import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../src/components/common/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renderiza un status accesible con texto "Cargando..."', () => {
    render(<LoadingSpinner />);
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent(/cargando/i);
  });
});
