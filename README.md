# AI Chat Backend (NestJS + OpenAI + Neon)

Backend em NestJS para um chatbot com integração OpenAI, persistência no banco Neon (PostgreSQL) e autenticação JWT com roles.

---

## Funcionalidades

- **Autenticação JWT** com roles (`ADMIN`, `USER`).
- **Guards** para proteger rotas baseado em roles.
- **Integração OpenAI** para geração de respostas a partir de prompts.
- **CRUD de conversas** associadas a usuários.
- **Persistência** dos chats no banco Neon (PostgreSQL) via Prisma ORM.
- **Validação de token e usuário** nos endpoints protegidos.
- **Modularização**: Auth, User, Chat, OpenAI.

---

## Tecnologias

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL (Neon)](https://neon.tech/)
- [OpenAI API](https://platform.openai.com/)
- [JWT Authentication](https://jwt.io/)
- [Passport.js](http://www.passportjs.org/)
- TypeScript

---

## Pré-requisitos

- Node.js >= 18
- Yarn ou npm
- Conta Neon e configuração da URL do banco no `.env`
- Conta OpenAI e chave API no `.env`

---

## Setup

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

2. Instale as dependências

npm install
# ou
yarn install

3. Configure as variáveis de ambiente
DATABASE_URL=postgresql://usuario:senha@host:porta/banco?schema=public
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1h
OPENAI_API_KEY=sua_chave_openai

4. Rodar as migrations Prisma
npx prisma migrate dev --name init

# API - Documentação de Endpoints

Esta documentação lista os principais endpoints disponíveis na API, suas rotas, métodos HTTP, níveis de autorização e descrição.

---

## 🔐 Auth

| Método | Rota           | Descrição                          | Autorização          |
|--------|----------------|----------------------------------|---------------------|
| POST   | `/auth/login`  | Realiza login e retorna token JWT | Público (sem token)  |

---

## 💬 Chat

| Método | Rota          | Descrição                                     | Autorização            |
|--------|---------------|-----------------------------------------------|-----------------------|
| POST   | `/chat`       | Envia prompt para IA e salva a resposta       | ADMIN, USER (JWT)      |
| GET    | `/chat`       | Lista todas as conversas do usuário logado    | ADMIN, USER (JWT)      |
| GET    | `/chat/:id`   | Busca uma conversa específica do usuário      | ADMIN, USER (JWT)      |
| DELETE | `/chat/:id`   | Exclui uma conversa específica do usuário     | ADMIN, USER (JWT)      |

---

## 👥 Usuários

| Método | Rota          | Descrição                                                        | Autorização                 |
|--------|---------------|------------------------------------------------------------------|----------------------------|
| GET    | `/users`      | Lista todos os usuários                                          | ADMIN (JWT)                |
| GET    | `/users/:id`  | Busca dados de um usuário pelo ID. Admin acessa qualquer; usuário só os seus | ADMIN ou dono da conta (JWT) |
| POST   | `/users`      | Cria novo usuário (recomenda-se só ADMIN)                       | Público ou ADMIN*           |
| PATCH  | `/users/:id`  | Atualiza dados do usuário (Admin ou dono da conta)              | ADMIN ou dono da conta (JWT) |
| DELETE | `/users/:id`  | Remove usuário do sistema                                        | ADMIN (JWT)                |

*Nota: No momento a criação de usuário está pública, mas recomenda-se restringir.*

---

## 🤖 OpenAI (Integração com IA)

| Método | Rota           | Descrição                              | Autorização          |
|--------|----------------|--------------------------------------|---------------------|
| POST   | `/openai/chat` | Envia mensagem para a IA e recebe resposta | Público (sem token)* |

---

## ⚠️ Autenticação e Autorização

- Para acessar endpoints protegidos, envie o token JWT no header:

