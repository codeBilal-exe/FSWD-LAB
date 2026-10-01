function abs(...args) {
  if (args.length === 0) return 0;
  if (args.length === 1) return Math.abs(args[0]);
  return args.map((x) => Math.abs(x));
}

function ceil(...args) {
  if (args.length === 0) return 0;
  if (args.length === 1) return Math.ceil(args[0]);
  return args.map((x) => Math.ceil(x));
}

function floor(...args) {
  if (args.length === 0) return 0;
  if (args.length === 1) return Math.floor(args[0]);
  return args.map((x) => Math.floor(x));
}

console.log(abs());
console.log(abs(-4.7));
console.log(abs(-4.7, 3.2, -9));

console.log(ceil());
console.log(ceil(4.1));
console.log(ceil(4.1, 4.8, -2.3));

console.log(floor());
console.log(floor(4.9));
console.log(floor(4.9, 4.1, -2.3));
