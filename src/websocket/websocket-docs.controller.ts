import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('WebSocket Chat')
@Controller('websocket')
export class WebSocketDocsController {
  @Get('info')
  @ApiOperation({
    summary: 'Informações sobre WebSocket Chat',
    description: 'Retorna informações sobre como conectar e usar o WebSocket para chat em tempo real'
  })
  @ApiResponse({
    status: 200,
    description: 'Informações do WebSocket retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        endpoint: { type: 'string', example: 'ws://localhost:3000/chat' },
        authentication: {
          type: 'string',
          example: 'JWT Token via auth.token ou query.token'
        },
        events: {
          type: 'object',
          properties: {
            connection: {
              type: 'object',
              properties: {
                description: { type: 'string', example: 'Estabelece conexão WebSocket' },
                auth: { type: 'string', example: 'Token JWT obrigatório' }
              }
            },
            join_conversation: {
              type: 'object',
              properties: {
                description: { type: 'string', example: 'Juntar-se a uma conversa específica' },
                payload: {
                  type: 'object',
                  properties: {
                    conversationId: { type: 'number', example: 1 }
                  }
                },
                response: { type: 'string', example: 'joined_conversation ou error' }
              }
            },
            leave_conversation: {
              type: 'object',
              properties: {
                description: { type: 'string', example: 'Sair de uma conversa' },
                payload: {
                  type: 'object',
                  properties: {
                    conversationId: { type: 'number', example: 1 }
                  }
                },
                response: { type: 'string', example: 'left_conversation' }
              }
            },
            send_message: {
              type: 'object',
              properties: {
                description: { type: 'string', example: 'Enviar mensagem para a conversa' },
                payload: {
                  type: 'object',
                  properties: {
                    conversationId: { type: 'number', example: 1 },
                    content: { type: 'string', example: 'Olá, como você está?' }
                  }
                },
                response: { type: 'string', example: 'new_message (mensagem do usuário + resposta da IA)' }
              }
            },
            typing_start: {
              type: 'object',
              properties: {
                description: { type: 'string', example: 'Indicar que está digitando' },
                payload: {
                  type: 'object',
                  properties: {
                    conversationId: { type: 'number', example: 1 }
                  }
                },
                response: { type: 'string', example: 'user_typing para outros usuários' }
              }
            },
            typing_stop: {
              type: 'object',
              properties: {
                description: { type: 'string', example: 'Parar indicador de digitação' },
                payload: {
                  type: 'object',
                  properties: {
                    conversationId: { type: 'number', example: 1 }
                  }
                },
                response: { type: 'string', example: 'user_typing para outros usuários' }
              }
            }
          }
        }
      }
    }
  })
  getWebSocketInfo() {
    return {
      endpoint: 'ws://localhost:3000/chat',
      authentication: 'JWT Token via auth.token ou query.token',
      events: {
        connection: {
          description: 'Estabelece conexão WebSocket',
          auth: 'Token JWT obrigatório'
        },
        join_conversation: {
          description: 'Juntar-se a uma conversa específica',
          payload: { conversationId: 'number' },
          response: 'joined_conversation ou error'
        },
        leave_conversation: {
          description: 'Sair de uma conversa',
          payload: { conversationId: 'number' },
          response: 'left_conversation'
        },
        send_message: {
          description: 'Enviar mensagem para a conversa',
          payload: { conversationId: 'number', content: 'string' },
          response: 'new_message (mensagem do usuário + resposta da IA)'
        },
        typing_start: {
          description: 'Indicar que está digitando',
          payload: { conversationId: 'number' },
          response: 'user_typing para outros usuários'
        },
        typing_stop: {
          description: 'Parar indicador de digitação',
          payload: { conversationId: 'number' },
          response: 'user_typing para outros usuários'
        }
      }
    };
  }

  @Get('examples')
  @ApiOperation({
    summary: 'Exemplos de código para WebSocket',
    description: 'Retorna exemplos práticos de como usar o WebSocket'
  })
  @ApiResponse({
    status: 200,
    description: 'Exemplos de código retornados com sucesso'
  })
  getWebSocketExamples() {
    return {
      connection: `const socket = io('ws://localhost:3000/chat', {
  auth: { token: 'seu-jwt-token-aqui' }
});`,
      joinConversation: `socket.emit('join_conversation', { conversationId: 1 });`,
      sendMessage: `socket.emit('send_message', {
  conversationId: 1,
  content: 'Olá, como você está?'
});`,
      listenMessages: `socket.on('new_message', (data) => {
  console.log('Nova mensagem:', data.message);
});`,
      typing: `// Iniciar digitação
socket.emit('typing_start', { conversationId: 1 });

// Parar digitação
socket.emit('typing_stop', { conversationId: 1 });`,
      leaveConversation: `socket.emit('leave_conversation', { conversationId: 1 });`
    };
  }
}
