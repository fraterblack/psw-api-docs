export const toInt = (value: any): number => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  return parseInt(value, 10);
};
