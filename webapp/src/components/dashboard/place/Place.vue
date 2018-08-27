<template>
  <section class="section">
    <h1 class="title">
      {{ isNew() ? place.name || 'Nov kraj' : place.name }}
    </h1>

    <div class="field">
      <label class="label">Ime</label>
      <div class="control">
        <input class="input" type="text" v-model="place.name">
      </div>
    </div>

    <div class="field">
      <figure v-if="place && place.image">
        <img :src=place.image.url />
      </figure>
      <FileUploadButton route='image' caption='Naloži sliko' @file-uploaded='place.image = $event; $forceUpdate()'/>
    </div>

    <div class="columns">
      <div class="column field">
        <div class="control"><a v-on:click="back()" class="button">Nazaj</a></div>
      </div>
      <div class="column field is-grouped is-grouped-right">
        <div class="control"><a v-on:click="remove()" class="button is-danger">Izbrisi</a></div>
        <div class="control"><a v-on:click="save()" class="button is-primary">Shrani</a></div>
      </div>
    </div>


  </section>
</template>

<script>
import FileUploadButton from '../../common/FileUploadButton.vue';

export default {
  name: "Place",
  components: { FileUploadButton },
  data() {
    return {
      place: {},
      map: null,
      marker: null
    };
  },
  created() {
    this.load();
  },
  watch: {
    $route: "load"
  },
  methods: {
    isNew() {
      return !this.place || !Number.isInteger(+this.place.id);
    },

    async load() {
      this.place.id = this.$route.params.id;

      if (this.isNew()) this.place = { name: "" };
      else {
        this.place = await this.$http
          .get("places/" + this.place.id)
          .then(data => data.json());
      }
    },

    async save() {
      if (this.isNew()) {
        this.place = await this.$http
          .post("places", this.place)
          .then(data => data.json());
      } else {
        this.place = await this.$http
          .put("places/" + this.place.id, this.place)
          .then(data => data.json());
      }
      this.back();
    },

    async remove() {
      try {
        if (!this.isNew()) {
          await this.$http.delete("places/" + this.place.id);
        }
        this.back();
      } catch (e) {
        this.$root.$emit('error', e);
      }
    },

    back() {
      if (window.history.length === 1) window.close();
      else this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
#map {
  height: 500px;
  margin-bottom: 1em;
}
</style>
