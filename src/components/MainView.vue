<template>
  <div class="container">
    <div id="floating-validations">
      Validations:
      <br />
      <div
        v-bind:class="{ 'warning': !(!!nfactors.length && n == nfactors.reduce((a, x) => a*x)) }"
      >N {{ (!!nfactors.length && n == nfactors.reduce((a, x) => a*x)) ? '=' : '&ne;' }} P(factors)</div>
      <div
        v-bind:class="{ 'warning': !(e && phi && gcd(e, phi) == 1) }"
      >gcd(e, &phi;) {{ (e && phi && gcd(e, phi) == 1) ? '=' : '&ne;' }} 1</div>
      <!-- <div v-bind:class="{ 'warning': !(false) }">
        All factors in factorization are prime
      </div>-->
    </div>
    <div class="main">
      <div class="header">RSA Idioten</div>
      <div id="grid">
        <div id="n">
          N:
          <input type="text" v-model="n" />
          <input
            type="button"
            value="Calculate from factors"
            :disabled="nfactors.length == 0"
            @click="calculate_n"
          />
          <br />
          <br />E:
          <input type="text" v-model="e" />
          <br />Set from template:
          <a @click="set_e(3)">
            <b>3</b>
          </a>
          <a @click="set_e(65537)">
            |
            <b>65537</b>
          </a>
        </div>
        <div id="n-info">
          <div>N Factorize tools</div>
          <div>
            <input
              :disabled="!n"
              type="button"
              value="Fermat method (up to 10 millions)"
              @click="fermat_factorization()"
            />
          </div>
          <div>
            <input disabled type="button" value="Bruteforce" />
          </div>
          <div>
            <input disabled type="button" value="Factordb.com" />
          </div>
        </div>
        <div id="p-q-phi">
          <div>
            &phi;(N):
            <input type="text" v-model="phi" />
            <div>
              <input
                type="button"
                value="Calculate from prime factors"
                :disabled="0 == nfactors.length"
                @click="calculate_phi"
              />
              <br />
            </div>
          </div>
        </div>
        <div class="n-factors">
          N Prime Factorization ({{ nfactors.length }} factors found):
          <br />
          <textarea v-model="nfactors_raw" class="factors-textarea"></textarea>
          <!-- {{ mr_filter().length }} -->
        </div>
        <div id="d">
          Calculated D:
          <input readonly type="text" v-model="d" />
        </div>
        <div id="enc-dec">
          <div>
            Cryptotext:
            <input type="text" v-model="cryptotext" />
          </div>
          <div>
            <input type="button" value="Decrypt" @click="decrypt" />
            <input type="button" value="Encrypt" @click="encrypt" />
          </div>
          <div>
            Plaintext:
            <input type="text" v-model="plaintext" />
          </div>
        </div>
        <div id="ascii">
          Ascii:
          <textarea type="text" v-model="ascii" class="ascii-ta" />
        </div>
        <div id="log">
          Log:
          <input type="button" value="Clear" @click="logtext=''" />
          <textarea style="width: 100%; height: 300px;" :value="logtext"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { egcd, expmod, hex_to_ascii, ascii_to_bi, bi_pow } from "@/libs/utils";
import { fermat_factorization } from "@/libs/rsa";

export default {
  name: "MainView",
  data: function() {
    return {
      n: null,
      e: 65537n,
      phi: null,
      cryptotext: null,
      plaintext: "",
      nfactors_raw: "",
      logtext: ""
    };
  },
  created: function() {},
  methods: {
    gcd: function(x, y) {
      return egcd(x, y)[0];
    },
    log: function(str) {
      this.logtext += str + "\n";
    },
    cast_to_bi: function() {
      this.e = this.e && BigInt(this.e);
      this.n = this.n && BigInt(this.n);
      this.phi = this.phi && BigInt(this.phi);
      this.cryptotext = this.cryptotext && BigInt(this.cryptotext);
      this.plaintext = this.plaintext && BigInt(this.plaintext);
    },
    calculate_phi: function() {
      let factor_d = {};
      for (let i = 0; i < this.nfactors.length; i++) {
        factor_d[this.nfactors[i].toString()] =
          (factor_d[this.nfactors[i].toString()] || 0n) + 1n;
      }
      let ans = 1n;
      for (let f in factor_d) {
        ans *=
          bi_pow(BigInt(f), factor_d[f]) - bi_pow(BigInt(f), factor_d[f] - 1n);
      }
      this.phi = ans;
    },
    calculate_n: function() {
      this.n = this.nfactors.reduce((a, x) => a * x);
    },
    fermat_factorization: function() {
      let ans = fermat_factorization(BigInt(this.n));
      this.log("Fermat run: " + (ans ? "FOUND" : "not found"));
      if (ans == null) {
        return false;
      } else {
        this.nfactors = [ans, this.n / ans];
        return true;
      }
    },
    set_e: function(e) {
      this.e = BigInt(e);
    },
    decrypt: function() {
      this.plaintext = expmod(this.cryptotext, this.d, this.n);
    },
    encrypt: function() {
      this.cryptotext = expmod(this.plaintext, this.e, this.n);
    },
    mr_filter: function() {
      return this.nfactors.filter(() => !false);
    }
  },

  computed: {
    nfactors: {
      get: function() {
        try {
          return this.nfactors_raw
            .split("\n")
            .filter(e => BigInt(e))
            .map(e => BigInt(e));
        } catch (e) {
          this.log("N factors read failed: " + e);
          return [];
        }
      },
      set: function(v) {
        this.nfactors_raw = v.map(x => x.toString()).join("\n");
      }
    },
    d: function() {
      this.cast_to_bi();
      if (!this.phi || !this.e) {
        return 0n;
      }
      let gcd = egcd(this.phi, this.e);
      if (gcd[2] < 0) {
        gcd[2] += this.phi;
      }
      return gcd[2];
    },
    ascii: {
      get: function() {
        return hex_to_ascii(this.plaintext.toString(16));
      },
      set: function(v) {
        this.plaintext = ascii_to_bi(v);
      }
    }
  }
};
</script>

<style>
.container,
body,
html {
  margin: 0;
  font-family: "Computer Modern Sans", sans-serif;
}

.main {
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  font-size: 3vw;
  text-align: center;
}

#grid {
  display: grid;
  grid-template-areas:
    "n n-info n-info log log"
    "p-q-phi p-q-phi n-factor log log"
    "p-q-phi p-q-phi d . ."
    "enc-dec enc-dec ascii . .";
  grid-gap: 10px;
}

#grid > div {
  /* border: 1px solid black; */
  /* border-radius: 10px; */
  font-size: 20px;
  padding: 0.5em;
  background: gold;
  /* padding: 20px; */
}

#grid input[type="text"] {
  padding-right: 0;
  margin: 0px 0px 10px 0px;
  height: 30px;
  font-size: 20px;
}

#floating-validations {
  border: 3px solid black;
  border-left: 0px;
  border-radius: 0px 10px 10px 0px;

  position: absolute;
  background: gold;
  float: left;
  clear: both;
  overflow: auto;
  top: 100px;

  padding: 10px;
  margin-left: 0px;

  font-size: 20px;
  /* display: block; */
}

#floating-validations .warning {
  color: red;
}

/* #grid input[type="button"] {

} */

.factors-textarea {
  width: 100%;
  height: 100px;
}

#log {
  width: 300px;
  margin-right: -100px;
  grid-area: log;
}

#n-info {
  grid-area: n-info;
}

#n {
  grid-area: n;
}

#n-factors {
  grid-area: n-factors;
}

#p-q-phi {
  grid-area: p-q-phi;
}

#d {
  grid-area: d;
}

#enc-dec {
  grid-area: enc-dec;
}

#ascii {
  grid-area: ascii;
}

#ascii .ascii-ta {
  width: 100%;
  height: 100px;
}
</style>
