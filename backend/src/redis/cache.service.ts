import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  /** Recupera e desserializa um valor armazenado no Redis. */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      if (value === null) return null;

      this.logger.debug(`Cache HIT → ${key}`);
      return JSON.parse(value) as T;
    } catch (err) {
      this.handleError('ler cache', key, err);
      return null;
    }
  }

  /** Serializa e armazena um valor com tempo de expiração em segundos. */
  async set<T>(key: string, value: T, ttl = 60): Promise<void> {
    try {
      await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
      this.logger.debug(`Cache SET → ${key} (TTL: ${ttl}s)`);
    } catch (err) {
      this.handleError('gravar cache', key, err);
    }
  }

  /** Remove uma chave específica do Redis. */
  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
      this.logger.debug(`Cache DEL → ${key}`);
    } catch (err) {
      this.handleError('deletar cache', key, err);
    }
  }

  /**
   * Percorre o Redis com SCAN e remove todas as chaves correspondentes ao padrão.
   * SCAN evita bloquear o Redis, diferentemente do comando KEYS.
   */
  async deleteByPrefix(prefix: string): Promise<void> {
    try {
      let cursor = '0';
      let keysDeleted = 0;

      do {
        // Escaneia 100 chaves por vez procurando o padrão
        const [nextCursor, keys] = await this.redisClient.scan(
          cursor,
          'MATCH',
          prefix,
          'COUNT',
          100,
        );
        cursor = nextCursor;

        if (keys.length > 0) {
          await this.redisClient.del(...keys);
          keysDeleted += keys.length;
        }
      } while (cursor !== '0');

      if (keysDeleted > 0) {
        this.logger.log(
          `Cache DEL (Prefixo) → ${keysDeleted} chaves apagadas (${prefix})`,
        );
      }
    } catch (err) {
      this.handleError('deletar por prefixo', prefix, err);
    }
  }

  /**
   * Registra falhas do cache sem interromper a operação principal da aplicação.
   */
  private handleError(operation: string, key: string, error: unknown): void {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    this.logger.error(`Erro ao ${operation} (${key}): ${errorMessage}`);
  }
}
