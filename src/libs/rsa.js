import { sqrt } from "@/libs/utils";

function fermat_factorization(n, log_f=console.log) {
  if (n % 2n === 0n) {
    return null;
  }

  let a = sqrt(n);
  let b = 0n;
  
  let i = 0;
  while (i < 10e6) {
    if (i % 100000 === 0) {
        log_f('Fermat factorization progress: ', i, a, b, n);
    }
    let m = (a*a) - (b*b);
    if (m === n) {
        return a + b;
    } else if (m < n) {
        a++;
    } else {
        b++;
    }
    i++;
  }

  return null;
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

export { fermat_factorization, mr_test };
