import dayjs from 'dayjs';
import { isString } from 'lodash';

export const toShortIsoDate = (value: any): string => {
  if (value && value instanceof Date) {
    return dayjs(value).format('YYYY-MM-DD');

  } else if (value && isString(value)) {
    return dayjs(value, 'DD/MM/YYYY').format('YYYY-MM-DD');

  } else {
    return value ? dayjs(value).format('YYYY-MM-DD') : null;
  }
};
