<template>
  <div class="section">
  
    <nav class="level">
      <div class="level-left">
        <h1 class="title">
          {{ isNew() ? wine.name || 'Novo vino' : wine.name }}{{ wine.year ? ', ' + wine.year : '' }} {{ wine.code ? `(${wine.code})` : '' }}
          <span class="button is-loading is-white" v-if="isLoading"></span>
          <span v-if="wine.hidden" class="tag is-danger">Skrito</span>
        </h1>
      </div>
      <div class="level-right">
        <LocalePicker :locale="locale" />
      </div>
    </nav>
  
    <div class="columns">
      <div class="column field is-grouped">
        <p class="control">
          <a @click="$router.go(-1)" class="button">
            <span class="icon is-small">
              <i class="fas fa-arrow-left"></i>
            </span>
          </a>
        </p>
      </div>
      <div class="column field is-grouped is-grouped-right">
        <div class="control">
          <div class="button" @click.stop="toggleHidden(wine)">
            <span class="icon is-small">
              <i class="fas" :class="{ 'fa-eye-slash': !wine.hidden, 'fa-eye': wine.hidden }"></i>
            </span>
            <span>{{ wine.hidden ? 'Pokaži' : 'Skrij' }}</span>
          </div>
        </div>
        <p class="control">
          <a @click="remove()" class="button is-danger">
            <span class="icon is-small">
              <i class="fas fa-trash-alt"></i>
            </span>
            <span>Izbrisi</span>
          </a>
        </p>
        <p class="control">
          <a @click="save()" class="button is-primary" :class="isSaving ? 'is-loading' : ''">
            <span class="icon is-small">
              <i class="fas fa-save"></i>
            </span>
            <span>Shrani</span>
          </a>
        </p>
      </div>
    </div>

    <div class="field">
      <label class="label">Naziv</label>
      <div class="control">
        <input class="input" type="text" v-model="wine.name">
      </div>
    </div>
  
    <div class="field">
      <label class="label">Vinar</label>
  
      <div class="control field has-addons">
        <div class="control is-expanded">
          <div class="select is-fullwidth" :class="isLoadingWinemakers ? 'is-loading' : ''">
            <select v-model="wine.winemakerId">
              <option v-for="winemaker in winemakers" :key="winemaker.id" :value="winemaker.id">
                <LocaleSpan :object="winemaker.name" :locale="locale.lang" :defaultToSl="true"/>
              </option>
            </select>
          </div>
        </div>
        <div class="control">
          <button type="submit" class="button" @click="loadWinemakers()">Osveži</button>
        </div>
        <div class="control">
          <a href="#/vinarji/nov" target="_blank" class="button">Dodaj</a>
        </div>
      </div>
    </div>
  
    <ImageBar :object="wine" />
  
    <div class="field columns">
      <div class="field column">
        <label class="label">Vrsta</label>
  
        <div class="control field has-addons">
          <div class="control is-expanded">
            <div class="select is-fullwidth">
              <select v-model="wine.typeId">
                <option v-for="wineType in wineTypes" :key="wineType.id" :value="wineType.id">
                  <LocaleSpan :object="wineType.name" :locale="locale.lang"/>
                </option>
              </select>
            </div>
          </div>
          <div class="control">
            <a href='#/vrste' target="_blank" class="button">Urejaj</a>
          </div>
        </div>
      </div>
      <div class="field column">
        <label class="label">Sladkor</label>
  
        <div class="control field has-addons">
          <div class="control is-expanded">
            <div class="select is-fullwidth">
              <select v-model="wine.sugarId">
                <option v-for="sugar in sugars" :key="sugar.id" :value="sugar.id">
                  <LocaleSpan :object="sugar.name" :locale="locale.lang"/>
                </option>
              </select>
            </div>
          </div>
          <div class="control">
            <a href='#/sladkor' target="_blank" class="button">Urejaj</a>
          </div>
        </div>
      </div>
    </div>
  
    <div class="field">
      <label class="label">Sorte</label>
  
      <div class="field is-grouped is-grouped-multiline">
        <div class="control" v-for="variety in wine.varieties" :key="variety.id">
          <div class="tags has-addons">
            <a class="tag is-medium is-dark">
              <LocaleSpan :object="variety.name" :locale="locale.lang" :defaultToSl="true"/>
            </a>
            <a class="tag is-medium is-danger is-delete" @click="removeVariety(variety)"></a>
          </div>
        </div>
  
  
        <div class="control">
          <div class="dropdown" :class="addVarietyDropdown ? 'is-active' : ''">
            <div class="dropdown-trigger">
              <a class="tag is-primary is-medium" aria-haspopup="true" aria-controls="dropdown-menu" @click="addVarietyDropdown = !addVarietyDropdown">
                <span>Dodaj</span>
              </a>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <a class="dropdown-item" v-for="variety in varieties" :key="variety.id" @click="addVariety(variety)">
                  <LocaleSpan :object="variety.name" :lang="locale.lang" :defaultToSl="true"/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  
    </div>
  
    <div class="field columns">
      <div class="field column">
        <label class="label">Letnik</label>
        <div class="control">
          <input class="input" type="number" v-model="wine.year">
        </div>
      </div>
      <div class="field column">
        <label class="label">Šifra</label>
        <div class="control">
          <input class="input" type="text" v-model="wine.code">
        </div>
      </div>
    </div>
  
    <div class="field">
      <label class="label">Značilnosti</label>
      <div class="control">
        <LocaleText :object="wine.features" :locale="locale.lang" />
      </div>
    </div>
  
    <div class="field">
      <label class="label">Nagrade</label>
      <div class="control">
        <LocaleText :object="wine.awards" :locale="locale.lang" :rows="2" />
      </div>
    </div>
  
    <div class="field">
      <label class="label">Kulinarika</label>
      <div class="control">
        <LocaleText :object="wine.culinary" :locale="locale.lang" :rows="2" />
      </div>
    </div>
  
  <div class="field">
      <label class="label">Priporočena temperatura</label>
      <div class="control field has-addons" v-if="wine.temperature">
        <p class="control">
          <a class="button is-static">od</a>
        </p>
        <div class="control is-expanded">
          <input class="input" type="number" v-model="wine.temperature.from" step="1">
        </div>
        <p class="control">
          <a class="button is-static">℃</a>
        </p>
        <p class="control">
          <a class="button is-static">do</a>
        </p>
        <div class="control is-expanded">
          <input class="input" type="number" v-model="wine.temperature.to" step="1">
        </div>
        <p class="control">
          <a class="button is-static">℃</a>
        </p>
      </div>
    </div>
  
    <div class="field columns">
  
      <div class="field column">
        <label class="label">Cena</label>
        <div class="control field has-addons">
          <div class="control is-expanded">
            <input class="input" type="number" v-model="wine.price" step="1">
          </div>
          <p class="control">
            <a class="button is-static">€</a>
          </p>
        </div>
      </div>
  
      <div class="field column">
        <label class="label">Prostornina</label>
        <div class="control field has-addons">
          <div class="control is-expanded">
            <input class="input" type="number" v-model="wine.volume" step="0.25">
          </div>
          <p class="control">
            <a class="button is-static">L</a>
          </p>
        </div>
      </div>
  
      <div class="field column">
        <label class="label">Alkohol</label>
        <div class="control field has-addons">
          <div class="control is-expanded">
            <input class="input" type="number" v-model="wine.abv" step="0.5">
          </div>
          <p class="control">
            <a class="button is-static">%</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageBar from "../../common/ImageBar";
import LocaleText from "../../common/LocaleText";
import LocalePicker from "../../common/LocalePicker";
import LocaleSpan from "../../common/LocaleSpan";

export default {
  name: "Wine",
  components: {
    ImageBar,
    LocaleText,
    LocalePicker,
    LocaleSpan
  },
  data() {
    return {
      isLoading: true,
      isLoadingWinemakers: true,
      isSaving: false,
      locale: {
        lang: "sl"
      },
      addVarietyDropdown: false,
      wine: {},
      errors: [],
      winemakers: [],
      wineTypes: [],
      sugars: [],
      varieties: []
    };
  },
  created() {
    this.load();
    this.loadWinemakers();
    this.loadWineTypes();
    this.loadSugars();
    this.loadVarieties();
  },
  watch: {
    $route: "load"
  },
  methods: {
    isNew() {
      return !this.wine || !Number.isInteger(+this.wine.id);
    },

    async load() {
      this.wine.id = this.$route.params.id;

      if (this.isNew())
        this.wine = {
          name: "",
          varietyIds: [],
          volume: 0.75,
          images: [],
          features: { sl: "", en: "" },
          awards: { sl: "", en: "" },
          culinary: { sl: "", en: "" },
          temperature: {}
        };
      else {
        this.isLoading = true;
        this.wine = await this.$http
          .get("wines/" + this.wine.id)
          .then(data => data.json())
          .catch(e => this.$root.$emit("error", e));
      }
      this.isLoading = false;
    },

    async loadWinemakers() {
      this.isLoadingWinemakers = true;
      this.winemakers = await this.$http
        .get("winemakers")
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
      this.isLoadingWinemakers = false;
    },

    async loadWineTypes() {
      this.wineTypes = await this.$http
        .get("wine-types")
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
    },

    async loadSugars() {
      this.sugars = await this.$http
        .get("sugars")
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
    },

    async loadVarieties() {
      this.varieties = await this.$http
        .get("varieties")
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
    },

    async save() {
      this.wine.year = +this.wine.year || null;
      this.wine.price = +this.wine.price || null;
      this.wine.abv = +this.wine.abv || null;
      this.wine.volume = +this.wine.volume || null;
      if(this.wine.temperature) {
        this.wine.temperature.from = this.wine.temperature.from == null ? null : +this.wine.temperature.from;
        this.wine.temperature.to = this.wine.temperature.to == null ? null : +this.wine.temperature.to;
      }
      if (this.wine.varieties) {
        this.wine.varietyIds = this.wine.varieties.map(v => v.id);
      }

      this.isSaving = true;
      try {
        if (this.isNew()) {
          this.wine = await this.$http
            .post("wines", this.wine)
            .then(data => data.json());
        } else {
          this.wine = await this.$http
            .put("wines/" + this.wine.id, this.wine)
            .then(data => data.json());
        }
        this.$router.go(-1);
      } catch (e) {
        this.$root.$emit("error", e);
      }
      this.isSaving = false;
    },

    addVariety(variety) {
      if (!this.wine.varieties) this.wine.varieties = [];
      this.wine.varieties.push(variety);

      const onlyUnique = (v, index, array) =>
        array.findIndex(el => el.id === v.id) === index;
      this.wine.varieties = this.wine.varieties.filter(onlyUnique);

      this.addVarietyDropdown = false;
    },

    removeVariety(variety) {
      if (!this.wine.varieties) return;
      this.wine.varieties = this.wine.varieties.filter(
        v => v.id !== variety.id
      );
    },

    async remove() {
      if (!this.isNew()) {
        await this.$http
          .delete("wines/" + this.wine.id)
          .catch(e => this.$root.$emit("error", e));
      }
      this.$router.go(-1);
    },
    async toggleHidden(wine) {
      const res = await this.$http
        .put(`wines/${wine.id}/hidden`)
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
      wine.hidden = res.hidden;
    }
  }
};
</script>

<style scoped>
.field.columns {
  margin-bottom: -12px;
}
</style>
