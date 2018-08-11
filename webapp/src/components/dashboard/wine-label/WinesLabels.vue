<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Etikete <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
    </nav>


    <div class="level">  
      <div class="level-left control has-icons-left">
        <div class="select">
          <select v-model="sort" @change="updateQuery()">
            <option value="name">Ime</option>
            <option value="labels">Največ etiket</option>
            <option value="labels_asc">Najmanj etiket</option>
            <option value="winemaker">Vinar</option>
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

    <nav class="pagination is-rounded is-centered" role="navigation" aria-label="pagination" style="margin-bottom: 1em">
      <!-- <div style="order: 1"></div>
      <div style="order: 3"></div> -->
      <a @click="page = Math.max(0, page-1); updateQuery()" class="pagination-previous"><span class="icon"><i class="fas fa-arrow-left"></i></span></a>
      <a @click="page = Math.min(pages - 1, page+1); updateQuery()" class="pagination-next"><span class="icon"><i class="fas fa-arrow-right"></i></span></a>
      <ul class="pagination-list" style="flex-grow: 0">
        <li v-for="(item, index) in new Array(pages || 0)" :key="index" @click="page = index; updateQuery()">
          <a class="pagination-link" aria-label="Goto page 1" :class="{ 'is-current': page == index }">
            {{ index + 1 }}
          </a>
        </li>
      </ul>
    </nav>

    <div class="card" v-for="wine in displayed" v-bind:key="wine.id">
      <router-link :to="{ name: 'wine-label', params: { id: wine.id }}">
        <div class="card-header">
          <div class="card-header-title">
            <div class="level">
              <div class="level-left">
                <i class="has-text-grey">
                  <LocaleSpan v-bind:object="wine.winemaker.name" v-if="wine.winemaker" locale='sl'/>
                </i>: {{ wine.name }}
                <span v-if="wine.year" class="tag is-light" style="margin-left: 1em">{{ wine.year}}</span>
              </div>
              <div class="level-right">
                <span class="tag" :class="{ 'is-info': !!wine.labelImageCount, 'is-danger': !wine.labelImageCount }">
                  {{ wine.labelImageCount || 'brez' }} {{ 
                  !wine.labelImageCount || wine.labelImageCount > 4 ? 'etiket' 
                  : wine.labelImageCount == 1 ? 'etiketa' 
                  : wine.labelImageCount == 2 ? 'etiketi' 
                  : 'etikete' 
                  }} </span>
              </div>
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
  name: "WinesLabels",
  components: {
    LocaleSpan
  },
  data() {
    return {
      isLoading: true,
      wines: [],
      displayed: [],
      search: "",
      sort: "name",
      page: 0,
      pageSize: 15,
      pages: 0
    };
  },
  mounted() {
    this.load();
    this.search = this.$route.query.search || null;
    this.sort = this.$route.query.sort || "name";
    this.page = this.$route.query.page || 0;
  },
  watch: {
    $route() {
      this.filterSortAndPaginate();
    }
  },
  methods: {
    async load() {
      this.isLoading = true;
      this.wines = await this.$http
        .get("labels")
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
      this.isLoading = false;
      this.filterSortAndPaginate();
    },
    async updateQuery() {
      this.$router.replace({
        path: this.$route.path,
        query: {
          search: this.search || undefined,
          sort: this.sort,
          page: this.page || 0
        }
      });
    },
    async filterSortAndPaginate() {
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
        labels: (a, b) => (b.labelImageCount || 0) - (a.labelImageCount || 0),
        labels_asc: (a, b) => (a.labelImageCount || 0) - (b.labelImageCount || 0),
        winemaker: (a, b) =>
          (a.winemaker.name.sl || "").localeCompare(b.winemaker.name.sl || ""),
      };

      const sorted = filtered.sort(
        orders[this.$route.query ? this.$route.query.sort || "name" : "name"]
      );

      this.displayed = sorted.slice(
        this.page * this.pageSize,
        (this.page + 1) * this.pageSize
      );
      this.pages = Math.ceil(sorted.length / this.pageSize);
    }
  }
};
</script>

<style scoped>
.card {
  margin-bottom: 10px;
}

.card-header-title .level {
  flex-grow: 1;
}

.card-header-title .tag {
  margin-right: 10px;
}

.card-header-title .level-left i {
  margin-right: 3px;
}

.a {
  color: black;
}
</style>
