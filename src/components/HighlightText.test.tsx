import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HighlightText } from './HighlightText';

describe('HighlightText', () => {
  it('renderiza o texto sem alteracao quando nao ha destaque', () => {
    render(<HighlightText text="Missao Impossivel" />);
    expect(screen.getByText('Missao Impossivel')).toBeInTheDocument();
    expect(document.querySelector('mark')).toBeNull();
  });

  it('destaca ocorrencias do termo case-insensitive', () => {
    render(<HighlightText text="Grande Aventura no Espaco" highlight="aventura" />);
    const marks = document.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent('Aventura');
  });

  it('destaca multiplas ocorrencias', () => {
    render(<HighlightText text="Aventura na Grande Aventura" highlight="aventura" />);
    const marks = document.querySelectorAll('mark');
    expect(marks).toHaveLength(2);
  });

  it('escapa caracteres especiais no termo (nao quebra regex)', () => {
    render(<HighlightText text="Star Wars: A New Hope (1977)" highlight="(1977)" />);
    const marks = document.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent('(1977)');
  });
});
