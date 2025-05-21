import { isEmpty } from 'lodash';

/**
 * Recursively remove keys from an object
 *
 * @param {object} input
 * @param {Array<number | string>>} excludes
 * @param {boolean} deleteEmpty
 * @return {object}
 */
const omitDeep = (input: object, excludes: Array<number | string>, deleteEmpty = false): object => {
  return Object.entries(input || {}).reduce((nextInput, [key, value]) => {
    const shouldExclude = excludes.includes(key);
    if (shouldExclude) { return nextInput; }

    if (Array.isArray(value)) {
      const arrValue = value;
      const nextValue = arrValue.map((arrItem) => {
        if (typeof arrItem === 'object') {
          return omitDeep(arrItem, excludes);
        }
        return arrItem;
      });
      nextInput[key] = nextValue;
      return nextInput;
    } else if (typeof value === 'object') {
      nextInput[key] = omitDeep(value, excludes);

      // If empty object, delete it
      if (deleteEmpty && nextInput[key] && isEmpty(nextInput[key])) {
        delete nextInput[key];
      }

      return nextInput;
    }

    nextInput[key] = value;

    return nextInput;
  }, {});
};

export default omitDeep;
