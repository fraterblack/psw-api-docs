import { toNumber } from 'lodash';

export const toStringNumber = (value: number): string => {
  if (!value && value !== 0) {
    return null;
  }

  return toNumber(value).toString().replace('.', ',');
};
