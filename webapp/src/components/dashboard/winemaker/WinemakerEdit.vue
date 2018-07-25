<template>
  <div class="section">
    <nav class="level">
      <div class="level-left">  
        <h1 class="title">
          <LocaleSpan 
            :object="isNew() && !winemaker.name[locale.lang] ? { sl: 'Nov vinar', en: 'New winemaker'} : winemaker.name" 
            :locale='locale.lang'
            :defaultToSl="true"/>
          {{ winemaker.code ? `(${winemaker.code})` : '' }}
          <span class="button is-loading is-white" v-if="isLoading"></span>
        </h1>
      </div>
      <div class="level-right">
        <LocalePicker :locale="locale" />
      </div>
    </nav>
  

    <div class="notification is-danger" v-if="this.errors.length">
      <button v-on:click="errors = []" class="delete"></button>
      <div v-for="(error, index) in errors" :key="index"><b>{{error}}</b></div>
    </div>

    <div class="field columns">
      <div class="field column">
        <label class="label">Naziv</label>
        <div class="control">
          <LocaleString :object="winemaker.name" :locale="locale.lang" :defaultToSl="true"/>
        </div>
      </div>
      <div class="field column">
        <label class="label">Kraj</label>

        <div class="control field has-addons">
          <div class="control is-expanded">
            <div class="select is-fullwidth" :class="isLoadingPlaces ? 'is-loading' : ''">
              <select v-model="winemaker.placeId">
                <option v-for="place in places" :key="place.id" :value="place.id">{{ place.name }}</option>
              </select>
            </div>
          </div>
          <div class="control">
            <button type="submit" class="button" v-on:click="loadPlaces()">Osveži</button>
          </div>
          <div class="control">
            <a href="#/kraji/nov" target="_blank" class="button">Dodaj</a>
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="field column">
        <label class="label">Spletna stran</label>
        <div class="field control has-addons">
          <div class="control is-expanded">
            <input class="input" type="text" v-model="winemaker.website">
          </div>
          <div class="control">
            <a class="button" :href="winemaker.website" target="_blank">Odpri</a>
          </div>
        </div>
      </div>
      <div class="field column">
        <label class="label">Šifra</label>
        <div class="control">
          <input class="input" type="text" v-model="winemaker.code">
        </div>
      </div>
    </div>

    <ImageBar :object="winemaker"/>
    
    <VideoBar :object="winemaker"/>

    <div class="field">
      <label class="label">Zgodba</label>
      <div class="control">
        <LocaleText :object="winemaker.background" :locale="locale.lang"/>
      </div>
    </div>

    <div class="columns">
      <div class="column field is-grouped">
        <p class="control">
          <a v-on:click="back()" class="button">Nazaj</a>
        </p>
      </div>
      <div class="column field is-grouped is-grouped-right">
        <p class="control">
          <a v-on:click="remove()" class="button is-danger">Izbrisi</a>
        </p>
        <p class="control">
          <a v-on:click="save()" class="button is-primary" :class="isSaving ? 'is-loading' : ''">Shrani</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ImageBar from "../../common/ImageBar";
import VideoBar from "../../common/VideoBar";
import LocaleSpan from "../../common/LocaleSpan";
import LocalePicker from "../../common/LocalePicker";
import LocaleString from "../../common/LocaleString";
import LocaleText from "../../common/LocaleText";

export default {
  name: "Wine",
  components: {
    ImageBar,
    VideoBar,
    LocaleSpan,
    LocalePicker,
    LocaleString,
    LocaleText
  },
  data() {
    return {
      isLoading: true,
      isLoadingPlaces: true,
      isSaving: false,
      winemaker: {},
      locale: { lang: "sl" },
      places: [],
      errors: []
    };
  },
  created() {
    this.load();
    this.loadPlaces();
  },
  watch: {
    $route: "load"
  },
  methods: {
    isNew() {
      return !this.winemaker || !Number.isInteger(+this.winemaker.id);
    },

    async load() {
      this.winemaker.id = this.$route.params.id;

      if (this.isNew()) {
        this.winemaker = { name: { sl: "", en: "" }, images: [], video: null };
      } else {
        this.isLoading = true;
        this.winemaker = await this.$http
          .get("winemakers/" + this.winemaker.id)
          .then(data => data.json());
      }
      this.isLoading = false;
    },

    async loadPlaces() {
      this.isLoadingPlaces = true;
      this.places = await this.$http.get("places").then(data => data.json());
      this.isLoadingPlaces = false;
    },

    async save() {
      this.isSaving = true;
      try {
        if (this.isNew()) {
          this.winemaker = await this.$http
            .post("winemakers", this.winemaker)
            .then(data => data.json());
        } else {
          this.winemaker = await this.$http
            .put("winemakers/" + this.winemaker.id, this.winemaker)
            .then(data => data.json());
        }
        this.back();
      } catch (e) {
        this.$root.$emit("error", e);
      }
      this.isSaving = false;
    },

    async remove() {
      try {
        if (!this.isNew()) {
          await this.$http.delete("winemakers/" + this.winemaker.id);
        }
        this.back();
      } catch (e) {
        this.$root.$emit("error", e);
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
.field.columns {
  margin-bottom: 0;
}
</style>
