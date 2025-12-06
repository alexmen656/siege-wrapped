<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
//import axios from 'axios'
import { ref } from 'vue'

// The provided session cookie value
//const SIEGE_SESSION_VALUE = import.meta.env.VITE_SIEGE_COOKIE ?? '_siege_session=FIo+HOArGfDR/+0IUAIe8lalalalallalalalalnfc8DxuPQOEWh8QWnHEbBKz/--k3pDE=='
const response = ref(null)
//https://siege.hackclub.com//api/public-beta/user/:id_or_slack_id

/*axios.get(
  "https://siege.hackclub.com/api/public-beta/user/U0877PG14F4",
  {
    withCredentials: true,
    headers: {
      'X-Siege-Session': SIEGE_SESSION_VALUE
    }
  }
).then((res) => {
  response.value = res.data
  console.log(res.data)
})*/

fetch("https://siege.hackclub.com/api/public-beta/user/U0877PG14F4", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "max-age=0",
    "if-none-match": "W/\"f23ac2ba630641ec942120da55ee216a\"",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1"
  },
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
}).then(response => response.json())
  .then(response => {
    console.log(response)
    response.value = response.data;
  })


/*
curl 'https://siege.hackclub.com/api/public-beta/user/U0877PG14F4' \
-H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng, q*; q = 0.8, application / signed - exchange; v = b3; q = 0.7'
-H 'accept - language: de - DE, de; q = 0.9, en - US; q = 0.8, en; q = 0.7' \
-H 'cache - control: max - age=0' \
-b 'fs_uid = #ARN0J#8728ef5e - 3d41 - 47b5 - a897 - 2cb7d98ae46f: d2d07b83 - 0fd2 - 4544 - b75f - 60111bc8bc93: 1763232080310:: 1# / 1785868415; _ga = GA1.2.934017939.1763664434; _ga_HPGYH52DKM = GS2.1.s1763679781$o2$g0$t1763679781$j60$l0$h0; ph_phc_B5T0FJzZYK5qPDXnoss4hKtXh8ZyIsHMVlC2ATS2s0y_posthog =% 7B % 22distinct_id % 22 % 3A % 22019a8a03 - 29b5 - 7aa5 - 92ad - e47a746b965f % 22 % 2C % 22 % 24sesid % 22 % 3A % 5B1764603158877 % 2C % 22019ada8b - 47cd - 77e0 - a319 - 0a430f1c1ddd % 22 % 2C1764603152327 % 5D % 2C % 22 % 24initial_person_info % 22 % 3A % 7B % 22r % 22 % 3A % 22 % 24direct % 22 % 2C % 22u % 22 % 3A % 22https % 3A % 2F % 2Fmidnight.hackclub.com % 2F % 22 % 7D % 7D; cf_clearance = ymo8c.OtfRyctD6GpsaSldpUbVMA0AdxP.6qq2MPZBg - 1764806504 - 1.2.1.1 - sRe61gG3kUuzUyGcJbOpOp9rqFj4LNb9cLqjT0OLM34CEHClycUUJWei09TJPPZGx9naIiHDYcMwMtR_HAuMIJDsWooZZ9QwnSk7syHyvAVLqIkTcSx0c23JYIKAfXL4zNLctHxA20NlOjaykay08V6AwN8WSUwUicmsBP.ASaVQmUolYRd_Z.2VIkd5QAvn344ZIGDSwAZJeCTXRX9Wu09HkS8q12pRq0S1jQODi7c; cfz_zaraz - analytics=% 7B %22_cfa_clientId % 22 % 3A % 7B % 22v % 22 % 3A % 2245026550426573490 % 22 % 2C % 22e % 22 % 3A1791389980976 % 7D % 7D; _siege_session = 6oXN6ATcoITidam2Wb1gwNg3VeFC9DIcbLKE7LpUurJowR5pEt8STpPUg0bN % 2FRKwZXI4vXv7FJkpMejUbeEU3CnkcdupB2Rdzo4QAjRgqP0n2y % 2BfQ0HJz % 2B1b8 % 2BSNvyphHe9Zs2iDIV4p0JwEmASvUWNBsCbn006jLY % 2Bt9NOBGVqmnxzKMgfqZkVBlM9SCYXAh8hwHHMWg1fXIb3D8y7XugqWR2hfu1 % 2B1U5co4cwaw0SqwD8lrck1JsoGoKhSKqAb4vA5hQk345GHKypWNFiTgDUHTRd2UIrpZxIeReo2iPFXJisC0WJ9O8h8xmDH % 2FAuT7grNoaSXY7lXMaWG--LGRVyrwCHGH5MU4k--46npqeNeB9OVPlNHangjWw % 3D % 3D' \
-H 'if-none - match: W / "f23ac2ba630641ec942120da55ee216a"' \
-H 'priority: u = 0, i' \
-H 'sec - ch - ua: "Chromium"; v = "142", "Google Chrome"; v = "142", "Not_A Brand"; v = "99"' \
-H 'sec - ch - ua - mobile: ?0' \
-H 'sec - ch - ua - platform: "macOS"' \
-H 'sec - fetch - dest: document' \
-H 'sec - fetch - mode: navigate' \
-H 'sec - fetch - site: none' \
-H 'sec - fetch - user: ?1' \
-H 'upgrade - insecure - requests: 1' \
-H 'user - agent: Mozilla / 5.0(Macintosh; Intel Mac OS X 10_15_7) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 142.0.0.0 Safari / 537.36'

*/

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        {{ response?.id }}
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
