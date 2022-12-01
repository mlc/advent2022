/**
 * Base on http://rosettacode.org/wiki/Chinese_remainder_theorem (python implementation)
 * solve a system of linear congruences by applying the Chinese Remainder Theorem
 *
 * 	X = a1  (mod n1)
 *  	X = a2  (mod n2)
 *
 * This function will be called as:
 *
 * chineseRemainder( [a1, a2], [n1, n2])
 */

const mulInv = (a: bigint, b: bigint): bigint => {
  const b0 = b;
  let x0 = 0n;
  let x1 = 1n;
  let q, tmp;
  if (b == 1n) {
    return 1n;
  }
  while (a > 1n) {
    q = a / b;
    tmp = a;
    a = b;
    b = tmp % b;
    tmp = x0;
    x0 = x1 - q * x0;
    x1 = tmp;
  }
  if (x1 < 0n) {
    x1 = x1 + b0;
  }
  return x1;
};

export const chineseRemainder = (
  a: readonly bigint[],
  n: readonly bigint[]
): bigint => {
  let p = 1n;
  let prod = 1n;
  let sm = 0n;
  for (let i = 0; i < n.length; i++) {
    prod = prod * n[i];
  }
  for (let i = 0; i < n.length; i++) {
    p = prod / n[i];
    sm = sm + a[i] * mulInv(p, n[i]) * p;
  }
  return sm % prod;
};

export const chineseRemainderInt = (
  a: readonly number[],
  n: readonly number[]
): number => Number(chineseRemainder(a.map(BigInt), n.map(BigInt)));
