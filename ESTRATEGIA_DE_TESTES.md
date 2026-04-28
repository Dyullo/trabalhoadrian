# Documento de Estratégia de Testes — Smarty Entregas

## Visão Geral do Projeto

**Nome do Projeto:** Smarty Entregas  
**Descrição:** Dashboard web para exibição de informações e métricas operacionais de uma empresa de entregas.  
**Stack:** Node.js + Express (backend), HTML/CSS/JavaScript (frontend), Docker  

---

## 1. Funcionalidades Principais

| # | Funcionalidade |
|---|----------------|
| 1 | Exibição das Informações da Empresa |
| 2 | Atualização de Dados em Tempo Real (Refresh) |
| 3 | Painel de Métricas Operacionais |

---

## 2. Funcionalidade 1 — Exibição das Informações da Empresa

### Descrição
O sistema exibe, em uma interface de cartão, os dados cadastrais da empresa: nome, descrição, endereço, telefone, e-mail e status operacional. Os dados são fornecidos pelo endpoint `GET /api/empresa` do backend.

### Regras de Negócio
- RN-01: O endpoint `/api/empresa` deve retornar um objeto JSON contendo os campos: `nome`, `descricao`, `endereco`, `telefone`, `email`, `status`, `colaboradores` e `entregasMes`.
- RN-02: O campo `status` indica se a empresa está operacional; o valor padrão esperado é `"Ativo"`.
- RN-03: Todos os campos de texto devem ser exibidos na tela após o carregamento da página; campos ausentes ou nulos devem ser tratados sem quebrar a interface.
- RN-04: O backend deve responder com HTTP 200 em requisições válidas ao endpoint.

### Casos de Teste

#### CT-01 — Exibição correta dos dados da empresa (Positivo)
- **Tipo:** Integração
- **Objetivo:** Verificar que o frontend exibe corretamente os dados retornados pelo backend.
- **Pré-condição:** Backend rodando na porta 3001; endpoint `/api/empresa` disponível.
- **Passos:**
  1. Acessar a aplicação em `http://localhost:3000`.
  2. Aguardar o carregamento completo da página.
  3. Verificar os elementos na tela.
- **Resultado Esperado:** Os campos nome (`"Smarty Entregas"`), endereço (`"Rua das Entregas, 123 - Guarapuava - PR"`), telefone, e-mail e status (`"Ativo"`) são exibidos corretamente na interface.
- **Critério de Aceite:** Todos os campos visíveis e com os valores correspondentes ao JSON retornado pela API.

---

#### CT-02 — Backend retorna erro 500 (Negativo)
- **Tipo:** Integração
- **Objetivo:** Verificar o comportamento do frontend quando o backend retorna um erro interno.
- **Pré-condição:** Backend configurado para retornar HTTP 500 no endpoint `/api/empresa`.
- **Passos:**
  1. Simular falha no backend (ex.: derrubar o serviço ou alterar temporariamente o endpoint).
  2. Acessar `http://localhost:3000`.
  3. Observar a interface.
- **Resultado Esperado:** A interface não exibe dados corrompidos nem lança exceção JavaScript não tratada; deve exibir mensagem de erro amigável ou campo vazio.
- **Critério de Aceite:** Nenhum conteúdo inválido exibido; a aplicação permanece estável.

---

## 3. Funcionalidade 2 — Atualização de Dados em Tempo Real (Refresh)

### Descrição
O botão **"Atualizar"** no cabeçalho dispara uma nova requisição ao endpoint `/api/empresa` e re-renderiza os dados na tela sem recarregar a página (SPA-like behavior via fetch + manipulação de DOM).

### Regras de Negócio
- RN-05: Ao clicar no botão "Atualizar", uma nova requisição `GET /api/empresa` deve ser disparada imediatamente.
- RN-06: Durante o carregamento, o texto de status deve exibir `"Carregando..."` para indicar ao usuário que a operação está em progresso.
- RN-07: Após a conclusão da requisição (sucesso ou falha), os dados exibidos na tela devem ser atualizados sem recarregar a página inteira.
- RN-08: O botão deve ser funcional apenas quando há conexão ativa com o backend.

### Casos de Teste

#### CT-03 — Atualização bem-sucedida ao clicar em "Atualizar" (Positivo)
- **Tipo:** E2E (End-to-End)
- **Objetivo:** Verificar o fluxo completo de atualização de dados via botão.
- **Pré-condição:** Backend rodando; página carregada com dados exibidos.
- **Passos:**
  1. Acessar `http://localhost:3000` e aguardar carregamento inicial.
  2. Clicar no botão **"Atualizar"**.
  3. Observar o estado intermediário ("Carregando...").
  4. Aguardar a conclusão e verificar os dados.
- **Resultado Esperado:**
  - Ao clicar, o indicador de carregamento aparece brevemente.
  - Os dados são re-renderizados corretamente na interface sem reload de página.
- **Critério de Aceite:** Dados atualizados visíveis; sem reload de página; nenhum erro no console.

---

#### CT-04 — Clique em "Atualizar" com backend offline (Negativo)
- **Tipo:** E2E (End-to-End)
- **Objetivo:** Verificar que o sistema trata corretamente a indisponibilidade do backend ao tentar atualizar.
- **Pré-condição:** Backend **desligado**; página previamente carregada.
- **Passos:**
  1. Derrubar o backend (porta 3001 indisponível).
  2. Clicar no botão **"Atualizar"** no frontend.
  3. Observar o comportamento da interface.
- **Resultado Esperado:** A interface não trava nem exibe dados incorretos; deve apresentar mensagem de erro ou manter os dados anteriores sem alteração.
- **Critério de Aceite:** Nenhum crash na interface; experiência do usuário preservada.

---

## 4. Funcionalidade 3 — Painel de Métricas Operacionais

### Descrição
O dashboard exibe dois indicadores-chave de desempenho (KPIs) da empresa em um grid responsivo de 2 colunas: **Colaboradores** (total de funcionários ativos) e **Entregas/Mês** (volume mensal de entregas realizadas).

### Regras de Negócio
- RN-09: O campo `colaboradores` deve ser um número inteiro positivo (valor esperado: 25).
- RN-10: O campo `entregasMes` deve ser um número inteiro positivo (valor esperado: 1200).
- RN-11: Ambos os valores devem ser exibidos nos cards de métrica correspondentes no painel.
- RN-12: Os cards de métrica devem ser renderizados em grid de 2 colunas em resoluções desktop (≥ 768px) e em coluna única em resoluções mobile.

### Casos de Teste

#### CT-05 — Métricas exibidas corretamente com dados válidos (Positivo)
- **Tipo:** Unitário
- **Objetivo:** Verificar que a função de renderização do DOM atualiza corretamente os cards de métricas com os dados recebidos da API.
- **Pré-condição:** Função `carregarDados()` (ou equivalente) disponível para teste isolado; mock do retorno da API com `{ colaboradores: 25, entregasMes: 1200 }`.
- **Passos:**
  1. Instanciar o DOM virtual com os elementos `#colaboradores` e `#entregasMes`.
  2. Chamar a função de atualização do DOM com os dados mockados.
  3. Verificar os valores dos elementos.
- **Resultado Esperado:** `document.getElementById('colaboradores').textContent === '25'` e `document.getElementById('entregasMes').textContent === '1200'`.
- **Critério de Aceite:** Ambos os cards exibem os valores numéricos corretos conforme os dados fornecidos.

---

#### CT-06 — API retorna métricas com valores inválidos (Negativo)
- **Tipo:** Unitário
- **Objetivo:** Verificar que o sistema trata adequadamente valores inesperados (nulos, negativos ou não numéricos) nos campos de métricas.
- **Pré-condição:** Mock da API retornando `{ colaboradores: null, entregasMes: -5 }`.
- **Passos:**
  1. Instanciar o DOM virtual com os elementos de métricas.
  2. Chamar a função de atualização do DOM com os dados inválidos mockados.
  3. Verificar o estado dos elementos na tela.
- **Resultado Esperado:** Os cards não exibem valores negativos, nulos ou `undefined` sem tratamento; idealmente mostram `"N/A"`, `"0"` ou valor padrão configurado.
- **Critério de Aceite:** A interface permanece coerente; nenhum valor inválido exposto diretamente ao usuário.

---

## 5. Resumo dos Casos de Teste

| CT  | Funcionalidade                        | Tipo        | Cenário   |
|-----|---------------------------------------|-------------|-----------|
| CT-01 | Exibição das Informações da Empresa | Integração  | Positivo  |
| CT-02 | Exibição das Informações da Empresa | Integração  | Negativo  |
| CT-03 | Atualização em Tempo Real (Refresh)  | E2E         | Positivo  |
| CT-04 | Atualização em Tempo Real (Refresh)  | E2E         | Negativo  |
| CT-05 | Painel de Métricas Operacionais      | Unitário    | Positivo  |
| CT-06 | Painel de Métricas Operacionais      | Unitário    | Negativo  |

---

## 6. Classificação dos Tipos de Teste

| Tipo        | Descrição no Contexto do Projeto |
|-------------|----------------------------------|
| **Unitário** | Testa funções JavaScript isoladas de manipulação do DOM, sem dependência de rede ou servidor (usa mocks para simular a API). |
| **Integração** | Testa a comunicação real entre frontend e backend: verifica se a requisição HTTP ao `/api/empresa` é processada corretamente e os dados chegam e são exibidos. |
| **E2E (End-to-End)** | Simula o comportamento completo do usuário no browser: carregamento da página, clique em botões e observação do resultado final na interface, cobrindo todo o fluxo da aplicação. |

---

*Documento elaborado para a disciplina de Qualidade de Software — Smarty Entregas © 2026*
