import dayjs from 'dayjs';

export const toDate = (value: any): Date => {
  if (value && value instanceof Date) {
    return value;
    // It supposed by containing isValid defined the value is a dayjs instance
  } else if (value && value.isValid) {
    return value.toDate();
  } else {

    return value ? dayjs(value).toDate() : null;
  }
};
