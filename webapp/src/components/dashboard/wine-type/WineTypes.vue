<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Vrste <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
    </nav>

    <div class="control field has-addons" v-for="wineType in wineTypes" v-bind:key="wineType.id">
      <div class="control is-expanded">
        <input class="input" type="text" v-model="wineType.name" v-on:keypress="wineType.isDirty = true"
               v-bind:class="wineType.isDirty ? 'is-primary' : ''">
      </div>
      <p class="control">
        <a class="button" v-on:click="update(wineType)">Posodobi</a>
      </p>
      <p class="control">
        <a class="button" v-on:click="remove(wineType.id)">Odstrani</a>
      </p>
    </div>

    <!--<label class="label">Alkohol</label>-->
    <div class="control field has-addons">
      <div class="control is-expanded">
        <input class="input" type="text" v-model="newTypeName">
      </div>
      <p class="control">
        <a class="button is-primary" v-on:click="add()">Dodaj</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "WineTypes",
  data: () => ({
    isLoading: true,
    newTypeName: "",
    wineTypes: []
  }),
  created() {
    this.load();
  },
  methods: {
    async load() {
      this.isLoading = true;
      this.wineTypes = await this.$http
        .get("wine-types")
        .then(data => data.json())
        .catch(e => this.$root.$emit('error', e));
      this.isLoading = false;
    },

    async add() {
      let newSugar = await this.$http
        .post("wine-types", { name: this.newTypeName })
        .then(data => data.json())
        .catch(e => this.$root.$emit('error', e));
      this.wineTypes.push(newSugar);
      this.newTypeName = "";
    },

    async update(wineType) {
      let newSugar = await this.$http
        .put("wine-types/" + wineType.id, { name: wineType.name })
        .then(data => data.json())
        .catch(e => this.$root.$emit('error', e));
      this.wineTypes = this.wineTypes.map(
        s => (s.id === newSugar.id ? newSugar : s)
      );
    },

    async remove(id) {
      await this.$http
        .delete("wine-types/" + id)
        .catch(e => this.$root.$emit('error', e));
      await this.load();
    }
  }
};
</script>

<style scoped>
</style>

