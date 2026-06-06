import type {
  CadastroUsuarioDto,
  LoginDto,
  RespostaLogin,
} from "@/app/services/types/auth.types";
import type { Usuario } from "@/app/services/types/usuario.types";
import {
  removerTokenAutenticacao,
  salvarTokenAutenticacao,
} from "@/app/services/utils/authStorage";
import { ErroApi } from "../api/ErroApi";
import { ServicoApiBase } from "../api/ServicoApiBase";

class AuthService extends ServicoApiBase {
  async login(dados: LoginDto) {
    const resposta = await this.criar<RespostaLogin, LoginDto>(
      "/auth/login",
      dados,
    );

    const token = this.extrairToken(resposta);

    salvarTokenAutenticacao(token);

    return resposta;
  }

  async cadastrar(dados: CadastroUsuarioDto) {
    return this.criar<Usuario, CadastroUsuarioDto>("/users", dados);
  }

  logout() {
    removerTokenAutenticacao();
  }

  private extrairToken(resposta: RespostaLogin) {
    const token =
      resposta.access_token ?? resposta.accessToken ?? resposta.token;

    if (!token) {
      throw new ErroApi(
        "Token de autenticação não encontrado na resposta do login.",
        500,
      );
    }

    return token;
  }
}

export const authService = new AuthService();
