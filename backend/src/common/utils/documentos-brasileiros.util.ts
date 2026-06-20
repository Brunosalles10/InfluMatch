export function removerMascaraNumerica(valor: unknown): string {
  if (valor === undefined || valor === null) {
    return '';
  }

  return String(valor).replace(/\D/g, '');
}

function todosDigitosIguais(valor: string): boolean {
  return /^(\d)\1+$/.test(valor);
}

export function cpfValido(valor: string): boolean {
  const cpf = removerMascaraNumerica(valor);

  if (cpf.length !== 11 || todosDigitosIguais(cpf)) {
    return false;
  }

  const calcularDigito = (base: string, fatorInicial: number) => {
    let soma = 0;

    for (let i = 0; i < base.length; i += 1) {
      soma += Number(base[i]) * (fatorInicial - i);
    }

    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiroDigito = calcularDigito(cpf.slice(0, 9), 10);
  const segundoDigito = calcularDigito(cpf.slice(0, 10), 11);

  return primeiroDigito === Number(cpf[9]) && segundoDigito === Number(cpf[10]);
}

export function cnpjValido(valor: string): boolean {
  const cnpj = removerMascaraNumerica(valor);

  if (cnpj.length !== 14 || todosDigitosIguais(cnpj)) {
    return false;
  }

  const calcularDigito = (base: string, pesos: number[]) => {
    const soma = base.split('').reduce((total, digito, index) => {
      return total + Number(digito) * pesos[index];
    }, 0);

    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiroDigito = calcularDigito(
    cnpj.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  const segundoDigito = calcularDigito(
    cnpj.slice(0, 13),
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return (
    primeiroDigito === Number(cnpj[12]) && segundoDigito === Number(cnpj[13])
  );
}
