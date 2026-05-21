# Diagrama de Arquitetura — Kubernetes (Smarty Entregas)

```mermaid
graph TB
    USER([Usuário / Browser]) -->|HTTP| INGRESS

    subgraph CLUSTER["☸ Kubernetes Cluster"]

        INGRESS["🔀 Ingress (nginx)\nsmarty.local\n/ → frontend\n/api → backend"]

        subgraph FRONTEND_SVC["Service: frontend-service\nNodePort :30000 → :80"]
            FE1["📦 frontend-pod-1\nPort: 3000"]
            FE2["📦 frontend-pod-2\nPort: 3000"]
        end

        subgraph BACKEND_SVC["Service: backend-service\nClusterIP :3001"]
            BE1["📦 backend-pod-1\nPort: 3001"]
            BE2["📦 backend-pod-2\nPort: 3001"]
        end

        subgraph DB_SVC["Service: postgres\nClusterIP :5432"]
            DB["🗄️ postgres-pod\nPort: 5432\n(PVC: 1Gi)"]
        end

        CM["📋 ConfigMap: app-config\nDB_HOST: postgres\nDB_PORT: 5432\nNODE_ENV: development\nAPI_URL: backend-service:3001"]

        SEC["🔐 Secret: app-secret\nDB_USER: smarty\nDB_PASSWORD: ••••••\nDB_NAME: smartydb"]

        INGRESS --> FRONTEND_SVC
        INGRESS --> BACKEND_SVC
        FRONTEND_SVC --> BACKEND_SVC
        BACKEND_SVC --> DB_SVC
        CM -.->|injeta config| BACKEND_SVC
        CM -.->|injeta config| FRONTEND_SVC
        SEC -.->|injeta secrets| BACKEND_SVC
        SEC -.->|injeta secrets| DB_SVC
    end

    style CLUSTER fill:#1a1a2e,stroke:#4a9eff,color:#fff
    style FRONTEND_SVC fill:#16213e,stroke:#4a9eff,color:#fff
    style BACKEND_SVC fill:#16213e,stroke:#4a9eff,color:#fff
    style DB_SVC fill:#16213e,stroke:#4a9eff,color:#fff
    style CM fill:#0f3460,stroke:#ffd700,color:#fff
    style SEC fill:#0f3460,stroke:#ff6b6b,color:#fff
```

## Descrição dos Componentes

| Componente | Tipo | Réplicas | Porta |
|-----------|------|----------|-------|
| frontend | Deployment | 2 | 3000 → NodePort 30000 |
| backend | Deployment | 2 | 3001 (ClusterIP) |
| postgres | Deployment | 1 | 5432 (ClusterIP) |
| Ingress | Ingress | — | 80 (HTTP) |
| app-config | ConfigMap | — | — |
| app-secret | Secret | — | — |

## Fluxo de Comunicação

1. **Usuário** acessa `http://smarty.local` ou `http://localhost:30000`
2. **Ingress** roteia `/` para o `frontend-service` e `/api` para o `backend-service`
3. **Frontend** (2 réplicas) consome a API do **Backend** via `backend-service:3001`
4. **Backend** (2 réplicas) lê configurações do **ConfigMap** e credenciais do **Secret**
5. **Backend** conecta ao **PostgreSQL** via `postgres:5432`
6. **PostgreSQL** persiste dados em volume (`PersistentVolumeClaim` de 1Gi)
