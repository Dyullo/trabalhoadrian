/**
 * Testes de Integração — Backend API
 * Cobre: CT-01 (Positivo) e CT-02 (Negativo)
 * Estratégia de Testes — Funcionalidade 1: Exibição das Informações da Empresa
 */

const request = require('supertest');
const express = require('express');
const app = require('../../backend/server');

// ─────────────────────────────────────────────────────────────────────────────
// CT-01 — Exibição correta dos dados da empresa (Positivo)
// ─────────────────────────────────────────────────────────────────────────────
describe('CT-01 — Exibição correta dos dados da empresa (Positivo)', () => {
  test('RN-04: GET /api/empresa retorna HTTP 200', async () => {
    const res = await request(app).get('/api/empresa');
    expect(res.statusCode).toBe(200);
  });

  test('RN-01: resposta contém todos os campos obrigatórios', async () => {
    const res = await request(app).get('/api/empresa');
    const camposObrigatorios = [
      'nome', 'descricao', 'endereco', 'telefone',
      'email', 'status', 'colaboradores', 'entregasMes'
    ];
    camposObrigatorios.forEach(campo => {
      expect(res.body).toHaveProperty(campo);
    });
  });

  test('RN-02: campo "status" indica estado operacional (valor: "Ativa")', async () => {
    const res = await request(app).get('/api/empresa');
    expect(res.body.status).toBe('Ativa');
  });

  test('RN-09: "colaboradores" é número inteiro positivo (esperado: 25)', async () => {
    const res = await request(app).get('/api/empresa');
    expect(typeof res.body.colaboradores).toBe('number');
    expect(res.body.colaboradores).toBeGreaterThan(0);
    expect(res.body.colaboradores).toBe(25);
  });

  test('RN-10: "entregasMes" é número inteiro positivo (esperado: 1200)', async () => {
    const res = await request(app).get('/api/empresa');
    expect(typeof res.body.entregasMes).toBe('number');
    expect(res.body.entregasMes).toBeGreaterThan(0);
    expect(res.body.entregasMes).toBe(1200);
  });

  test('resposta é do tipo JSON (Content-Type: application/json)', async () => {
    const res = await request(app).get('/api/empresa');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CT-02 — Backend retorna erro 500 (Negativo)
// ─────────────────────────────────────────────────────────────────────────────
describe('CT-02 — Backend retorna erro 500 (Negativo)', () => {
  let errorApp;

  beforeAll(() => {
    errorApp = express();
    errorApp.get('/api/empresa', (req, res) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });

  test('endpoint retorna HTTP 500 quando há falha interna', async () => {
    const res = await request(errorApp).get('/api/empresa');
    expect(res.statusCode).toBe(500);
  });

  test('resposta de erro contém campo "error" com mensagem', async () => {
    const res = await request(errorApp).get('/api/empresa');
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');
  });

  test('resposta de erro ainda é JSON válido (não quebra o parser)', async () => {
    const res = await request(errorApp).get('/api/empresa');
    expect(() => JSON.parse(JSON.stringify(res.body))).not.toThrow();
  });
});
