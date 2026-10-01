function createPhoneNumber(numbers) {
  if (!Array.isArray(numbers) || numbers.length !== 10) {
    throw new Error("Input must be an array of exactly 10 integers.");
  }
  for (let num of numbers) {
    if (!Number.isInteger(num) || num < 0 || num > 9) {
      throw new Error(`Invalid digit '${num}'.`);
    }
  }
  const areaCode = numbers.slice(0, 3).join("");
  const prefix = numbers.slice(3, 6).join("");
  const lineNumber = numbers.slice(6, 10).join("");
  return `(${areaCode}) ${prefix}-${lineNumber}`;
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
console.log(createPhoneNumber(numbers));
