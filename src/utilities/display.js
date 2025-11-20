export const debg = (x) => {
  console.log(x);
  return x;
};
const maxLength = (previousLength, element) =>
  Math.max(previousLength, element.length);
export const getMaxLengths = (data) =>
  data.reduce(
    (max, row) => {
      const keys = Object.keys(row);
      for (const key of keys) {
        max[key] = maxLength(max[key], row[key]);
      }
      return max;
    },
    { name: 0, args: 0, desc: 0, usage: 0 },
  );
export const padColumn = (data, padLength) => data.padEnd(padLength);
