import { removerParametrosVazios } from "@/app/services/utils/queryParams";
import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./apiClient";

type ParametrosRequisicao = Record<
  string,
  string | number | boolean | null | undefined
>;

export abstract class ServicoApiBase {
  protected async buscar<TResposta>(
    url: string,
    parametros?: ParametrosRequisicao,
    config?: AxiosRequestConfig,
  ) {
    const response = await apiClient.get<TResposta>(url, {
      ...config,
      params: parametros ? removerParametrosVazios(parametros) : undefined,
    });

    return response.data;
  }

  protected async criar<TResposta, TDados = unknown>(
    url: string,
    dados?: TDados,
    config?: AxiosRequestConfig,
  ) {
    const response = await apiClient.post<TResposta>(url, dados, config);

    return response.data;
  }

  protected async atualizar<TResposta, TDados = unknown>(
    url: string,
    dados?: TDados,
    config?: AxiosRequestConfig,
  ) {
    const response = await apiClient.patch<TResposta>(url, dados, config);

    return response.data;
  }

  protected async remover<TResposta = void>(
    url: string,
    config?: AxiosRequestConfig,
  ) {
    const response = await apiClient.delete<TResposta>(url, config);

    return response.data;
  }
}
