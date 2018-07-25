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

    <WineList :wines=displayed @wine-click=navigateToWine ref=winelist />
  </div>
</template>

<script>
import WineList from "./WineList";

export default {
  name: "Wines",
  components: {
    WineList
  },
  data() {
    return {
      isLoading: true,
      search: "",
      sort: "name",
      selected: null,
      wines: [],
      displayed: []
    };
  },
  mounted() {
    this.load();
    this.search = this.$route.query.search || null;
    this.sort = this.$route.query.sort || "name";
    this.selected = +this.$route.query.selected;
  },
  watch: {
    $route() {
      this.sortAndFilter();
      this.selected = this.$route.query ? +this.$route.query.selected : null;
    }
  },
  methods: {
    async navigateToWine(wine) {
      this.selected = wine.id;
      this.updateQuery();

      this.$router.push({ name: "wine", params: { id: wine.id } });
    },
    async updateQuery() {
      this.$router.replace({
        path: this.$route.path,
        query: {
          search: this.search,
          sort: this.sort,
          selected: this.selected || undefined
        }
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
            (w.name || "").toLowerCase().includes(term) ||
            (w.winemaker.name.sl || "").toLowerCase().includes(term) ||
            (w.winemaker.name.en || "").toLowerCase().includes(term) ||
            (w.code || "").toLowerCase().includes(term)
        )
      );

      const orders = {
        name: (a, b) => (a.name || "").localeCompare(b.name || ""),
        winemaker: (a, b) =>
          (a.winemaker.name.sl || "").localeCompare(b.winemaker.name.sl || ""),
        code: (a, b) => (a.code || "").localeCompare(b.code || ""),
        year: (a, b) => b.year - a.year
      };

      const sorted = filtered.sort(
        orders[this.$route.query ? this.$route.query.sort || "name" : "name"]
      );

      this.displayed = sorted;

      if (this.selected) {
        this.$nextTick(() => {
          this.$refs.winelist.$refs["card" + this.selected][0].focus();
        });
      }
    }
  }
};
</script>
