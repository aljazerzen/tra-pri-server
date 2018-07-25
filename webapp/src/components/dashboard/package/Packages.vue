<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Vsebinski paketi <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
      <div class="level-right">
      
      </div>
    </nav>

    <div class='box has-background-info has-text-white columns' v-if="readyResources">
      <div class="column">
        <b>
          Nov paket bo vseboval {{ readyResources.wineCount }} vin, 
          {{ readyResources.winemakerCount }} vinarjev in
          {{ readyResources.fileCount }} slik ali videoposnetkov<br>
          <br>
          Model ustvarjen: {{ readyResourcesModelCreatedAt }} 
        </b>
      </div>
      <div class="column">
        <a v-on:click="createPack()" class="button is-pulled-right is-white" v-bind:class="isCreating ? 'is-loading' : ''">
          Zapakiraj novega
        </a>
      </div>
    </div> 

    <div class="notification is-danger" v-if="this.errors.length">
      <button v-on:click="errors = []" class="delete"></button>
      <div v-for="(error, index) in errors" v-bind:key="index"><b>{{error}}</b></div>
    </div>

    <PackageCard v-for="pack in packages" v-bind:key="pack.id" v-bind:pack="pack" v-on:activated="activated($event)"/>
  </div>
</template>

<script>
import PackageCard from "./PackageCard";
import moment from "moment";

moment.locale("sl");

export default {
  name: "Packages",
  components: { PackageCard },
  data() {
    return {
      isLoading: true,
      isCreating: false,
      hasCreated: false,
      packages: [],
      errors: [],
      readyResources: {}
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.isLoading = true;
      this.packages = await this.$http
        .get("packages")
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
      this.readyResources = await this.$http
        .get("packages/ready")
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
      this.isLoading = false;
    },

    activated(event) {
      for (let pack of this.packages) pack.active = pack.id === event.packageId;
    },

    async createPack() {
      this.isCreating = true;
      this.errors = [];

      try {
        const pack = await this.$http
          .post("packages")
          .then(data => data.json());
        this.packages.unshift(pack);
        this.hasCreated = true;
      } catch (e) {
        this.$root.$emit("error", e);
      }

      this.isCreating = false;
    }
  },
  computed: {
    readyResourcesModelCreatedAt: function() {
      return this.readyResources ? moment(this.readyResources.model.createdAt).calendar() : null;
    },
  }
};
</script>
