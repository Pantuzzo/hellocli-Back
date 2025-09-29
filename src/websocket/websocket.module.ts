import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { WebSocketDocsController } from './websocket-docs.controller';
import { ChatModule } from '../chat/chat.module';
import { MessageModule } from '../message/message.module';
import { ConversationModule } from '../conversation/conversation.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ChatModule, MessageModule, ConversationModule, AuthModule],
  controllers: [WebSocketDocsController],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class WebSocketModule {}
