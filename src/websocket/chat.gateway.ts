import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../chat/chat.service';
import { MessageService } from '../message/message.service';
import { ConversationService } from '../conversation/conversation.service';
import { SenderType } from '../message/dto/create-message.dto';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  userRole?: string;
  companyId?: number;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<number, string>(); // userId -> socketId
  private userRooms = new Map<number, Set<string>>(); // userId -> Set<conversationIds>

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
    private messageService: MessageService,
    private conversationService: ConversationService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extrair token do header Authorization ou query
      const token = client.handshake.auth?.token || client.handshake.query?.token;

      if (!token) {
        client.disconnect();
        return;
      }

      // Verificar e decodificar o token JWT
      const payload = this.jwtService.verify(token as string);

      if (!payload) {
        client.disconnect();
        return;
      }

      // Adicionar informações do usuário ao socket
      client.userId = payload.userId || payload.id;
      client.userRole = payload.role;
      client.companyId = payload.companyId;

      // Registrar usuário conectado
      if (client.userId) {
        this.connectedUsers.set(client.userId, client.id);
      }

      // Carregar conversas do usuário e juntar às rooms
      await this.joinUserConversations(client);

      console.log(`Usuário ${client.userId} conectado ao chat`);
    } catch (error) {
      console.error('Erro na conexão WebSocket:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.userRooms.delete(client.userId);
      console.log(`Usuário ${client.userId} desconectado do chat`);
    }
  }

  private async joinUserConversations(client: AuthenticatedSocket) {
    try {
      if (!client.userId) {
        console.error('Usuário não identificado para carregar conversas');
        return;
      }

      const conversations = await this.conversationService.findAllByUser(client.userId);
      const conversationIds = conversations.map(conv => `conversation_${conv.id}`);

      // Criar room para cada conversa
      conversationIds.forEach(roomId => {
        client.join(roomId);
      });

      // Registrar rooms do usuário
      this.userRooms.set(client.userId, new Set(conversationIds));
    } catch (error) {
      console.error('Erro ao carregar conversas do usuário:', error);
    }
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @MessageBody() data: { conversationId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      if (!client.userId) {
        client.emit('error', { message: 'Usuário não autenticado' });
        return;
      }

      const roomId = `conversation_${data.conversationId}`;

      // Verificar se o usuário tem acesso à conversa
      const conversation = await this.conversationService.findOneByUser(
        data.conversationId,
        client.userId,
      );

      if (!conversation) {
        client.emit('error', { message: 'Acesso negado à conversa' });
        return;
      }

      // Juntar à room da conversa
      await client.join(roomId);

      // Atualizar rooms do usuário
      if (!this.userRooms.has(client.userId)) {
        this.userRooms.set(client.userId, new Set());
      }
      this.userRooms.get(client.userId)?.add(roomId);

      client.emit('joined_conversation', { conversationId: data.conversationId });
    } catch (error) {
      console.error('Erro ao juntar conversa:', error);
      client.emit('error', { message: 'Erro ao juntar conversa' });
    }
  }

  @SubscribeMessage('leave_conversation')
  async handleLeaveConversation(
    @MessageBody() data: { conversationId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) {
      client.emit('error', { message: 'Usuário não autenticado' });
      return;
    }

    const roomId = `conversation_${data.conversationId}`;
    await client.leave(roomId);

    // Remover da lista de rooms do usuário
    this.userRooms.get(client.userId)?.delete(roomId);

    client.emit('left_conversation', { conversationId: data.conversationId });
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: {
      conversationId: number;
      content: string;
    },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      if (!client.userId) {
        client.emit('error', { message: 'Usuário não autenticado' });
        return;
      }

      // Verificar se o usuário tem acesso à conversa
      const conversation = await this.conversationService.findOneByUser(
        data.conversationId,
        client.userId,
      );

      if (!conversation) {
        client.emit('error', { message: 'Acesso negado à conversa' });
        return;
      }

      // Criar mensagem do usuário
      const userMessage = await this.messageService.create(client.userId, {
        content: data.content,
        conversationId: data.conversationId,
        sender: SenderType.USER,
      });

      // Emitir mensagem para todos na conversa
      const roomId = `conversation_${data.conversationId}`;
      this.server.to(roomId).emit('new_message', {
        message: userMessage,
        conversationId: data.conversationId,
      });

      // Gerar resposta da IA (opcional - pode ser feito de forma assíncrona)
      try {
        // Simular resposta da IA por enquanto
        setTimeout(async () => {
          try {
            if (client.userId) {
              const aiResponse = await this.chatService.generateAndSave({
                userId: client.userId,
                prompt: data.content,
              });

              if (aiResponse && aiResponse.messages) {
                // Encontrar a mensagem da IA (última mensagem)
                const botMessage = aiResponse.messages.find(msg => msg.sender === 'BOT');

                if (botMessage && client.userId) {
                  // Criar mensagem da IA
                  const aiMessage = await this.messageService.create(client.userId, {
                    content: botMessage.content,
                    conversationId: data.conversationId,
                    sender: SenderType.BOT,
                  });

                  // Emitir resposta da IA
                  this.server.to(roomId).emit('new_message', {
                    message: aiMessage,
                    conversationId: data.conversationId,
                  });
                }
              }
            }
          } catch (error) {
            console.error('Erro ao gerar resposta da IA:', error);
          }
        }, 1000);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      client.emit('error', { message: 'Erro ao enviar mensagem' });
    }
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(
    @MessageBody() data: { conversationId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) {
      return;
    }

    const roomId = `conversation_${data.conversationId}`;
    client.to(roomId).emit('user_typing', {
      userId: client.userId,
      conversationId: data.conversationId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(
    @MessageBody() data: { conversationId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) {
      return;
    }

    const roomId = `conversation_${data.conversationId}`;
    client.to(roomId).emit('user_typing', {
      userId: client.userId,
      conversationId: data.conversationId,
      isTyping: false,
    });
  }

  // Método para notificar usuários sobre nova conversa
  async notifyNewConversation(userId: number, conversationId: number) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      const roomId = `conversation_${conversationId}`;
      this.server.to(socketId).emit('new_conversation', { conversationId });
      this.server.sockets.sockets.get(socketId)?.join(roomId);
    }
  }

  // Método para notificar sobre mensagem de admin
  async notifyAdminMessage(conversationId: number, message: any) {
    const roomId = `conversation_${conversationId}`;
    this.server.to(roomId).emit('admin_message', { message, conversationId });
  }

  // Método para obter usuários conectados
  getConnectedUsers(): number[] {
    return Array.from(this.connectedUsers.keys());
  }

  // Método para verificar se usuário está online
  isUserOnline(userId: number): boolean {
    return this.connectedUsers.has(userId);
  }
}
