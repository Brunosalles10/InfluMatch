const CHAVE_TOKEN = "@influmatch:token";

export function salvarTokenAutenticacao(token: string) {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function obterTokenAutenticacao() {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function removerTokenAutenticacao() {
  localStorage.removeItem(CHAVE_TOKEN);
}

export function existeTokenAutenticacao() {
  return Boolean(obterTokenAutenticacao());
}
