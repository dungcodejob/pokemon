import { AccessPayload } from './access-token';
import { TokenBase } from './token-base';

export interface RefreshPayload extends AccessPayload {
  tokenId: string;
  version: number;
}

export interface RefreshToken extends RefreshPayload, TokenBase {}
