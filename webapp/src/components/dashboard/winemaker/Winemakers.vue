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

    <div class="card" v-for="winemaker in winemakers" v-bind:key="winemaker.id">
      <router-link :to="{ name: 'winemaker', params: { id: winemaker.id }}">
        <div class="card-header">
          <div class="card-header-title level">
            <p class="level-left">{{ winemaker.name }}</p>
            <p class="level-right " v-if="winemaker.place">{{ winemaker.place.name }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
  import { errorHandler } from '../../../errorHandler';

  export default {
    name: 'Winemakers',
    data() {
      return {
        isLoading: true,
        winemakers: []
      };
    },
    mounted() {
      this.load();
    },
    methods: {
      async load() {
        this.isLoading = true;
        this.winemakers = await this.$http.get('winemakers').then(data => data.json()).catch(errorHandler(this));
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
</style>