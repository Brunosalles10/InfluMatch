const EVENTO_SESSAO_EXPIRADA = "influmatch:sessao-expirada";

export function emitirEventoSessaoExpirada() {
  window.dispatchEvent(new Event(EVENTO_SESSAO_EXPIRADA));
}

export function ouvirEventoSessaoExpirada(callback: () => void) {
  window.addEventListener(EVENTO_SESSAO_EXPIRADA, callback);

  return () => {
    window.removeEventListener(EVENTO_SESSAO_EXPIRADA, callback);
  };
}
