<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Sorte <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
      <div class="level-right">
        <router-link to="/sorte/nov" class="button is-primary">Dodaj</router-link>
      </div>
    </nav>

    <div class="card" v-for="variety in varieties" v-bind:key="variety.id">
      <router-link :to="{ name: 'variety', params: { id: variety.id }}">
        <div class="card-header">
          <p class="card-header-title">
            {{ variety.name }}
          </p>
          <p class="card-header-icon" v-if="variety.hasLocalOrigins">
            <span class="tag is-dark has-text-weight-bold">Avtohtona</span>
          </p>
        </div>
      </router-link>
    </div>


  </div>
</template>

<script>
export default {
  name: "Places",
  data() {
    return {
      isLoading: true,
      varieties: []
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.isLoading = true;
      this.varieties = await this.$http
        .get("varieties")
        .then(data => data.json())
        .catch(e => this.$root.$emit('error', e));
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

