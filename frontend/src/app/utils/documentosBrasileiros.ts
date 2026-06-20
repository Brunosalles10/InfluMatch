export function removerMascaraNumerica(valor: unknown): string {
  if (valor === undefined || valor === null) {
    return "";
  }

  return String(valor).replace(/\D/g, "");
}

function todosDigitosIguais(valor: string): boolean {
  return /^(\d)\1+$/.test(valor);
}

export function validarCpf(valor: string): boolean {
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

  return (
    calcularDigito(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
    calcularDigito(cpf.slice(0, 10), 11) === Number(cpf[10])
  );
}

export function validarCnpj(valor: string): boolean {
  const cnpj = removerMascaraNumerica(valor);

  if (cnpj.length !== 14 || todosDigitosIguais(cnpj)) {
    return false;
  }

  const calcularDigito = (base: string, pesos: number[]) => {
    const soma = base.split("").reduce((total, digito, index) => {
      return total + Number(digito) * pesos[index];
    }, 0);

    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
  };

  return (
    calcularDigito(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) ===
      Number(cnpj[12]) &&
    calcularDigito(
      cnpj.slice(0, 13),
      [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    ) === Number(cnpj[13])
  );
}

export function validarTelefone(valor: string): boolean {
  const telefone = removerMascaraNumerica(valor);

  return telefone.length === 10 || telefone.length === 11;
}

export function validarCep(valor: string): boolean {
  return removerMascaraNumerica(valor).length === 8;
}

export function converterDataBrasileiraParaIso(valor: unknown): string {
  const numeros = removerMascaraNumerica(valor);

  if (numeros.length !== 8) {
    return String(valor ?? "");
  }

  const dia = numeros.slice(0, 2);
  const mes = numeros.slice(2, 4);
  const ano = numeros.slice(4, 8);

  return `${ano}-${mes}-${dia}`;
}

export function validarDataIso(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false;
  }

  const [ano, mes, dia] = valor.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);

  return (
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia
  );
}

export function validarDataAtualOuFuturaIso(valor: string): boolean {
  if (!validarDataIso(valor)) {
    return false;
  }

  const [ano, mes, dia] = valor.split("-").map(Number);
  const dataInformada = new Date(ano, mes - 1, dia);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return dataInformada >= hoje;
}

export function formatarDataHoraBrasileira(valor: string): string {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Não disponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}
