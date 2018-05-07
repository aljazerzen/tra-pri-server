<template>
    <div class="section narrow">

      <nav class="level">
        <div class="level-left">
          <h1 class="title">Kraji <span class="button is-loading is-white" v-if="isLoading"></span></h1>
        </div>
        <div class="level-right">
          <router-link to="/kraji/nov" class="button is-primary">Dodaj</router-link>
        </div>
      </nav>

      <div class="card" v-for="place in places" v-bind:key="place.id">
        <router-link :to="{ name: 'place', params: { id: place.id }}">
          <div class="card-header">
            <p class="card-header-title">
              {{ place.name }}
            </p>
          </div>
        </router-link>
      </div>


    </div>
</template>

<script>
  import { errorHandler } from '../../../errorHandler';

  export default {
    name: 'Places',
    data() {
      return {
        isLoading: true,
        places: [],
      };
    },
    mounted() {
      this.load();
    },
    methods: {
      async load() {
        this.isLoading = true;
        this.places = await this.$http.get('places').then(data => data.json()).catch(errorHandler(this));
        this.isLoading = false;
      }
    }
  };
</script>

<style scoped>
  .card {
    margin-bottom: 10px;
  }

  .card:last-child {
    margin-bottom: 0;
  }
</style>

