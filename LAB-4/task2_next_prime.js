function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

function findNextPrime(startNum) {
  let nextNum = startNum + 1;
  while (!isPrime(nextNum)) {
    nextNum++;
  }
  return nextNum;
}

let givenPrime = 11;
let nextPrime = findNextPrime(givenPrime);

console.log(`Given Prime Number: ${givenPrime}`);
console.log(`The Prime Number after ${givenPrime} is: ${nextPrime}`);
