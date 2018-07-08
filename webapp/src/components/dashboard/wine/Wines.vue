<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Vina <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
      <div class="level-right">
        <router-link to="/vina/novo" class="button is-primary">Dodaj</router-link>
      </div>
    </nav>

    <div class="level">
    
      <div class="level-left control has-icons-left">
        <div class="select">
          <select v-model="sort" @change="updateQuery()">
            <option value="name">Ime</option>
            <option value="winemaker">Vinar</option>
            <option value="code">Koda</option>
            <option value="year">Letnik</option>
          </select>
        </div>
        <span class="icon is-left">
          <i class="fas fa-sort"></i>
        </span>
      </div>

      <div class="level-right">
        <div class="field has-addons">
          <form class="control is-expanded" @submit.prevent="updateQuery()">
            <input class="input" type="text" v-model="search" placeholder="za iskanje pritisni enter">
          </form>
          <p class="control">
            <a class="button" @click="updateQuery()">
              <span class="icon is-small"><i class="fas fa-search"></i></span>
            </a>
          </p>
          <p class="control">
            <a class="button" @click="search = null; updateQuery()">
              <span class="icon is-small"><i class="fas fa-eraser"></i></span>
            </a>
          </p>
        </div>
      </div>
    </div>

    <div class="card" v-for="wine in displayed" v-bind:key="wine.id">
      <router-link :to="{ name: 'wine', params: { id: wine.id }}">
        <div class="card-header">
          <div class="card-header-title level">
            <p class="level-left">
              <i class="has-text-grey">
                <LocaleSpan v-bind:object="wine.winemaker.name" v-if="wine.winemaker" locale='sl'/>: 
              </i> {{ wine.name }}
            </p>
            <p class="level-right " v-if="wine.code">
              <span v-if="wine.year" class="tag is-light">{{ wine.year}}</span>
              {{ wine.code }}
            </p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import LocaleSpan from "../../common/LocaleSpan";

export default {
  name: "Wines",
  components: {
    LocaleSpan
  },
  data() {
    return {
      isLoading: true,
      search: "",
      sort: "name",
      wines: [],
      displayed: []
    };
  },
  mounted() {
    this.load();
    this.search = this.$route.query.search;
  },
  watch: {
    $route() {
      this.sortAndFilter();
    }
  },
  methods: {
    async updateQuery() {
      this.$router.replace({
        path: this.$route.path,
        query: { search: this.search, sort: this.sort }
      });
    },
    async load() {
      this.isLoading = true;
      this.wines = await this.$http.get("wines").then(data => data.json());
      this.isLoading = false;

      this.sortAndFilter();
    },
    async sortAndFilter() {
      const search = this.$route.query.search || "";
      const searchTerms = search.toLowerCase().split(" ");

      const filtered = (this.wines || []).filter(w =>
        searchTerms.every(
          term =>
            w.name.toLowerCase().includes(term) ||
            w.winemaker.name.sl.toLowerCase().includes(term) ||
            w.winemaker.name.en.toLowerCase().includes(term) ||
            w.code.toLowerCase().includes(term)
        )
      );

      const orders = {
        name: (a, b) => a.name.localeCompare(b.name),
        winemaker: (a, b) => a.winemaker.name.sl.localeCompare(b.winemaker.name.sl),
        code: (a, b) => a.code.localeCompare(b.code),
        year: (a, b) => b.year - a.year,
      };

      const sorted = filtered.sort(orders[this.$route.query ? this.$route.query.sort || 'name' : 'name']);

      this.displayed = sorted;
    }
  }
};
</script>

<style scoped>
.card {
  margin-bottom: 10px;
}

.card-header-title .tag {
  margin-right: 10px;
}

.card-header-title .level-left i {
  margin-right: 10px;
}

.a {
  color: black;
}
</style>
