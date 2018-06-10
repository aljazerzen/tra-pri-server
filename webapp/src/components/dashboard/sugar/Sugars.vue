<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Sladkor <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
      <div class="level-right">
        <LocalePicker v-bind:locale="locale"/>
      </div>
    </nav>

    <div class="control field has-addons" v-for="sugar in sugars" v-bind:key="sugar.id">
      <div class="control is-expanded">
        <LocaleString v-bind:object="sugar.name" v-bind:locale='locale.lang'/>
      </div>
      <p class="control">
        <a class="button" v-on:click="remove(sugar.id)">Odstrani</a>
      </p>
    </div>

    <!--<label class="label">Alkohol</label>-->
    <div class="control field has-addons">
      <div class="control is-expanded">
        <LocaleString v-bind:object="newSugarName" v-bind:locale='locale.lang'/>
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
  name: "Sugars",
  components: { LocalePicker, LocaleString },
  data: () => ({
    isLoading: true,
    isSaving: false,
    newSugarName: {},
    sugars: [],
    locale: { lang: 'sl' },
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
      this.newSugarName = {};
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
    },
    async save() {
      let promises = [];
      this.isSaving = true;
      for(let sugar of this.sugars) {
        promises.push(
          this.update(sugar)
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

