<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Vsebinski paketi <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
      <div class="level-right">
        <a v-on:click="createPack()" class="button is-large is-primary" v-bind:class="isCreating ? 'is-loading' : ''">
          Ustvari novega
        </a>
      </div>
    </nav>

    <div class="notification is-danger" v-if="this.errors.length">
      <button v-on:click="errors = []" class="delete"></button>
      <div v-for="(error, index) in errors" v-bind:key="index"><b>{{error}}</b></div>
    </div>

    <PackageCard v-for="pack in packages" v-bind:key="pack.id" v-bind:pack="pack" v-on:activated="activated($event)"/>
  </div>
</template>

<script>
  import { errorHandler } from '../../../errorHandler';
  import PackageCard from './PackageCard';

  export default {
    name: 'Packages',
    components: { PackageCard },
    data() {
      return {
        isLoading: true,
        isCreating: false,
        hasCreated: false,
        packages: [],
        errors: [],
      };
    },
    mounted() {
      this.load();
    },
    methods: {
      async load() {
        this.isLoading = true;
        this.packages = await this.$http.get('packages').then(data => data.json()).catch(errorHandler(this));
        this.isLoading = false;
      },

      activated(event) {
        for (let pack of this.packages)
          pack.active = pack.id === event.packageId;
      },

      async createPack() {
        this.isCreating = true;
        this.errors = [];

        try {
          const pack = await this.$http.post('packages').then(data => data.json());
          this.packages.unshift(pack);
          this.hasCreated = true;
        } catch(e) {
          errorHandler(this)(e);
        }

        this.isCreating = false;
      }
    }
  };
</script>
