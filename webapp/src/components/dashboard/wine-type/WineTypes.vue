<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Vrste <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
      <div class="level-right">
        <LocalePicker v-bind:locale="locale"/>
      </div>
    </nav>

    <div class="control field has-addons" v-for="wineType in wineTypes" v-bind:key="wineType.id">
      <div class="control is-expanded">
        <LocaleString v-bind:object="wineType.name" v-bind:locale='locale.lang'/>
      </div>
      <p class="control">
        <a class="button" v-on:click="remove(wineType.id)">Odstrani</a>
      </p>
    </div>

    <!--<label class="label">Alkohol</label>-->
    <div class="control field has-addons">
      <div class="control is-expanded">
        <LocaleString v-bind:object="newTypeName" v-bind:locale='locale.lang'/>
      </div>
      <p class="control">
        <a class="button" v-on:click="add()">Dodaj</a>
      </p>
    </div>

    <div class="control field has-addons">
      <div class="button is-primary" v-on:click="save()" v-bind:class="isSaving ? 'is-loading' : ''">Shrani</div>
    </div>
  </div>
</template>

<script>
import LocalePicker from '../../common/LocalePicker';
import LocaleString from '../../common/LocaleString';

export default {
  name: "WineTypes",
  components: { LocalePicker, LocaleString },
  data: () => ({
    isLoading: true,
    isSaving: false,
    newTypeName: {},
    wineTypes: [],
    locale: {lang: 'sl'}
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
      let newWineType = await this.$http
        .post("wine-types", { name: this.newTypeName })
        .then(data => data.json())
        .catch(e => this.$root.$emit('error', e));
      this.wineTypes.push(newWineType);
      this.newTypeName = {};
    },

    async update(wineType) {
      let newWineType = await this.$http
        .put("wine-types/" + wineType.id, { name: wineType.name })
        .then(data => data.json())
        .catch(e => this.$root.$emit('error', e));
      this.wineTypes = this.wineTypes.map(
        s => (s.id === newWineType.id ? newWineType : s)
      );
    },

    async remove(id) {
      await this.$http
        .delete("wine-types/" + id)
        .catch(e => this.$root.$emit('error', e));
      await this.load();
    },

    async save() {
      let promises = [];
      this.isSaving = true;
      for(let wineType of this.wineTypes) {
        promises.push(
          this.update(wineType)
        );
      }
      await Promise.all(promises);
      this.isSaving = false;
    }
  }
};
</script>

<style scoped>
</style>

