<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Sladkor <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
    </nav>

    <div class="control field has-addons" v-for="sugar in sugars" v-bind:key="sugar.id">
      <div class="control is-expanded">
        <input class="input" type="text" v-model="sugar.name" v-on:keypress="sugar.isDirty = true"
               v-bind:class="sugar.isDirty ? 'is-primary' : ''">
      </div>
      <p class="control">
        <a class="button" v-on:click="update(sugar)">Posodobi</a>
      </p>
      <p class="control">
        <a class="button" v-on:click="remove(sugar.id)">Odstrani</a>
      </p>
    </div>

    <!--<label class="label">Alkohol</label>-->
    <div class="control field has-addons">
      <div class="control is-expanded">
        <input class="input" type="text" v-model="newSugarName">
      </div>
      <p class="control">
        <a class="button is-primary" v-on:click="add()">Dodaj</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sugars",
  data: () => ({
    isLoading: true,
    newSugarName: "",
    sugars: []
  }),
  created() {
    this.load();
  },
  methods: {
    async load() {
      this.isLoading = true;
      this.sugars = await this.$http
        .get("sugars")
        .then(data => data.json())
        .catch(e => this.$root.$emit('error', e));
      this.isLoading = false;
    },
    async add() {
      let newSugar = await this.$http
        .post("sugars", { name: this.newSugarName })
        .then(data => data.json())
        .catch(e => this.$root.$emit('error', e));
      this.sugars.push(newSugar);
      this.newSugarName = "";
    },
    async update(sugar) {
      let newSugar = await this.$http
        .put("sugars/" + sugar.id, { name: sugar.name })
        .then(data => data.json())
        .catch(e => this.$root.$emit('error', e));
      this.sugars = this.sugars.map(s => (s.id === newSugar.id ? newSugar : s));
    },
    async remove(id) {
      await this.$http
        .delete("sugars/" + id)
        .catch(e => this.$root.$emit('error', e));
      await this.load();
    }
  }
};
</script>

<style scoped>
</style>

