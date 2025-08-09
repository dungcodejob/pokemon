import { isNil } from '@app/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { type Cache } from 'cache-manager';

@Injectable()
export class BacklistService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addTokenBlacklist(
    userId: string,
    tokenId: string,
    exp: number,
  ): Promise<void> {
    const now = Date.now();
    const ttl = (exp - now) * 1000;
    const key = this.createKey(userId, tokenId);

    if (ttl > 0) {
      await this.cacheManager.set(key, now, ttl);
    }
    return;
  }

  async checkIfTokenIsBlacklisted(
    userId: string,
    tokenId: string,
  ): Promise<boolean> {
    const key = this.createKey(userId, tokenId);
    const time = await this.cacheManager.get<number>(key);

    return isNil(time);
  }

  private createKey(userId: string, tokenId: string) {
    return `blacklist:${userId}:${tokenId}`;
  }
}
