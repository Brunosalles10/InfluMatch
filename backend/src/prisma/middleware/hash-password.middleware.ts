import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const hashPasswordMiddleware: Prisma.Middleware = async (
  params,
  next,
) => {
  // Verifica se é operação no modelo Usuario E se é create ou update
  if (
    params.model === 'Usuario' &&
    ['create', 'update'].includes(params.action)
  ) {
    const senha = params.args.data.senha;

    // Verifica se a senha foi fornecida E não foi já criptografada
    if (senha && typeof senha === 'string' && !senha.startsWith('$2b$')) {
      // Criptografa com bcrypt (salt rounds = 10)
      const senhaHash = await bcrypt.hash(senha, 10);
      params.args.data.senha = senhaHash;
    }
  }

  // Passa para o próximo middleware ou operação
  return next(params);
};
