import { IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  prompt: string;
}
