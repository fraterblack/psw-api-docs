import { isPlainObject, mapValues } from 'lodash';

/**
 * Recursively map values from an object
 * @param obj
 * @param cb
 * @param isRecursive
 */
const mapValuesDeep = (obj: object, cb: any, isRecursive?: boolean) => {
  if (!obj && !isRecursive) {
    return {};
  }

  if (!isRecursive) {
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return {};
    }
  }

  if (Array.isArray(obj)) {
    return obj.map(item => mapValuesDeep(item, cb, true));
  }

  if (!isPlainObject(obj)) {
    return obj;
  }

  const result = mapValues(obj, cb);

  return mapValues(result, value =>
    mapValuesDeep(value, cb, true)
  );
};

export default mapValuesDeep;
