/**
 * @jest-environment jsdom
 *
 * Testes Unitários — Painel de Métricas Operacionais (Frontend)
 * Cobre: CT-05 (Positivo) e CT-06 (Negativo)
 * Estratégia de Testes — Funcionalidade 3: Painel de Métricas Operacionais
 */

const { atualizarDados, validarMetrica } = require('../../frontend/public/script');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function montarDOM() {
  document.body.innerHTML = `
    <span id="nome"></span>
    <span id="desc"></span>
    <span id="endereco"></span>
    <span id="telefone"></span>
    <span id="email"></span>
    <span id="colaboradores"></span>
    <span id="entregas"></span>
  `;
}

const dadosValidos = {
  nome: 'Smarty Entregas',
  descricao: 'Painel simples da empresa',
  endereco: 'Guarapuava - PR',
  telefone: '(42) 99999-9999',
  email: 'contato@smarty.com',
  colaboradores: 25,
  entregasMes: 1200
};

// ─────────────────────────────────────────────────────────────────────────────
// CT-05 — Métricas exibidas corretamente com dados válidos (Positivo)
// ─────────────────────────────────────────────────────────────────────────────
describe('CT-05 — Métricas exibidas corretamente com dados válidos (Positivo)', () => {
  beforeEach(montarDOM);

  test('RN-09: card "colaboradores" exibe o valor 25', () => {
    atualizarDados(dadosValidos);
    expect(document.getElementById('colaboradores').textContent).toBe('25');
  });

  test('RN-10: card "entregas" exibe o valor 1200 (entregasMes)', () => {
    atualizarDados(dadosValidos);
    expect(document.getElementById('entregas').textContent).toBe('1200');
  });

  test('RN-11: ambos os cards de métrica são atualizados simultaneamente', () => {
    atualizarDados(dadosValidos);
    const colaboradores = document.getElementById('colaboradores').textContent;
    const entregas = document.getElementById('entregas').textContent;
    expect(colaboradores).toBe('25');
    expect(entregas).toBe('1200');
  });

  test('campos de texto da empresa são exibidos corretamente', () => {
    atualizarDados(dadosValidos);
    expect(document.getElementById('nome').textContent).toBe('Smarty Entregas');
    expect(document.getElementById('desc').textContent).toBe('Painel simples da empresa');
    expect(document.getElementById('endereco').textContent).toBe('Guarapuava - PR');
    expect(document.getElementById('telefone').textContent).toBe('(42) 99999-9999');
    expect(document.getElementById('email').textContent).toBe('contato@smarty.com');
  });

  test('validarMetrica: retorna string do número para valores positivos', () => {
    expect(validarMetrica(25)).toBe('25');
    expect(validarMetrica(1200)).toBe('1200');
    expect(validarMetrica(0)).toBe('0');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CT-06 — API retorna métricas com valores inválidos (Negativo)
// ─────────────────────────────────────────────────────────────────────────────
describe('CT-06 — API retorna métricas com valores inválidos (Negativo)', () => {
  beforeEach(montarDOM);

  test('colaboradores null exibe "N/A" — interface não quebra', () => {
    atualizarDados({ ...dadosValidos, colaboradores: null });
    expect(document.getElementById('colaboradores').textContent).toBe('N/A');
  });

  test('entregasMes negativo (-5) exibe "N/A" — valor inválido não é exposto', () => {
    atualizarDados({ ...dadosValidos, entregasMes: -5 });
    expect(document.getElementById('entregas').textContent).toBe('N/A');
  });

  test('colaboradores undefined exibe "N/A"', () => {
    atualizarDados({ ...dadosValidos, colaboradores: undefined });
    expect(document.getElementById('colaboradores').textContent).toBe('N/A');
  });

  test('entregasMes não numérico ("abc") exibe "N/A"', () => {
    atualizarDados({ ...dadosValidos, entregasMes: 'abc' });
    expect(document.getElementById('entregas').textContent).toBe('N/A');
  });

  test('ambos os campos inválidos (null e -5) exibem "N/A"', () => {
    atualizarDados({ ...dadosValidos, colaboradores: null, entregasMes: -5 });
    expect(document.getElementById('colaboradores').textContent).toBe('N/A');
    expect(document.getElementById('entregas').textContent).toBe('N/A');
  });

  test('validarMetrica: retorna "N/A" para null', () => {
    expect(validarMetrica(null)).toBe('N/A');
  });

  test('validarMetrica: retorna "N/A" para undefined', () => {
    expect(validarMetrica(undefined)).toBe('N/A');
  });

  test('validarMetrica: retorna "N/A" para número negativo', () => {
    expect(validarMetrica(-5)).toBe('N/A');
    expect(validarMetrica(-1)).toBe('N/A');
  });

  test('validarMetrica: retorna "N/A" para string não numérica', () => {
    expect(validarMetrica('abc')).toBe('N/A');
    expect(validarMetrica('')).toBe('N/A');
  });
});
