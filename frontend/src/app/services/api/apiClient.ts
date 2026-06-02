import type { ErroBackend } from "@/app/services/types/api.types";
import {
  obterTokenAutenticacao,
  removerTokenAutenticacao,
} from "@/app/services/utils/authStorage";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ErroApi } from "./ErroApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Variável VITE_API_BASE_URL não foi configurada.");
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = obterTokenAutenticacao();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (erro: AxiosError<ErroBackend>) => {
    const statusCode = erro.response?.status;
    const dadosErro = erro.response?.data;

    if (statusCode === 401) {
      removerTokenAutenticacao();
    }

    const mensagens = normalizarMensagensErro(dadosErro?.message);

    const mensagem =
      mensagens[0] ??
      dadosErro?.error ??
      obterMensagemErroPorStatus(statusCode) ??
      "Ocorreu um erro inesperado.";

    return Promise.reject(new ErroApi(mensagem, statusCode, mensagens));
  },
);

function normalizarMensagensErro(message: ErroBackend["message"]) {
  if (Array.isArray(message)) {
    return message;
  }

  if (typeof message === "string") {
    return [message];
  }

  return [];
}

function obterMensagemErroPorStatus(statusCode?: number) {
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
