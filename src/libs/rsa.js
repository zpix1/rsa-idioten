import { sqrt } from "./utils";

function fermat_prime(n) {
  if (n % 2n == 0n) {
    return null;
  }
  let a = sqrt(n);
  let b2 = a * a - n;

  while (b2 > 0 && sqrt(b2) ** 2n == b2) {
    a += 1n;
    b2 = a * a - n;
  }

  if (b2 < 0n) {
    return null;
  }

  return a - sqrt(b2);
}

function mr_test(n, k = 100) {
  if (n < 2n) return false;
  if (n == 2n) return true;
  let [d, r] = [n - 1n, 0n];
  while (!((d / 2n) % 1n)) {
    d /= 2n;
    r++;
  }
  WitnessLoop: for (let i = 0; i < k; i++) {
    let a = BigInt(Math.floor(Math.random() * (n - 4)) + 2);
    let x = 1n;
    for (let z = 0n; z < d; z++) {
      x = (x * a) % n;
    }
    if (x == 1n || x == n - 1n) {
      continue WitnessLoop;
    }
    for (let j = 0n; j < r - 1; j++) {
      x = (x * x) % n;
      if (x == 1n) return false;
      if (x == n - 1n) continue WitnessLoop;
    }
    return false;
  }
  return true;
}

export { fermat_prime, mr_test };
