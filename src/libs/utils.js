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

export { egcd, expmod, hex_to_ascii };
