# AI Chat Backend Server

> Backend escalável para plataformas de atendimento automatizado.

Chatbot inteligente com controle multiempresa, autenticação JWT com roles, integração OpenAI e armazenamento persistente.

## 🚀 Funcionalidades

- **Autenticação JWT** com roles (`ADMIN`, `USER`)
- **Guards de autorização** para proteger rotas baseado em roles
- **Integração OpenAI** para geração de respostas inteligentes
- **CRUD completo de conversas** associadas a usuários e empresas (multi-tenant)
- **Persistência** dos chats no banco PostgreSQL via Prisma ORM
- **Validação de dados** com class-validator
- **Arquitetura modular**: Auth, User, Chat, OpenAI
- **Testes** com Jest e Supertest

## 🛠️ Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js
- **[Prisma ORM](https://www.prisma.io/)** - ORM para PostgreSQL
- **[PostgreSQL (Neon)](https://neon.tech/)** - Banco de dados
- **[OpenAI API](https://platform.openai.com/)** - Integração com IA
- **[JWT](https://jwt.io/)** - Autenticação
- **[Passport.js](http://www.passportjs.org/)** - Estratégias de autenticação
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem principal
- **[bcrypt](https://github.com/dcodeIO/bcrypt.js/)** - Hash de senhas

## 📋 Pré-requisitos

- Node.js >= 18
- npm ou yarn
- Conta Neon (PostgreSQL)
- Conta OpenAI com API Key

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd AIContent_Server
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://usuario:senha@host:porta/banco?schema=public

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRES_IN=1h

# OpenAI
OPENAI_API_KEY=sua_chave_api_openai
```

### 4. Execute as migrations do Prisma

```bash
npx prisma migrate dev
```

### 5. Inicie o servidor

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

O servidor estará disponível em `http://localhost:3000`

## 📚 Documentação da API

### 🔐 Autenticação

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "role": "user"
  }
}
```

### 💬 Chat

#### Enviar mensagem para IA
```http
POST /chat
Authorization: Bearer <seu_token_jwt>
Content-Type: application/json

{
  "prompt": "Explique o que é TypeScript"
}
```

#### Listar conversas do usuário
```http
GET /chat
Authorization: Bearer <seu_token_jwt>
```

#### Buscar conversa específica
```http
GET /chat/:id
Authorization: Bearer <seu_token_jwt>
```

#### Excluir conversa
```http
DELETE /chat/:id
Authorization: Bearer <seu_token_jwt>
```

### 👥 Usuários

#### Listar todos os usuários (ADMIN)
```http
GET /users
Authorization: Bearer <seu_token_jwt>
```

#### Buscar usuário específico
```http
GET /users/:id
Authorization: Bearer <seu_token_jwt>
```

#### Criar novo usuário
```http
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

#### Atualizar usuário
```http
PATCH /users/:id
Authorization: Bearer <seu_token_jwt>
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "email": "joao.novo@exemplo.com"
}
```

#### Excluir usuário (ADMIN)
```http
DELETE /users/:id
Authorization: Bearer <seu_token_jwt>
```

### 🤖 OpenAI (Acesso direto)

#### Chat direto com IA (ADMIN)
```http
POST /openai/chat
Authorization: Bearer <seu_token_jwt>
Content-Type: application/json

{
  "message": "Explique o que é NestJS"
}
```

## 🔒 Controle de Acesso

### Roles Disponíveis
- **USER**: Acesso básico aos chats e perfil próprio
- **ADMIN**: Acesso completo a todos os recursos

### Endpoints por Nível de Acesso

| Endpoint | Método | USER | ADMIN | Público |
|----------|--------|------|-------|---------|
| `/auth/login` | POST | ✅ | ✅ | ✅ |
| `/chat` | POST | ✅ | ✅ | ❌ |
| `/chat` | GET | ✅ | ✅ | ❌ |
| `/chat/:id` | GET | ✅ | ✅ | ❌ |
| `/chat/:id` | DELETE | ✅ | ✅ | ❌ |
| `/users` | GET | ❌ | ✅ | ❌ |
| `/users/:id` | GET | ✅* | ✅ | ❌ |
| `/users` | POST | ✅ | ✅ | ✅ |
| `/users/:id` | PATCH | ✅* | ✅ | ❌ |
| `/users/:id` | DELETE | ❌ | ✅ | ❌ |
| `/openai/chat` | POST | ❌ | ✅ | ❌ |

*Usuários só podem acessar seus próprios dados

## 🗄️ Estrutura do Banco

### Tabela `Company`

```sql
- id: Int (PK, auto-increment)
- name: String
- createdAt: DateTime
```

### Tabela `User`
```sql
- id: Int (PK, auto-increment)
- name: String
- email: String (unique)
- password: String (hashed)
- role: String (default: "user")
- createdAt: DateTime
```

### Tabela `Chat`
```sql
- id: String (PK, UUID)
- userId: Int (FK para User)
- prompt: String
- response: String
- createdAt: DateTime
- updatedAt: DateTime
```

## 🧪 Testes

### Executar testes unitários
```bash
npm run test
```

### Executar testes e2e
```bash
npm run test:e2e
```

### Executar testes com coverage
```bash
npm run test:cov
```

## 📁 Estrutura do Projeto

```
src/
├── auth/                 # Autenticação e autorização
│   ├── decorators/      # Decorators personalizados
│   ├── guards/          # Guards de proteção
│   ├── dto/            # Data Transfer Objects
│   └── ...
├── chat/                # Módulo de conversas
│   ├── dto/            # DTOs do chat
│   └── ...
├── user/                # Módulo de usuários
│   ├── dto/            # DTOs do usuário
│   └── ...
├── openai/              # Integração OpenAI
└── prisma/              # Configuração do Prisma
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Servidor com hot reload
npm run start:debug      # Servidor em modo debug

# Produção
npm run build           # Compilar TypeScript
npm run start:prod      # Executar versão compilada

# Testes
npm run test            # Testes unitários
npm run test:e2e        # Testes end-to-end
npm run test:cov        # Testes com coverage

# Qualidade de código
npm run lint            # ESLint
npm run format          # Prettier
```

## 🔧 Comandos Prisma

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma migrate dev

# Visualizar banco (Prisma Studio)
npx prisma studio

# Reset do banco
npx prisma migrate reset
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, abra uma issue no repositório ou entre em contato através do email.

---

**Desenvolvido com ❤️ usando NestJS e TypeScript**

