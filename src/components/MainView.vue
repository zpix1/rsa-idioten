<template>
  <div class="main">
    <div class="header">RSA Idioten</div>
    <div id="grid">
      <div id="n">
        N:
        <input type="text" v-model="n" /> <br>
        E:
        <input type="text" v-model="e" />
        <a @click="set_e(3)"> 3 </a>
        <a @click="set_e(65537)">| 65537</a>
      </div>
      <div id="n-info">
        <p>
          N == P(factors): {{ !!nfactors.length && n == nfactors.reduce((a, x) => a*x) }}
          <input
            type="button"
            value="Calculate from factors"
            @click="calculate_n"
          />
        </p>
      </div>
      <div id="p-q-phi">
        <div>
          &phi;(N):
          <input type="text" v-model="phi" />
          <p>
            <input
              type="button"
              value="Calculate from factors (they all should be prime)"
              @click="calculate_phi"
            />
          </p>
        </div>
      </div>
      <div class="n-factors">
        N Prime Factorization ({{ nfactors.length }} factors found):
        <br />
        <textarea v-model="nfactors_raw" class="factors-textarea"></textarea>
      </div>
      <div id="d">
        Calculated D:
        <input type="text" v-model="d" />
      </div>
      <div id="enc-dec">
        <div>
          Cryptotext:
          <input type="text" v-model="cryptotext" />
        </div>
        <input type="button" value="Decrypt" @click="decrypt" />
        <input type="button" value="Encrypt" @click="encrypt" />
        <div>
          Plaintext:
          <input type="text" v-model="plaintext" />
        </div>
      </div>
      <div id="ascii">
        Ascii:
        <textarea type="text" v-model="ascii" />
      </div>
    </div>
  </div>
</template>

<script>
/* global BigInt */
import { egcd, expmod, hex_to_ascii, ascii_to_bi } from "../libs/utils";

export default {
  name: "MainView",
  data: function() {
    return {
      n: null,
      e: 65537n,
      phi: null,
      cryptotext: null,
      plaintext: "",
      nfactors_raw: ""
    };
  },
  methods: {
    cast_to_bi: function() {
      this.e =  this.e && BigInt(this.e);
      this.n = this.n && BigInt(this.n);
      this.phi = this.phi && BigInt(this.phi);
      this.cryptotext = this.cryptotext && BigInt(this.cryptotext);
      this.plaintext = this.plaintext && BigInt(this.plaintext);
    },
    calculate_phi: function() {
      this.phi = this.nfactors.reduce((a, x) => a * (x - BigInt(1)), 1n);
    },
    calculate_n: function() {
      this.n = this.nfactors.reduce((a, x) => a * x);
    },
    set_e: function(e) {
      this.e = BigInt(e);
    },
    decrypt: function() {
      this.plaintext = expmod(this.cryptotext, this.d, this.n);
    },
    encrypt: function () {
      this.cryptotext = expmod(this.plaintext, this.e, this.n);
    }
  },

  computed: {
    nfactors: {
      get: function() {
        return this.nfactors_raw
          .split("\n")
          .filter(e => BigInt(e))
          .map(e => BigInt(e));
      }
    },
    d: function() {
      this.cast_to_bi();
      if (!this.phi || !this.e) {
        return 0n;
      }
      let gcd = egcd(this.phi, this.e);
      console.log(gcd);
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
        console.log(ascii_to_bi(v));
        this.plaintext = ascii_to_bi(v);
      }
    }
  }
};
</script>

<style>
.header {
  font-size: 3vw;
  text-align: center;
}

#grid {
  display: grid;
  grid-template-areas:
    "n n-info n-info"
    "p-q-phi p-q-phi n-factors"
    "p-q-phi p-q-phi d"
    "enc-dec enc-dec ascii";
  grid-gap: 10px;
}

#grid > div {
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

.factors-textarea {
  width: 100%;
  height: 100px;
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
</style>
