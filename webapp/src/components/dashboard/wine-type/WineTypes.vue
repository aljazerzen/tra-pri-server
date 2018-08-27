<template>
  <div class="section narrow">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">Vrste <span class="button is-loading is-white" v-if="isLoading"></span></h1>
      </div>
      <div class="level-right">
        
        <div class="button" v-on:click="save()" v-bind:class="isSaving ? 'is-loading' : ''" style="margin-right: 1em">Shrani</div>
        <LocalePicker v-bind:locale="locale"/>
      </div>
    </nav>

    <div class="field columns" v-for="wineType in wineTypes" v-bind:key="wineType.id">
      <div class="column is-one-third">
        <figure class="image">
          <img :src=wineType.image.url v-if=wineType.image />
          <div class="placeholder" v-else></div>
        </figure>
      </div>

      <div class="column">
        <div class="control field has-addons">
          <div class="control is-expanded">
            <LocaleString v-bind:object="wineType.name" v-bind:locale='locale.lang'/>
          </div>
          <p class="control">
            <a class="button" v-on:click="remove(wineType.id)">Odstrani</a>
          </p>
        </div>
        <FileUploadButton route="image" caption="naloži sliko" @file-uploaded="wineType.image = $event; $forceUpdate()"/>
      </div>
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
  </div>
</template>

<script>
import LocalePicker from "../../common/LocalePicker";
import LocaleString from "../../common/LocaleString";
import FileUploadButton from "../../common/FileUploadButton";

export default {
  name: "WineTypes",
  components: { LocalePicker, LocaleString, FileUploadButton },
  data: () => ({
    isLoading: true,
    isSaving: false,
    newTypeName: {},
    wineTypes: [],
    locale: { lang: "sl" }
  }),
  created() {
    this.load();
  },
  beforeRouteLeave(to, from, next) {
    this.save().then(next);
  },
  methods: {
    async load() {
      this.isLoading = true;
      this.wineTypes = await this.$http
        .get("wine-types")
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
      this.isLoading = false;
    },

    async add() {
      let newWineType = await this.$http
        .post("wine-types", { name: this.newTypeName })
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
      this.wineTypes.push(newWineType);
      this.newTypeName = {};
    },

    async update(wineType) {
      let newWineType = await this.$http
        .put("wine-types/" + wineType.id, {
          name: wineType.name,
          image: wineType.image
        })
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
      this.wineTypes = this.wineTypes.map(
        s => (s.id === newWineType.id ? newWineType : s)
      );
    },

    async remove(id) {
      await this.$http
        .delete("wine-types/" + id)
        .catch(e => this.$root.$emit("error", e));
      await this.load();
    },

    async save() {
      this.isSaving = true;
      await Promise.all(this.wineTypes.map(t => this.update(t)));
      this.isSaving = false;
    }
  }
};
</script>

<style scoped>
figure.image .placeholder {
  border: 1px dashed grey;
  border-radius: 6px;
  background: #eee;
  height: 200px;
  width: 100%;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
figure.image img {
  background-image: linear-gradient(45deg, #ddd 25%, transparent 25%),
    linear-gradient(-45deg, #ddd 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ddd 75%),
    linear-gradient(-45deg, transparent 75%, #ddd 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style>

