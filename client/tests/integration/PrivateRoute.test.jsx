import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../src/context/AuthContext';
import PrivateRoute from '../../src/components/guards/PrivateRoute';

const renderWithAuth = (ctxValue, initialEntry = '/privado') =>
  render(
    <AuthContext.Provider value={ctxValue}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route
            path="/privado"
            element={
              <PrivateRoute>
                <div>contenido privado</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>página de login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe('PrivateRoute', () => {
  it('muestra un spinner mientras loading=true', () => {
    renderWithAuth({ user: null, loading: true });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirige a /login si no hay usuario', () => {
    renderWithAuth({ user: null, loading: false });
    expect(screen.getByText(/página de login/i)).toBeInTheDocument();
    expect(screen.queryByText(/contenido privado/i)).not.toBeInTheDocument();
  });

  it('renderiza el contenido si hay usuario autenticado', () => {
    renderWithAuth({ user: { id: '1', email: 'a@b.com' }, loading: false });
    expect(screen.getByText(/contenido privado/i)).toBeInTheDocument();
  });
});
