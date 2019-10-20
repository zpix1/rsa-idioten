import { sqrt, mod_pow } from "@/libs/utils";

function fermat_factorization(n, k = 1e6, log_f = () => {}) {
  if (n % 2n === 0n) {
    return null;
  }

  let a = sqrt(n);
  let b = 0n;

  let i = 0;
  while (i < k) {
    if (i % 100000 === 0) {
      log_f("Fermat factorization progress: ", i, a, b, n);
    }
    let m = a * a - b * b;
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

function is_probable_prime(n, k = 50) {
  if (n <= 1n) {
    return false;
  }

  if (n == 2n || n == 3n) {
    return true;
  }
  for (let i = 2n; i < (100n > sqrt(n) ? sqrt(n) + 1n : 100n); i++) {
    if (n % i == 0n) {
      return false;
    }
  }

  if (n < 100000n) {
    for (let i = 100n; i < sqrt(n); i++) {
      if (n % i == 0n) {
        return false;
      }
    }
    return true;
  }

  for (let i = 2n; i < (n < k ? n : k); i++) {
    if (mod_pow(i, n - 1n, n) != 1n) {
      return false;
    }
  }
  return true;
}

export { fermat_factorization, is_probable_prime };
