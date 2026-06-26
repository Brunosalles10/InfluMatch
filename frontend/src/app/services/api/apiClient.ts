import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import {
  obterTokenAutenticacao,
  removerTokenAutenticacao,
} from "@/app/services/utils/authStorage";
import type { ErroBackend } from "@/app/types/api.types";
import { emitirEventoSessaoExpirada } from "@/app/utils/eventosAutenticacao";
import type { AxiosResponse } from "axios";
import { ErroApi } from "./ErroApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TEMPO_LIMITE_REQUISICAO_MS = 15000;

if (!API_BASE_URL) {
  throw new Error("Variável VITE_API_BASE_URL não foi configurada.");
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TEMPO_LIMITE_REQUISICAO_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Adiciona o token JWT no header Authorization quando o usuário está autenticado.
 */
function adicionarTokenAutenticacao(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = obterTokenAutenticacao();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

/**
 * Retorna a resposta da API sem alteração quando a requisição foi bem-sucedida.
 */
function tratarRespostaComSucesso<T>(
  response: AxiosResponse<T>,
): AxiosResponse<T> {
  return response;
}

/**
 * Converte erros do Axios em ErroApi, padronizando o tratamento no frontend.
 */
function tratarErroResposta(erro: AxiosError<ErroBackend>): Promise<never> {
  const statusCode = erro.response?.status;
  const dadosErro = erro.response?.data;
  const haviaToken = Boolean(obterTokenAutenticacao());

  if (sessaoExpirou(statusCode, haviaToken)) {
    removerTokenAutenticacao();
    emitirEventoSessaoExpirada();
  }

  const mensagens = normalizarMensagensErro(dadosErro?.message);
  const mensagem = obterMensagemPrincipalErro({
    mensagens,
    erroBackend: dadosErro,
    statusCode,
  });

  return Promise.reject(new ErroApi(mensagem, statusCode, mensagens));
}

/**
 * Verifica se a API retornou 401 para uma sessão que tinha token salvo.
 */
function sessaoExpirou(
  statusCode: number | undefined,
  haviaToken: boolean,
): boolean {
  return statusCode === 401 && haviaToken;
}

/**
 * Normaliza o campo message do backend para sempre trabalhar com uma lista.
 */
function normalizarMensagensErro(message: ErroBackend["message"]): string[] {
  if (Array.isArray(message)) {
    return message;
  }

  if (typeof message === "string") {
    return [message];
  }

  return [];
}

type ObterMensagemPrincipalErroParams = {
  mensagens: string[];
  erroBackend?: ErroBackend;
  statusCode?: number;
};

/**
 * Define a mensagem principal exibida ao usuário, priorizando mensagens específicas da API.
 */
function obterMensagemPrincipalErro({
  mensagens,
  erroBackend,
  statusCode,
}: ObterMensagemPrincipalErroParams): string {
  return (
    mensagens[0] ??
    erroBackend?.error ??
    obterMensagemErroPorStatus(statusCode) ??
    "Ocorreu um erro inesperado."
  );
}

/**
 * Retorna uma mensagem amigável para erros HTTP conhecidos.
 */
function obterMensagemErroPorStatus(statusCode?: number): string | undefined {
  switch (statusCode) {
    case 400:
      return "Dados inválidos. Verifique as informações enviadas.";
    case 401:
      return "Sua sessão expirou. Faça login novamente.";
    case 403:
      return "Você não tem permissão para acessar este recurso.";
    case 404:
      return "Recurso não encontrado.";
    case 409:
      return "Já existe um registro com essas informações.";
    case 500:
      return "Erro interno no servidor.";
    default:
      return undefined;
  }
}

/**
 * Interceptor executado antes de cada requisição.
 */
apiClient.interceptors.request.use(adicionarTokenAutenticacao);

/**
 * Interceptor executado depois de cada resposta da API.
 */
apiClient.interceptors.response.use(
  tratarRespostaComSucesso,
  tratarErroResposta,
);
