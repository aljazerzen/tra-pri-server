<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Vinarji <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
      <div class="level-right">
        <router-link to="/vinarji/nov" class="button is-primary">Dodaj</router-link>
      </div>
    </nav>

    <div class="level">
      
      <div class="level-left control has-icons-left">
        <div class="select">
          <select v-model="sort" @change="updateQuery()">
            <option value="name">Ime</option>
            <option value="place">Kraj</option>
            <option value="code">Koda</option>
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

    <div class="card" v-for="winemaker in displayed" v-bind:key="winemaker.id">
      <router-link :to="{ name: 'winemaker', params: { id: winemaker.id }}">
        <div class="card-header">
          <div class="card-header-title level">
            <div class="level-left">
              <LocaleSpan v-bind:object="winemaker.name" locale='sl' :defaultToSl="true"/>
              <p class="has-text-grey" style="margin-left: 0" v-if="winemaker.place">
                , {{ winemaker.place.name }} <span v-if=winemaker.code>- {{ winemaker.code }}</span></p>
            </div>
            <div class="level-right">
              <router-link class="button is-white" :to="{ name: 'winemaker', params: { id: winemaker.id }}">
                <span class="icon is-small"><i class="fas fa-info"></i></span>
              </router-link>
              <router-link class="button is-white" :to="{ name: 'winemaker-edit', params: { id: winemaker.id }}">
                <span class="icon is-small"><i class="fas fa-edit"></i></span>
              </router-link>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import LocaleSpan from "../../common/LocaleSpan";

export default {
  name: "Winemakers",
  components: {
    LocaleSpan
  },
  data() {
    return {
      isLoading: true,
      search: "",
      sort: "name",
      winemakers: [],
      displayed: []
    };
  },
  mounted() {
    this.load();
    this.search = this.$route.query.search || null;
    this.sort = this.$route.query.sort || "name";
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
        query: {
          search: this.search,
          sort: this.sort
        }
      });
    },

    async load() {
      this.isLoading = true;
      this.winemakers = await this.$http
        .get("winemakers")
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
      this.isLoading = false;
      this.sortAndFilter();
    },
    async sortAndFilter() {
      const search = this.$route.query.search || "";
      const searchTerms = search.toLowerCase().split(" ");

      const filtered = (this.winemakers || []).filter(w =>
        searchTerms.every(
          term =>
            (w.name.sl || "").toLowerCase().includes(term) ||
            (w.name.en || "").toLowerCase().includes(term) ||
            (w.place.name || "").toLowerCase().includes(term) ||
            (w.code || "").toLowerCase().includes(term)
        )
      );

      const orders = {
        name: (a, b) => (a.name.sl || "").localeCompare(b.name.sl || ""),
        place: (a, b) => (a.place.name || "").localeCompare(b.place.name || ""),
        code: (a, b) => (a.code || "").localeCompare(b.code || "")
      };

      const sorted = filtered.sort(
        orders[this.$route.query ? this.$route.query.sort || "name" : "name"]
      );

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
  margin-left: 10px;
}
</style>
