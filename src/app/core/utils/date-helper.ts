import dayjs from 'dayjs';
import { isDate } from 'lodash';

export class DateHelper {
  /**
   * Parse Date attribute of object to Date ISO string
   *
   * @param {{}} obj
   * @param {string[]} properties Properties to be transformed. Empty transform all
   * @returns
   * @memberof ApiService
   */
  static transformDatesToDateIsoString(obj: {}, properties: string[] = []) {
    for (const propName in obj) {
      if (obj.hasOwnProperty(propName)) {
        if (!properties.length || properties.includes(propName)) {
          if (obj[propName] instanceof Date) {
            obj[propName] = dayjs(obj[propName]).toISOString();
          }
        }
      }
    }

    return obj;
  }

  /**
   * Parse Date attribute of object to Date Only string
   *
   * @param {{}} obj
   * @param {string[]} properties Properties to be transformed. Empty transform all
   * @returns
   * @deprecated Use formatter instead
   */
  static transformDatesToDateOnlyString(obj: {}, properties: string[] = []) {
    for (const propName in obj) {
      if (obj.hasOwnProperty(propName)) {
        if (!properties.length || properties.includes(propName)) {
          if (obj[propName] instanceof Date) {
            obj[propName] = dayjs(obj[propName]).format('YYYY-MM-DD');
          }
        }
      }
    }

    return obj;
  }

  /**
   * Parse date ISO string attribute of object to Date
   *
   * @template T
   * @param {{}} obj
   * @param {boolean} recursively
   * @param {string[]} properties Properties to be transformed. Empty transform all
   * @param {string} path Path to property when using recursevely
   * @returns {T}
   * @deprecated Use formatter instead
   */
  static transformDatesIsoStringToDate<T>(obj: {}, recursively = false, properties: string[] = [], path = ''): T {
    for (const propName in obj) {
      if (obj.hasOwnProperty(propName)) {
        if (recursively && typeof obj[propName] === 'object') {
          DateHelper.transformDatesIsoStringToDate(obj[propName], recursively, properties, path ? `${path}.${propName}` : propName);
        }

        if ((!properties.length || properties.includes(path ? `${path}.${propName}` : propName)) && typeof obj[propName] === 'string') {
          const isDate = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/.test(obj[propName]);
          const isDateOnly = /\d{4}-[01]\d-[0-3]\d/.test(obj[propName]);

          if (isDate || isDateOnly) {
            obj[propName] = dayjs(obj[propName]).toDate();
          }
        }
      }
    }

    return obj as T;
  }

  /**
   * Returns a Date without a time defined
   *
   * @static
   * @returns Date
   * @memberof DateHelper
   */
  static currentDate(): Date {
    return dayjs().hour(0).minute(0).second(0).millisecond(0).toDate();
  }

  /**
   * Reset time of Date
   *
   * @static
   * @param {(dayjs.Dayjs | Date)} date
   * @returns Date
   * @memberof DateHelper
   */
  static resetTime<T = Date>(date: dayjs.Dayjs | Date): T {
    const parsedDate = dayjs(date).hour(0).minute(0).second(0).millisecond(0);

    if (date instanceof Date) {
      return parsedDate.toDate() as unknown as T;
    }

    return parsedDate as unknown as T;
  }

  /**
   * Given time parse it
   *
   * @static
   * @param {string} time
   * @param {bool} nullable
   * @returns {string}
   * @memberof DateHelper
   */
  static parseTime(time: string, nullable = false): string {
    let parsedTime = time === '000:00' ? '00:00' : time;

    // Check time is valid
    const firstCheck = /^[0-9]{2,}:[0-5]{1}[0-9]{1}$/.test(time);

    // If is invalid
    if (!firstCheck) {
      // if pass in the check below, it consired that minutes is wrong
      const secondCheck = /^([0-9]{2,}):([0-9]{2})$/.exec(time);

      if (secondCheck) {
        parsedTime = `${secondCheck[1]}:59`;
      } else {
        parsedTime = null;
      }
    }

    return !parsedTime ? (nullable ? null : '00:00') : parsedTime;
  }

  /**
   * Based given period, returns previous period
   * @param period
   * @returns
   */
  static getPreviousPeriod(period: Date[] | dayjs.Dayjs[]): Date[] {
    let date1 = dayjs(period[0]);
    let date2 = dayjs(period[1]);

    if (date1.isAfter(date2)) {
      const tempPeriod = date1;
      date2 = date1;
      date1 = tempPeriod;
    }

    // If is a "full month", subtract a month
    if (this.isFullMonthPeriod([date1, date2])) {
      const diffMonth = date2.diff(date1, 'month') + 1;

      return [
        date1.subtract(diffMonth, 'month').toDate(),
        date2.subtract(diffMonth, 'month').endOf('month').toDate(),
      ];

      // If is a "month", subtract a month
    } else if (this.isMonthPeriod([date1, date2])) {
      const diffMonth = date2.diff(date1, 'month') + 1;

      return [
        date1.subtract(diffMonth, 'month').toDate(),
        date2.subtract(diffMonth, 'month').toDate(),
      ];

      // Otherwise, get days range and subtract it
    } else {
      const diffDays = date2.diff(date1, 'day') + 1;

      return [
        date1.subtract(diffDays, 'day').toDate(),
        date1.subtract(1, 'day').toDate(),
      ];
    }
  }

  /**
   * Based given period, returns next period
   * @param period
   * @returns
   */
  static getNextPeriod(period: Date[] | dayjs.Dayjs[]): Date[] {
    let date1 = dayjs(period[0]);
    let date2 = dayjs(period[1]);

    if (date1.isAfter(date2)) {
      const tempPeriod = date1;
      date2 = date1;
      date1 = tempPeriod;
    }

    // If is a "full month", add a month
    if (DateHelper.isFullMonthPeriod([date1, date2])) {
      const diffMonth = date2.diff(date1, 'month') + 1;

      return [
        date1.add(diffMonth, 'month').toDate(),
        date2.add(diffMonth, 'month').endOf('month').toDate(),
      ];

      // If is a "month", add a month
    } else if (DateHelper.isMonthPeriod([date1, date2])) {

      const diffMonth = date2.diff(date1, 'month') + 1;

      return [
        date1.add(diffMonth, 'month').toDate(),
        date2.add(diffMonth, 'month').toDate(),
      ];

      // Otherwise, get days range and add it
    } else {
      const diffDays = date2.diff(date1, 'day') + 1;

      return [
        date2.add(1, 'day').toDate(),
        date2.add(diffDays, 'day').toDate(),
      ];
    }
  }

  /**
   * Given period and reference period returns period that collids
   * Case dot not collids, return null
   * @param periodStart
   * @param periodEnd
   * @param refPeriodStart
   * @param refPeriodEnd
   * @returns
   */
  static getCollidingPeriod(
    periodStart: dayjs.Dayjs | Date,
    periodEnd: dayjs.Dayjs | Date,
    refPeriodStart: dayjs.Dayjs | Date,
    refPeriodEnd?: dayjs.Dayjs | Date,
  ): {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
  } {
    refPeriodEnd = refPeriodEnd || refPeriodStart;

    const parsedPeriodStart = isDate(periodStart) ? dayjs(periodStart) : periodStart as dayjs.Dayjs;
    const parsedPeriodEnd = isDate(periodEnd) ? dayjs(periodEnd) : periodEnd as dayjs.Dayjs;
    const parsedRefPeriodStart = isDate(refPeriodStart) ? dayjs(refPeriodStart) : refPeriodStart as dayjs.Dayjs;
    const parsedRefPeriodEnd = isDate(refPeriodEnd) ? dayjs(refPeriodEnd) : refPeriodEnd as dayjs.Dayjs;

    // If period do not collids with reference period
    if (parsedPeriodEnd.isBefore(parsedRefPeriodStart) || parsedPeriodStart.isAfter(parsedRefPeriodEnd)) {
      return null;
    }

    // Limits period with reference period
    const limitedStart = parsedPeriodStart.isBefore(parsedRefPeriodStart) ? parsedRefPeriodStart : parsedPeriodStart;
    const limitedEnd = parsedPeriodEnd.isAfter(parsedRefPeriodEnd) ? parsedRefPeriodEnd : parsedPeriodEnd;

    return {
      start: limitedStart,
      end: limitedEnd,
    };
  }

  /**
   * Given period and reference period returns if period collids
   * @param periodStart
   * @param periodEnd
   * @param refPeriodStart
   * @param refPeriodEnd
   * @returns
   */
  static isCollidingPeriod(
    periodStart: dayjs.Dayjs | Date,
    periodEnd: dayjs.Dayjs | Date,
    refPeriodStart: dayjs.Dayjs | Date,
    refPeriodEnd?: dayjs.Dayjs | Date,
  ): boolean {
    return !!DateHelper.getCollidingPeriod(periodStart, periodEnd, refPeriodStart, refPeriodEnd);
  }

  private static isFullMonthPeriod(period: dayjs.Dayjs[]): boolean {
    return period[0].get('date') === 1 && period[1].daysInMonth() === period[1].get('date');
  }

  private static isMonthPeriod(period: dayjs.Dayjs[]): boolean {
    if (period[0].isSame(period[1], 'date')) {
      return false;
    }

    return period[0].get('date') - 1 === period[1].get('date')
      || period[0].get('date') === period[1].get('date');
  }
}
