<template>
  <section class="section narrow">
    <nav class="level">
      <div class="level-left">
        <h1 class="title">
          <LocaleSpan v-bind:object="isNew() ? variety.name || 'Nova sorta' : variety.name" v-bind:locale='locale.lang' :defaultToSl="true"/>
        </h1>
      </div>
      <div class="level-right">
        <LocalePicker v-bind:locale="locale" />
      </div>
    </nav>

    <div class="field">
      <label class="label">Ime</label>
      <div class="control">
        <LocaleString v-bind:object="variety.name" v-bind:locale="locale.lang" :defaultToSl="true"/>
      </div>
    </div>
    <div class="field">
      <label class="checkbox">
        <input type="checkbox" v-model="variety.hasLocalOrigins">
        Avtohnona vrsta
      </label>
    </div>

    <div class="field">
      <label class="label">Opis</label>
      <div class="control">
        <LocaleText v-bind:object="variety.description" v-bind:locale="locale.lang"/>
      </div>
    </div>

    <ImageBar v-bind:object="variety"/>

    <div class="columns">
      <div class="field column">
        <div class="control">
          <a v-on:click="back()" class="button">Nazaj</a>
        </div>
      </div>
      <div class="field column is-grouped is-grouped-right">
        <div class="control">
          <a v-on:click="remove()" class="button is-danger">Izbrisi</a>
        </div>
        <div class="control">
          <a v-on:click="save()" class="button is-primary">Shrani</a>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import ImageBar from "../../common/ImageBar";
import LocaleSpan from "../../common/LocaleSpan";
import LocalePicker from "../../common/LocalePicker";
import LocaleString from "../../common/LocaleString";
import LocaleText from "../../common/LocaleText";

export default {
  name: "Variety",
  components: { ImageBar, LocaleSpan, LocalePicker, LocaleString, LocaleText },
  data() {
    return {
      variety: {},
      locale: { lang: "sl" }
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
      return !this.variety || !Number.isInteger(+this.variety.id);
    },

    async load() {
      this.variety.id = this.$route.params.id;

      if (this.isNew())
        this.variety = {
          name: { sl: "", en: "" },
          description: { sl: "", en: "" },
          images: [],
          hasLocalOrigins: false
        };
      else {
        this.variety = await this.$http
          .get("varieties/" + this.variety.id)
          .then(data => data.json())
          .catch(e => this.$root.$emit("error", e));
      }
    },

    async save() {
      try {
        if (this.isNew()) {
          this.variety = await this.$http
            .post("varieties", this.variety)
            .then(data => data.json());
        } else {
          this.variety = await this.$http
            .put("varieties/" + this.variety.id, this.variety)
            .then(data => data.json());
        }
        this.back();
      } catch (e) {
        this.$root.$emit("error", e);
      }
    },

    async remove() {
      if (!this.isNew()) {
        await this.$http
          .delete("varieties/" + this.variety.id)
          .catch(e => this.$root.$emit("error", e));
      }
      this.back();
    },

    back() {
      if (window.history.length === 1) window.close();
      else this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
</style>
