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

function ascii_to_bi(str1) {
  var ans = 0n;
  for (var i = str1.length - 1; i > -1; i--) {
    ans += BigInt(str1.charCodeAt(i)) * bi_pow(256n, BigInt(str1.length - i - 1));
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

export { egcd, expmod, hex_to_ascii, ascii_to_bi };
