# Smarty Entregas

Dashboard web para exibição de informações e métricas operacionais da empresa **Smarty Entregas**.

## Tecnologias

- **Backend:** Node.js + Express.js (porta 3001)
- **Frontend:** HTML5 + CSS3 + JavaScript Vanilla (porta 3000)
- **Infraestrutura:** Docker

## Como executar

### Com Docker
```bash
docker-compose up
```

### Manualmente
```bash
# Backend
cd backend
npm install
node server.js

# Frontend (outro terminal)
cd frontend
npm install
node server.js
```

Acesse: `http://localhost:3000`

## Estrutura do Projeto

```
smarty_vs_code_project/
├── backend/          # API REST (Express)
│   ├── server.js
│   └── Dockerfile
├── frontend/         # Interface web
│   ├── public/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   └── Dockerfile
└── ESTRATEGIA_DE_TESTES.md  # Documento de Estratégia de Testes
```

## Documento de Estratégia de Testes

O documento com as 3 funcionalidades principais, regras de negócio e 6 casos de teste classificados está disponível em:

[ESTRATEGIA_DE_TESTES.md](./ESTRATEGIA_DE_TESTES.md)
