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
            <p class="level-left">{{ wine.name }} <span v-if="wine.year" class="tag is-light">{{ wine.year}}</span></p>
            <p class="level-right " v-if="wine.code">{{ wine.code }}</p>
          </div>
        </div>
      </router-link>
    </div>

    <!--<nav class="panel">
      <p class="panel-heading">
        Vina
      </p>
      <div class="panel-block">
        <p class="control has-icons-left">
          <input class="input is-small" type="text" placeholder="search">
          <span class="icon is-small is-left">
            <i class="fas fa-search" aria-hidden="true"></i>
          </span>
        </p>
      </div>
      <a class="panel-block is-active">
        <span class="panel-icon">
          <i class="fas fa-book" aria-hidden="true"></i>
        </span>
        bulma
      </a>
      <a class="panel-block">
        <span class="panel-icon">
          <i class="fas fa-book" aria-hidden="true"></i>
        </span>
        marksheet
      </a>
      <a class="panel-block">
        <span class="panel-icon">
          <i class="fas fa-book" aria-hidden="true"></i>
        </span>
        minireset.css
      </a>
      <a class="panel-block">
        <span class="panel-icon">
          <i class="fas fa-book" aria-hidden="true"></i>
        </span>
        jgthms.github.io
      </a>
      <a class="panel-block">
        <span class="panel-icon">
          <i class="fas fa-code-fork" aria-hidden="true"></i>
        </span>
        daniellowtw/infboard
      </a>
      <a class="panel-block">
        <span class="panel-icon">
          <i class="fas fa-code-fork" aria-hidden="true"></i>
        </span>
        mojs
      </a>
    </nav>-->
  </div>
</template>

<script>
  export default {
    name: 'Wines',
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
    margin-left: 10px;
  }

  .a {
    color: black;
  }
</style>
