import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: number;
    id: number;
    email?: string;
  };
}
