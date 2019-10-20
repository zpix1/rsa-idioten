function sqrt(value) {
  if (value < 0n) {
    throw "square root of negative numbers is not supported";
  }

  if (value < 2n) {
    return value;
  }

  function newtonIteration(n, x0) {
    const x1 = (n / x0 + x0) >> 1n;
    if (x0 === x1 || x0 === x1 - 1n) {
      return x0;
    }
    return newtonIteration(n, x1);
  }

  return newtonIteration(value, 1n);
}

function egcd(m, n) {
  var a1 = 1n;
  var b1 = 0n;
  var a = 0n;
  var b = 1n;
  var c = m;
  var d = n;
  var q = c / d;
  var r = c % d;
  while (r > 0) {
    var t = a1;
    a1 = a;
    a = t - q * a; // a1 - qa
    t = b1;
    b1 = b;
    b = t - q * b; // b1 - qb
    c = d;
    d = r;
    q = c / d;
    r = c % d;
  }
  return [d, a, b];
}

function bi_pow(a, b) {
  let ans = 1n;
  for (let i = 0; i < b; i++) {
    ans *= a;
  }
  // console.log(a, b, ans);
  return ans;
}

function mod_pow(a, b, n) {
  a = a % n;
  var result = 1n;
  var x = a;

  while (b > 0n) {
    var leastSignificantBit = b % 2n;
    b = b / 2n;

    if (leastSignificantBit == 1n) {
      result = result * x;
      result = result % n;
    }

    x = x * x;
    x = x % n;
  }
  return result;
}

function ascii_to_bi(str1) {
  var ans = 0n;
  for (var i = str1.length - 1; i > -1; i--) {
    ans +=
      BigInt(str1.charCodeAt(i)) * bi_pow(256n, BigInt(str1.length - i - 1));
  }
  // console.log(hex_to_ascii(ans.toString(16)));
  return ans;
}

function hex_to_ascii(str1) {
  var hex = str1.toString(16);
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

var expmod = function(a, b, n) {
  a = a % n;
  var result = 1n;
  var x = a;

  while (b > 0n) {
    var leastSignificantBit = b % 2n;
    b = b / 2n;

    if (leastSignificantBit == 1n) {
      result = result * x;
      result = result % n;
    }

    x = x * x;
    x = x % n;
  }
  return result;
};

// function mr_test(n, k=100){
//   if(n<2) return false;
//   if(n==2) return true;
//   let [d,r] = [n-1,0]
//   while(!((d/2)%1)){d/=2;r++}
//   WitnessLoop: for(let i = 0; i < k; i++){
//     let a = Math.floor(Math.random()*(n-4))+2;
//     let x = 1
//     for(let z=0; z<d; z++){
//       x=(x*a)%n;
//     }
//     if(x==1 || x==n-1){
//       continue WitnessLoop;
//     }
//     for(let j = 0; j < r - 1; j++){
//       x=(x*x)%n;
//       if(x==1) return false;
//       if(x==n-1) continue WitnessLoop;
//     }
//     return false;
//   }
//   return true;
// }

export { egcd, expmod, hex_to_ascii, ascii_to_bi, sqrt, bi_pow, mod_pow };
