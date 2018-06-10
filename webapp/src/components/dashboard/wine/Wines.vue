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

    <div class="card" v-for="wine in wines" v-bind:key="wine.id">
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
import LocaleSpan from '../../common/LocaleSpan';

  export default {
    name: 'Wines',
    components: {
      LocaleSpan
    },
    data() {
      return {
        isLoading: true,
        wines: []
      };
    },
    mounted() {
      this.load();
    },
    methods: {
      async load() {
        this.isLoading = true;
        this.wines = await this.$http.get('wines').then(data => data.json());
        this.isLoading = false;
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
