import dayjs from 'dayjs';
import { difference, get, has, isArray, isFunction, isPlainObject, isString, omit, pick, set, uniq, unset } from 'lodash';

export interface PickOption {
  pick?: string[];
  ignore?: string[];
}

export interface PropertyToCheckParams {
  name: string;
  type?: 'date' | 'boolean' | 'object';
  propertiesToCheck?: PropertyToCheckParams[];
}

export class ObjectHelper {
  /**
   * Map Object values
   *
   * @param object - Object with values. Can contains nested objects
   * @param pickList - Array or PickOption with path of attributes to be picked or rejected. When empty pick all
   * @param mapping - Custom mapping. { [attribute name path]: [new attribute name path] }.
   * @param format - Formatter. { [attribute name path]: Formatter function }.
   * @returns Object with attributes
   */
  static mapObjectValues(
    object: {},
    pickList?: string[] | PickOption,
    mapping = {},
    format: {
      [propName: string]: CallableFunction | Array<CallableFunction>,
    } = {}
  ): {} {
    // Map values
    if (mapping) {
      ObjectHelper.renameObjectProperties(object, mapping);
    }

    // If pickList is present, pick or omit values
    if (pickList) {
      const propertiesToPick = isArray(pickList) ? pickList : pickList.pick;
      const propertiesToIgnore = !isArray(pickList) ? pickList.ignore : null;

      if (propertiesToPick && propertiesToPick.length) {
        object = pick(object, ObjectHelper.parsePaths(object, propertiesToPick));
      }

      if (propertiesToIgnore && propertiesToIgnore.length) {
        object = omit(object, ObjectHelper.parsePaths(object, propertiesToIgnore));
      }
    }

    if (format) {
      ObjectHelper.formatObjectValues(object, format);
    }

    return object;
  }

  /**
   * Based given mapping, rename object properties
   * @param valuesObject
   * @param mapping
   */
  static renameObjectProperties(valuesObject: {}, mapping = {}) {
    for (const path in mapping) {
      if (mapping.hasOwnProperty(path)) {
        const arrayBracketsPosition = path.indexOf('[*]');

        if (arrayBracketsPosition > -1) {
          const intermediaryPath = path.substr(0, arrayBracketsPosition);

          if (has(valuesObject, intermediaryPath)) {
            const value: any = get(valuesObject, intermediaryPath);

            if (value instanceof Array && value.length) {
              const newMapping = [];

              for (let index = 0; index < value.length; index++) {
                const newPath = path.replace('[*]', `[${index}]`);
                const newTarget = mapping[path].replace('[*]', `[${index}]`);
                newMapping[newPath] = newTarget;
              }

              // Delete path with [*]
              unset(mapping, path);

              ObjectHelper.renameObjectProperties(valuesObject, newMapping);
            }
          }

        } else {
          if (has(valuesObject, path)) {
            // Get value of path
            const value = get(valuesObject, path);
            // Remove existent path
            if (unset(valuesObject, path)) {
              // Create new path
              set(valuesObject, mapping[path], value);
            }
          }
        }
      }
    }
  }

  /**
   * Based given formatters, format values of object
   * @param valuesObject
   * @param format
   */
  static formatObjectValues(valuesObject: {}, format = {}) {
    for (const path in format) {
      if (format.hasOwnProperty(path)) {
        const arrayBracketsPosition = path.indexOf('[*]');

        if (arrayBracketsPosition > -1) {
          const intermediaryPath = path.substr(0, arrayBracketsPosition);

          if (has(valuesObject, intermediaryPath)) {
            const value: any = get(valuesObject, intermediaryPath);

            if (value instanceof Array && value.length) {
              const newMapping = [];

              for (let index = 0; index < value.length; index++) {
                const newPath = path.replace('[*]', `[${index}]`);
                newMapping[newPath] = format[path];
              }

              // Delete path with [*]
              unset(format, path);

              ObjectHelper.formatObjectValues(valuesObject, newMapping);
            }
          }
        } else {
          if (has(valuesObject, path)) {
            // Get value of path
            let value: any = get(valuesObject, path);

            // Call formatter function passing value to be be formatted
            if (isArray(format[path])) {
              for (const formatter of format[path]) {
                value = formatter(value);
                set(valuesObject, path, value);
              }
            } else if (isFunction(format[path])) {
              set(valuesObject, path, format[path](value));
            }
          }
        }
      }
    }
  }

  static hasChanges(obj1: any, obj2: any, propertiesToCheck: PropertyToCheckParams[]): boolean {
    if (!propertiesToCheck) {
      const keys = uniq([...Object.keys(obj1), ...Object.keys(obj2)]);
      if (keys.some(k => {
        if (isArray(obj1[k]) && isArray(obj2[k])) {
          return difference(obj1[k], obj2[k]).length;
        }
        return obj1[k] !== obj2[k];
      })) {
        return true;
      }

      return false;
    }

    for (const property of propertiesToCheck) {
      switch (property.type) {
        case 'date':
          if (dayjs(obj1[property.name]).format('YYYY-MM-DD') !== dayjs(obj2[property.name]).format('YYYY-MM-DD')) {
            return true;
          }
          break;
        case 'boolean':
          if (!!obj1[property.name] !== !!obj2[property.name]) {
            return true;
          }
          break;
        case 'object':
          if (ObjectHelper.hasChanges(obj1[property.name], obj2[property.name], property.propertiesToCheck)) {
            return true;
          }
          break;
        default:
          if ((obj1 && !obj2) || (!obj1 && obj2) || (obj1 && obj2 && obj1[property.name] !== obj2[property.name])) {
            return true;
          }
          break;
      }
    }

    return false;
  }

  static parse(value: any): any {
    if (!value) {
      return {};
    }

    if (isString(value)) {
      try {
        return JSON.parse(value);
      } catch (error) {
        throw new Error('The value could not be parsed. Json string is invalid');
      }
    }

    if (isPlainObject(value)) {
      return value;
    }

    throw new Error('The value could not be parsed. Only Json string are accepted as value');
  }

  private static parsePaths(valuesObject: {}, paths: string[]): string[] {
    let mappedPaths = [];

    for (const path of paths) {
      const arrayBracketsPosition = path.indexOf('[*]');

      if (arrayBracketsPosition > -1) {
        const intermediaryPath = path.substr(0, arrayBracketsPosition);

        if (has(valuesObject, intermediaryPath)) {
          const value: any = get(valuesObject, intermediaryPath);

          if (value instanceof Array && value.length) {
            const intermediaryPaths = [];
            for (let index = 0; index < value.length; index++) {
              const newPath = path.replace('[*]', `[${index}]`);
              intermediaryPaths.push(newPath);
            }

            mappedPaths = [...mappedPaths, ...ObjectHelper.parsePaths(valuesObject, intermediaryPaths)];
          }
        }
      } else {
        mappedPaths.push(path);
      }
    }

    return mappedPaths;
  }
}
