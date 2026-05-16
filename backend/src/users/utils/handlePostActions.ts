import { Injectable, Logger } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { CacheService } from '../../redis/cache.service';
import { PubSubService } from '../../redis/pubsub.service';

interface DeletePayload {
  id: string;
}

// Garante que nunca envie os dados sensíveis
type ActionPayload = Omit<Usuario, 'senha'> | DeletePayload;

@Injectable()
export class HandlePostActionsUtil {
  private readonly logger = new Logger(HandlePostActionsUtil.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly pubSubService: PubSubService,
  ) {}

  async execute(
    data: Usuario | DeletePayload,
    action: 'created' | 'updated' | 'deleted',
  ): Promise<void> {
    // Limpa caches
    await this.clearCaches(data);

    // Publica evento
    const topic = `usuario.${action}`;
    const payload = this.buildPayload(data, action);
    await this.pubSubService.publish(topic, payload);

    this.logger.log(`Cache limpo e evento ${topic} disparado.`);
  }

  private async clearCaches(data: Usuario | DeletePayload): Promise<void> {
    const cacheKeysList = 'usuarios:all';
    const cacheKeySpecific = `usuario:${data.id}`;

    const promises = [
      this.cacheService.del(cacheKeysList),
      this.cacheService.del(cacheKeySpecific),
    ];
    await Promise.all(promises);

    this.logger.debug(
      ` Caches deletados: "${cacheKeysList}", "${cacheKeySpecific}"`,
    );
  }

  // Constrói o payload para publicação
  private buildPayload(
    data: Usuario | DeletePayload,
    action: string,
  ): ActionPayload {
    if (action === 'deleted') {
      return data as DeletePayload;
    }

    const { senha, ...payload } = data as Usuario;
    return payload;
  }
}
