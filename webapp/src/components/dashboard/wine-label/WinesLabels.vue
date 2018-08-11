<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Etikete <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
    </nav>

    <div class="card" v-for="wine in wines" v-bind:key="wine.id">
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
                <span class="tag" v-bind:class="wine.labelImageCount >= 10 ? 'is-light' : 'is-danger'">{{ wine.labelImageCount }}/10</span>
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
  import LocaleSpan from '../../common/LocaleSpan';

  export default {
    name: 'WinesLabels',
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
        this.wines = await this.$http.get('labels').then(data => data.json())
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
