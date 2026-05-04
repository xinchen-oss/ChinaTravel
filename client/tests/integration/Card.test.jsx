import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Card from '../../src/components/common/Card';

describe('Card', () => {
  it('renderiza título, subtítulo, badge y children', () => {
    render(
      <MemoryRouter>
        <Card title="Pekín" subtitle="Capital" badge="Destacada">
          <p>Contenido extra</p>
        </Card>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Pekín' })).toBeInTheDocument();
    expect(screen.getByText('Capital')).toBeInTheDocument();
    expect(screen.getByText('Destacada')).toBeInTheDocument();
    expect(screen.getByText('Contenido extra')).toBeInTheDocument();
  });

  it('renderiza un Link cuando se pasa la prop "to"', () => {
    render(
      <MemoryRouter>
        <Card to="/ciudades/pekin" title="Pekín" />
      </MemoryRouter>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/ciudades/pekin');
  });

  it('renderiza un div (no link) cuando no se pasa "to"', () => {
    render(
      <MemoryRouter>
        <Card title="Sin link" />
      </MemoryRouter>
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('usa el alt = title en la imagen', () => {
    render(
      <MemoryRouter>
        <Card title="Cantón" image="https://x.com/a.jpg" />
      </MemoryRouter>
    );
    const img = screen.getByRole('img', { name: 'Cantón' });
    expect(img).toHaveAttribute('src', 'https://x.com/a.jpg');
  });
});
