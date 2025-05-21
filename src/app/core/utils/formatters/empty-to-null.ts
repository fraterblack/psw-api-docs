import { isNumber } from 'lodash';

export const emptyToNull = (value: any): any => {
  return !value && !isNumber(value) ? null : value;
};
