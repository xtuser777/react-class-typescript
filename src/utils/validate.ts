import isEmail from 'validator/lib/isEmail';
import { ICity } from '../models/City';
import { IContact } from '../models/Contact';
import { EnterprisePerson, IEnterprisePerson } from '../models/EnterprisePerson';
import { IIndividualPerson, IndividualPerson } from '../models/IndividualPerson';
import { IEmployee } from '../models/Employee';
import { ILevel, Level } from '../models/Level';
import { IPerson } from '../models/Person';

export const validateCpf = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf === '') {
    return false;
  }
  // Elimina CPFs invalidos conhecidos
  if (
    cpf.length !== 11 ||
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  ) {
    return false;
  }
  // Valida 1o digito
  let add = 0;
  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== parseInt(cpf.charAt(9))) {
    return false;
  }
  // Valida 2o digito
  add = 0;
  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }

  return rev === parseInt(cpf.charAt(10));
};

export const validateCnpj = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj === '') return false;

  if (cnpj.length !== 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999'
  )
    return false;

  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado.toString().charAt(0) !== digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado.toString().charAt(0) !== digitos.charAt(1)) return false;

  return true;
};

export const validate = {
  person: {
    individual: {
      name: (value: string, person: IPerson) => {
        if (value.length == 0) {
          return {
            message: 'O nome precisa ser preenchido',
            isValid: false,
          };
        } else if (value.length < 3) {
          return {
            message: 'O nome preenchido é inválido',
            isValid: false,
          };
        } else {
          if (!person.individual) person.individual = new IndividualPerson().toAttributes;
          person.individual.name = value;
          return {
            message: undefined,
            isValid: true,
          };
        }
      },
      cpf: async (
        value: string,
        person: IPerson,
        verifyCpf?: (cpf: string) => Promise<boolean>,
      ) => {
        if (value.length == 0) {
          return {
            message: 'O CPF precisa ser preenchido',
            isValid: false,
          };
        } else if (!validateCpf(value)) {
          return {
            message: 'O CPF preenchido é inválido',
            isValid: false,
          };
        } else if (!!verifyCpf && (await verifyCpf(value))) {
          return {
            message: 'O CPF preenchido já existe no cadastro',
            isValid: false,
          };
        } else {
          if (!person.individual) person.individual = new IndividualPerson().toAttributes;
          person.individual.cpf = value;
          return {
            message: undefined,
            isValid: true,
          };
        }
      },
      birth: (value: string, person: IPerson) => {
        const date = new Date(value);
        if (value.length == 0) {
          return {
            message: 'A data precisa ser preenchida',
            isValid: false,
          };
        } else if (new Date(Date.now()).getFullYear() - date.getFullYear() < 18) {
          return {
            message: 'A data preenchida é inválida',
            isValid: false,
          };
        } else {
          if (!person.individual) person.individual = new IndividualPerson();
          person.individual.birth = value;
          return {
            message: undefined,
            isValid: true,
          };
        }
      },
    },
    enterprise: {
      corporateName: (value: string, person: IPerson) => {
        if (value.length == 0) {
          return {
            message: 'A razão social precisa ser preenchida.',
            isValid: false,
          };
        } else if (value.length < 5) {
          return {
            message: 'A razão social inválida.',
            isValid: false,
          };
        } else {
          if (!person.enterprise) person.enterprise = new EnterprisePerson().toAttributes;
          person.enterprise.corporateName = value;
          return {
            message: undefined,
            isValid: true,
          };
        }
      },
      fantasyName: (value: string, person: IPerson) => {
        if (value.length == 0) {
          return {
            message: 'O nome fantasia precisa ser preenchido.',
            isValid: false,
          };
        } else {
          if (!person.enterprise) person.enterprise = new EnterprisePerson().toAttributes;
          person.enterprise.fantasyName = value;
          return {
            message: undefined,
            isValid: true,
          };
        }
      },
      cnpj: (value: string, person: IPerson) => {
        if (value.length == 0) {
          return {
            message: 'O CNPJ precisa ser preenchido.',
            isValid: false,
          };
        } else if (!validateCnpj(value)) {
          return {
            message: 'O CNPJ preenchido é inválido.',
            isValid: false,
          };
        } else {
          if (!person.enterprise) person.enterprise = new EnterprisePerson().toAttributes;
          person.enterprise.cnpj = value;
          return {
            message: undefined,
            isValid: true,
          };
        }
      },
    },
  },
  contact: {
    street: (value: string, contact: IContact) => {
      if (value.length == 0) {
        return {
          message: 'A rua precisa ser preenchida',
          isValid: false,
        };
      } else {
        contact.address.street = value;
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
    number: (value: string, contact: IContact) => {
      if (value.length == 0) {
        return {
          message: 'O número precisa ser preenchido',
          isValid: false,
        };
      } else {
        contact.address.number = value;
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
    neighborhood: (value: string, contact: IContact) => {
      if (value.length == 0) {
        return {
          message: 'O bairro precisa ser preenchido',
          isValid: false,
        };
      } else {
        contact.address.neighborhood = value;
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
    code: (value: string, contact: IContact) => {
      if (value.length == 0) {
        return {
          message: 'O CEP precisa ser preenchido',
          isValid: false,
        };
      } else if (value.length < 10) {
        return {
          message: 'O CEP preenchido é inválido',
          isValid: false,
        };
      } else {
        contact.address.code = value;
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
    state: (value: string) => {
      if (value == '0') {
        return {
          message: 'O Estado precisa ser selecionado',
          isValid: false,
        };
      } else {
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
    city: (value: string, contact: IContact, cities: ICity[]) => {
      if (value == '0') {
        return {
          message: 'A cidade precisa ser selecionada',
          isValid: false,
        };
      } else {
        contact.address.city = cities.find((item) => item.id == Number(value)) as ICity;
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
    phone: (value: string, contact: IContact) => {
      if (value.length == 0) {
        return {
          message: 'O telefone precisa ser preenchido',
          isValid: false,
        };
      } else if (value.length < 14) {
        return {
          message: 'O telefone preenchido é inválido',
          isValid: false,
        };
      } else {
        contact.phone = value;
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
    cellphone: (value: string, contact: IContact) => {
      if (value.length == 0) {
        return {
          message: 'O celular precisa ser preenchido',
          isValid: false,
        };
      } else if (value.length < 15) {
        return {
          message: 'O celular preenchido é inválido',
          isValid: false,
        };
      } else {
        contact.cellphone = value;
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
    email: (value: string, contact: IContact) => {
      if (value.length == 0) {
        return {
          message: 'O e-mail precisa ser preenchido',
          isValid: false,
        };
      } else if (!isEmail(value)) {
        return {
          message: 'O e-mail preenchido é inválido',
          isValid: false,
        };
      } else {
        contact.email = value;
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
  },
  auth: {
    level: async (
      value: string,
      verifyAdmin: () => Promise<boolean>,
      levels: ILevel[],
      employee: IEmployee,
    ) => {
      if (value == '0') {
        return {
          message: 'O nível de usuário precisa ser selecionado.',
          isValid: false,
        };
      } else if ((await verifyAdmin()) && value != '1') {
        return {
          message: 'O não é permitido alterar o último administrador.',
          isValid: false,
        };
      } else {
        employee.level = (
          levels.find((item) => item.id == Number(value)) as Level
        ).toAttributes;
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
    login: async (
      value: string,
      vefifyLogin: (login: string) => Promise<boolean>,
      employee: IEmployee,
    ) => {
      if (value.length == 0) {
        return {
          message: 'O login precisa ser preenchido',
          isValid: false,
        };
      } else if (await vefifyLogin(value)) {
        return {
          message: 'O login já exite no cadastro',
          isValid: false,
        };
      } else {
        employee.login = value;
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
    password: (value: string, employee: IEmployee) => {
      if (value.length == 0) {
        return {
          message: 'A senha precisa ser preenchida',
          isValid: false,
        };
      } else if (value.length < 6) {
        return {
          message: 'A senha preenchida tem tamanho inválido',
          isValid: false,
        };
      } else {
        employee.password = value;
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
    passwordConfirm: (value: string, password: string) => {
      if (value.length == 0) {
        return {
          message: 'A senha de confirmação precisa ser preenchida',
          isValid: false,
        };
      } else if (value.length < 6) {
        return {
          message: 'A senha preenchida tem tamanho inválido',
          isValid: false,
        };
      } else if (value != password)
        return {
          message: 'A senha preenchida tem tamanho inválido',
          isValid: false,
        };
      else {
        return {
          message: undefined,
          isValid: true,
        };
      }
    },
  },
};
