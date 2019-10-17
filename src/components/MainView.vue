<template>
  <div class="main">
    <div class="header">RSA Idioten</div>
    <div id="grid">
      <div id="n">
        N:
        <input type="text" v-model="n" /><input
            type="button"
            value="Calculate from factors"
            :disabled="nfactors.length == 0"
            @click="calculate_n"
          /><br>
        <br />E:
        <input type="text" v-model="e" />
        <a @click="set_e(3)"> 3</a>
        <a @click="set_e(65537)"> | 65537</a>
      </div>
      <div id="n-info">
        <div>
          N {{ (!!nfactors.length && n == nfactors.reduce((a, x) => a*x)) ? '=' : '&ne;' }} P(factors)
          
        </div>
        <div>
          <input
            type="button"
            value="Calculate from factors"
            @click="calculate_n"
          /><br>
          <input type="button" value="Fermat method" @click="fermat_prime()" />
        </div>
      </div>
      <div id="p-q-phi">
        <div>
          &phi;(N):
          <input type="text" v-model="phi" />
          <p>
            <input
              type="button"
              value="Calculate from different prime factors"
              :disabled="(new Set(nfactors)).size != nfactors.length"
              @click="calculate_phi"
            />
            <br />
            <input
              type="button"
              value="Calculate from equal prime factors"
              :disabled="(new Set(nfactors)).size != 1"
              @click="calculate_phi_from_equals"
            />
          </p>
        </div>
      </div>
      <div class="n-factors">
        N Prime Factorization ({{ nfactors.length }} factors found):
        <br />
        <textarea v-model="nfactors_raw" class="factors-textarea"></textarea>
        {{ mr_filter().length }}
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
        <input type="button" value="Decrypt" @click="decrypt" />
        <input type="button" value="Encrypt" @click="encrypt" />
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
        Log: <input type="button" value="Clear" @click="logtext=''"/>
        <textarea style="width: 100%; height: 300px;" :value="logtext"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
/* global BigInt */
import { egcd, expmod, hex_to_ascii, ascii_to_bi, bi_pow } from "../libs/utils";
import { fermat_prime, mr_test } from "../libs/rsa";

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
  created: function() {
    // console.log(mr_test(10n));
    // console.log(mr_test(27n));
    // console.log(mr_test(117n));
    console.log(fermat_prime(13689n));
  },
  methods: {
    log: function (str) {
      this.logtext += str + '\n';
    },
    cast_to_bi: function() {
      this.e = this.e && BigInt(this.e);
      this.n = this.n && BigInt(this.n);
      this.phi = this.phi && BigInt(this.phi);
      this.cryptotext = this.cryptotext && BigInt(this.cryptotext);
      this.plaintext = this.plaintext && BigInt(this.plaintext);
    },
    calculate_phi: function() {
      this.phi = this.nfactors.reduce((a, x) => a * (x - BigInt(1)), 1n);
    },
    calculate_phi_from_equals: function() {
      console.log(this.nfactors);
      // console.log(this.nfactors[0]**BigInt(this.nfactors.length) - this.nfactors[0]**(BigInt(this.nfactors.length)-1n));
      this.phi =
        bi_pow(this.nfactors[0], BigInt(this.nfactors.length)) -
        bi_pow(this.nfactors[0], BigInt(this.nfactors.length) - 1n);
    },
    calculate_n: function() {
      this.n = this.nfactors.reduce((a, x) => a * x);
    },
    fermat_prime: function() {
      let ans = fermat_prime(BigInt(this.n));
      this.log('Fermat run: ' + (ans ? 'FOUND' : 'not found'));
      if (ans == null) {
        return false;
      } else {
        console.log(ans);
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
    mr_filter: function () {
      return this.nfactors.filter(x => !false);
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
          this.log('N factors read failed: ' + e);
          return [];
        }
      },
      set: function(v) {
        console.log(v);
        this.nfactors_raw = v.map(x => x.toString()).join("\n");
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
    "n n-info n-info log log log"
    "p-q-phi p-q-phi n-factors log log log"
    "p-q-phi p-q-phi d . . ."
    "enc-dec enc-dec ascii . . .";
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

#grid input[type="button"] {

}

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
