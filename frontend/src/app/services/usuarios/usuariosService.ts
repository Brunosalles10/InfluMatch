import type { AlterarSenhaDto } from "@/app/types/auth.types";
import type { Usuario } from "@/app/types/usuario.types";
import { ServicoApiBase } from "../api/ServicoApiBase";

export type AtualizarMinhaContaDto = {
  nome?: string;
  email?: string;
};

class UsuariosService extends ServicoApiBase {
  async buscarMeuPerfil() {
    return this.buscar<Usuario>("/users/profile");
  }

  async atualizarMinhaConta(dados: AtualizarMinhaContaDto) {
    return this.atualizar<Usuario, AtualizarMinhaContaDto>("/users/me", dados);
  }

  async alterarMinhaSenha(dados: AlterarSenhaDto) {
    return this.atualizar<void, AlterarSenhaDto>("/users/me/password", dados);
  }

  async deletarMinhaConta() {
    return this.remover<void>("/users/me");
  }
}

export const usuariosService = new UsuariosService();
