import { toNumber as lodashToNumber } from 'lodash';

export const toNumber = (value: any): number => {
  if (!value && value !== 0 && value !== '0') {
    return null;
  }

  return lodashToNumber(value);
};
