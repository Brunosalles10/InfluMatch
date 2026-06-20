import {
  ValidateBy,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';
import { cnpjValido, cpfValido } from '../utils/documentos-brasileiros.util';

type ObjetoComTipoDocumento = {
  tipoDocumento?: unknown;
};

export function IsDocumentoBrasileiroValido(
  validationOptions?: ValidationOptions,
) {
  return ValidateBy(
    {
      name: 'isDocumentoBrasileiroValido',
      validator: {
        validate: (value: unknown, args?: ValidationArguments) => {
          if (typeof value !== 'string') {
            return false;
          }

          const objeto = args?.object as ObjetoComTipoDocumento;
          const tipoDocumento = objeto.tipoDocumento;

          if (tipoDocumento === 'CPF') {
            return cpfValido(value);
          }

          if (tipoDocumento === 'CNPJ') {
            return cnpjValido(value);
          }

          return false;
        },
      },
    },
    validationOptions,
  );
}
