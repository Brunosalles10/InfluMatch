import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '../../redis/cache.service';

@Injectable()
export class UserCacheInvalidationService {
  private readonly logger = new Logger(UserCacheInvalidationService.name);

  constructor(private readonly cacheService: CacheService) {}

  /**
   * Remove o cache individual e todas as páginas da listagem de usuários.
   */
  async invalidate(userId: string): Promise<void> {
    await Promise.all([
      this.cacheService.del(`usuario:${userId}`),
      this.cacheService.deleteByPrefix('usuarios:page:*'),
    ]);

    this.logger.debug(`Caches invalidados para o usuário ID: ${userId}`);
  }
}
