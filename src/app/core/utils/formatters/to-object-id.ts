import { isArray } from 'lodash';

export const toObjectId = (value: any): any => {
  if (isArray(value)) {
    return value.map(x => toObjectId(x));
  }

  return {
    id: value?.id,
  };
};
