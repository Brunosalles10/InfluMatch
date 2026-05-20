import { Injectable, Logger } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { CacheService } from '../../redis/cache.service';

interface DeletePayload {
  id: string;
}

@Injectable()
export class HandlePostActionsUtil {
  private readonly logger = new Logger(HandlePostActionsUtil.name);

  constructor(private readonly cacheService: CacheService) {}

  async execute(
    data: Usuario | DeletePayload,
    action: 'created' | 'updated' | 'deleted',
  ): Promise<void> {
    // Invalida os caches antigos para que a próxima requisição busque dados frescos
    await this.clearCaches(data);

    // Como estamos no padrão MVC, no futuro você pode usar o @nestjs/event-emitter aqui
    // para tarefas em background (como enviar email) sem precisar do Pub/Sub.
    this.logger.log(`Ação '${action}' concluída. Cache sincronizado.`);
  }

  private async clearCaches(data: Usuario | DeletePayload): Promise<void> {
    const cacheKeySpecific = `usuario:${data.id}`;

    //  Deleta o cache específico deste usuário
    await this.cacheService.del(cacheKeySpecific);

    //  Deleta TODAS as páginas de cache da listagem de usuários.
    await this.cacheService.deleteByPrefix('usuarios:page:*');

    this.logger.debug(`Caches invalidados para o usuário ID: ${data.id}`);
  }
}
