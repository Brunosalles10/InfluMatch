import type {
  ParametrosPaginacao,
  RespostaPaginada,
} from "@/app/types/api.types";
import type { Usuario } from "@/app/types/usuario.types";
import { ServicoApiBase } from "../api/ServicoApiBase";

export type AtualizarUsuarioAdminDto = {
  nome?: string;
  email?: string;
  role?: Usuario["role"];
};

class AdminUsuariosService extends ServicoApiBase {
  async listarUsuarios(filtros: ParametrosPaginacao = {}) {
    return this.buscar<RespostaPaginada<Usuario>>("/users", filtros);
  }

  async atualizarUsuario(id: string, dados: AtualizarUsuarioAdminDto) {
    return this.atualizar<Usuario, AtualizarUsuarioAdminDto>(
      `/users/${id}`,
      dados,
    );
  }

  async deletarUsuario(id: string) {
    return this.remover<void>(`/users/${id}`);
  }
}

export const adminUsuariosService = new AdminUsuariosService();
