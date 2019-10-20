import axios from "axios";

const cors_proxy_url = "https://api.codetabs.com/v1/proxy?quest="
const fdb_url = cors_proxy_url + "http://factordb.com/";
const showid_url = fdb_url + '/index.php?showid=';

function str_to_el(str) {
  let html = document.createElement("template");
      let a =
        "<div>" +
        str
          .replace(/\t/g, "")
          .replace(/\n/g, "")
          .trim() +
        "</div>";
  html.innerHTML = a;
  let x = html.content.firstChild;
  return x;
}

async function get_prime(url) {
  var id = (new URL(url.substr(cors_proxy_url.length))).searchParams.get("id");
  // console.log(showid_url + id)
  let x = await axios.get(showid_url + id).then(r => {
    let x = str_to_el(r.data);
      let pe = x.getElementsByTagName("table");
      if (pe[1]) {
        pe = pe[1].getElementsByTagName("tr");
        if (pe[2]) {
          pe = pe[2].getElementsByTagName("td");
          if (pe[1]) {
            return pe[1].innerText;
          }
        }
      }
  });
  return x;
}

// Perferm an async request to factordb.com
// Return promise
async function factorize_using_factor_db(n, log_f) {
  const url =
    "https://api.codetabs.com/v1/proxy?quest=http://factordb.com/index.php?query=";
  log_f("[FACTOR DB] Perferming request to factor db");
  return axios
    .get(url + n.toString())
    .then(async r => {
      log_f("[FACTOR DB] Request completed");
      let x = str_to_el(r.data);
      let pe = x.getElementsByTagName("table");
      if (pe[1]) {
        pe = pe[1].getElementsByTagName("tr");
        if (pe[2]) {
          pe = pe[2].getElementsByTagName("td");
          let status = pe[0].innerText;
          log_f("[FACTOR DB] Status: " + status);
          if (status === 'C') {
            log_f("[FACTOR DB] Error: no factors known (status==C)");
            return null;
          }
          if (status === 'C *') {
            log_f("[FACTOR DB] Error: no factors known (status==C *), but DB request is done; give DB some time and try again;");
            return null;
          }
          let as = pe[2].children;
          log_f("[FACTOR DB] Factorization: " + pe[2].innerText);
          let ans = [];
          let factors = pe[2].innerText.split(' · ');
          factors[0] = factors[0].split('=')[1].trim()
          let factors_count = [];
          for (let i = 0; i < factors.length; i++) {
            if (factors[i].includes('^')) {
              factors_count.push(parseInt(factors[i].split('^')[1]));
            } else {
              factors_count.push(1);
            }
          }
          let fi = 0;
          for (let i = 1; i < as.length; i++) {
            if (as[i].nodeName === 'A') {
              let href = as[i].getAttribute('href');
              log_f("[FACTOR DB] Loading factor n. " + (fi) + ' ** ' + factors_count[fi]);
              let factor = await get_prime(fdb_url + href);
              ans = ans.concat(Array(factors_count[fi]).fill(factor));
              fi++;
            }
          }
          log_f("[FACTOR DB] Loaded " + ans.length + " factors");
          return ans;
        }
      }
      log_f("[FACTOR DB] Request failed; check console logs");
      return null;
    })
    .catch(x => {
      // eslint-disable-next-line
      console.error(x);
    });
}

export { factorize_using_factor_db };
