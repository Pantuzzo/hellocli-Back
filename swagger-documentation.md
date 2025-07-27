# Documentação Swagger - AI Chat Backend

## 📚 Endpoints Documentados

### 🔐 Auth
- **POST /auth/login** - Login do usuário
  - Retorna: `access_token` e dados do usuário
  - Status: 201, 401, 400

### 👥 Users
- **GET /users** - Listar todos os usuários (ADMIN)
- **GET /users/:id** - Buscar usuário específico (ADMIN ou dono)
- **POST /users** - Criar novo usuário (Público)
- **PATCH /users/:id** - Atualizar usuário (ADMIN ou dono)
- **DELETE /users/:id** - Excluir usuário (ADMIN)

### 💬 Chat
- **POST /chat** - Enviar mensagem para IA e salvar
- **GET /chat** - Listar conversas do usuário
- **GET /chat/:id** - Buscar conversa específica
- **DELETE /chat/:id** - Excluir conversa

### 🤖 OpenAI
- **POST /openai/chat** - Chat direto com OpenAI (ADMIN)

### 📱 App
- **GET /** - Status da API

## 🛠️ Melhorias Implementadas

### 1. **Chat Controller**
- ✅ Documentação completa com schemas
- ✅ Exemplos de resposta
- ✅ Códigos de erro (401, 400, 404)
- ✅ Parâmetros documentados

### 2. **OpenAI Controller**
- ✅ DTO criado com validação
- ✅ Documentação de autenticação ADMIN
- ✅ Schemas de resposta
- ✅ Códigos de erro específicos

### 3. **App Controller**
- ✅ Endpoint de status documentado
- ✅ Resposta simples e clara

### 4. **DTOs Melhorados**
- ✅ `CreateChatDto` com validação
- ✅ `OpenAIChatDto` criado
- ✅ Exemplos e descrições

### 5. **Estrutura Modular**
- ✅ `OpenAIModule` criado
- ✅ Organização melhorada

## 🚀 Como Testar

### 1. Acesse o Swagger
```
http://localhost:3000/docs
```

### 2. Fluxo de Teste
1. **Criar usuário**: `POST /users`
2. **Fazer login**: `POST /auth/login`
3. **Autorizar**: Use o token no botão "Authorize"
4. **Testar endpoints**: Todos os endpoints protegidos

### 3. Exemplos de Uso

#### Criar Usuário
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456",
  "role": "user"
}
```

#### Login
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

#### Enviar Mensagem para Chat
```json
{
  "prompt": "Explique o que é TypeScript"
}
```

#### Chat Direto OpenAI (ADMIN)
```json
{
  "message": "Explique o que é NestJS"
}
```

## 🔧 Configurações

### Swagger Config
- **Título**: AI Chat Backend API
- **Descrição**: API para sistema de chatbot com integração OpenAI
- **Versão**: 1.0
- **Autenticação**: Bearer JWT

### Validações
- ✅ Class-validator ativo
- ✅ Whitelist habilitado
- ✅ Transform automático
- ✅ Forbid non-whitelisted

## 📊 Status dos Endpoints

| Endpoint | Método | Auth | Role | Status |
|----------|--------|------|------|--------|
| `/` | GET | ❌ | - | ✅ |
| `/auth/login` | POST | ❌ | - | ✅ |
| `/users` | GET | ✅ | ADMIN | ✅ |
| `/users/:id` | GET | ✅ | ADMIN/OWNER | ✅ |
| `/users` | POST | ❌ | - | ✅ |
| `/users/:id` | PATCH | ✅ | ADMIN/OWNER | ✅ |
| `/users/:id` | DELETE | ✅ | ADMIN | ✅ |
| `/chat` | POST | ✅ | USER/ADMIN | ✅ |
| `/chat` | GET | ✅ | USER/ADMIN | ✅ |
| `/chat/:id` | GET | ✅ | USER/ADMIN | ✅ |
| `/chat/:id` | DELETE | ✅ | USER/ADMIN | ✅ |
| `/openai/chat` | POST | ✅ | ADMIN | ✅ |

## 🎯 Próximos Passos

1. **Testar todos os endpoints** no Swagger
2. **Verificar autenticação** com diferentes roles
3. **Validar respostas** dos schemas
4. **Testar casos de erro** (401, 403, 404)

---

**Swagger implementado com sucesso! 🎉** 