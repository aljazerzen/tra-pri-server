<template>
  <div class="section">
    <h1 class="title">
      {{ isNew() ? wine.name || 'Novo vino' : wine.name }}{{ wine.year ? ', ' + wine.year : '' }} {{ wine.code ?
      `(${wine.code})` : '' }}
      <span class="button is-loading is-white" v-if="isLoading"></span>
    </h1>

    <div class="notification is-danger" v-if="this.errors.length">
      <button v-on:click="errors = []" class="delete"></button>
      <div v-for="(error, index) in errors" v-bind:key="index"><b>{{error}}</b></div>
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
          <div class="select is-fullwidth" v-bind:class="isLoadingWinemakers ? 'is-loading' : ''">
            <select v-model="wine.winemakerId">
              <option v-for="winemaker in winemakers" v-bind:key="winemaker.id" v-bind:value="winemaker.id">
                {{ winemaker.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="control">
          <button type="submit" class="button" v-on:click="loadWinemakers()">Osveži</button>
        </div>
        <div class="control">
          <a href="/vinarji/nov" target="_blank" class="button">Dodaj</a>
        </div>
      </div>
    </div>

    <div class="field columns">
      <div class="field column">
        <label class="label">Vrsta</label>

        <div class="control is-expanded">
          <div class="select is-fullwidth">
            <select v-model="wine.typeId">
              <option v-for="wineType in wineTypes" v-bind:key="wineType.id" v-bind:value="wineType.id">
                {{ wineType.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="field column">
        <label class="label">Sladkor</label>
        <div class="control is-expanded">
          <div class="select is-fullwidth">
            <select v-model="wine.sugarId">
              <option v-for="sugar in sugars" v-bind:key="sugar.id" v-bind:value="sugar.id">
                {{ sugar.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">Sorte</label>

      <div class="field is-grouped is-grouped-multiline">
        <div class="control" v-for="variety in wine.varieties" v-bind:key="variety.id">
          <div class="tags has-addons">
            <a class="tag is-medium is-dark">{{ variety.name }}</a>
            <a class="tag is-medium is-danger is-delete" v-on:click="removeVariety(variety)"></a>
          </div>
        </div>


        <div class="control">
          <div class="dropdown" v-bind:class="addVarietyDropdown ? 'is-active' : ''">
            <div class="dropdown-trigger">
              <a class="tag is-primary is-medium" aria-haspopup="true" aria-controls="dropdown-menu"
                 v-on:click="addVarietyDropdown = !addVarietyDropdown">
                <span>Dodaj</span>
              </a>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <a class="dropdown-item" v-for="variety in varieties" v-bind:key="variety.id"
                   v-on:click="addVariety(variety)">
                  {{ variety.name }}
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
        <textarea class="textarea" v-model="wine.features"></textarea>
      </div>
    </div>
    <div class="field">
      <label class="label">Nagrade</label>
      <div class="control">
        <textarea class="textarea" v-model="wine.awards" v-bind:rows="2"></textarea>
      </div>
    </div>

    <div class="field columns">
      <div class="field column">
        <label class="label">Priporočena temperatura</label>
        <div class="control">
          <input class="input" type="text" v-model="wine.temperature">
        </div>
      </div>
      <div class="field column">
        <label class="label">Kulinarika</label>
        <div class="control">
          <input class="input" type="text" v-model="wine.culinary">
        </div>
      </div>

    </div>
    <div class="field columns">

      <div class="field column">
        <label class="label">Cena</label>
        <div class="control field has-addons">
          <div class="control is-expanded">
            <input class="input" type="number" v-model="wine.price">
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
            <input class="input" type="number" v-model="wine.volume">
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
            <input class="input" type="number" v-model="wine.abv">
          </div>
          <p class="control">
            <a class="button is-static">%</a>
          </p>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column field is-grouped">
        <p class="control">
          <a v-on:click="$router.go(-1)" class="button">Nazaj</a>
        </p>
      </div>
      <div class="column field is-grouped is-grouped-right">
        <p class="control">
          <a v-on:click="remove()" class="button is-danger">Izbrisi</a>
        </p>
        <p class="control">
          <a v-on:click="save()" class="button is-primary" v-bind:class="isSaving ? 'is-loading' : ''">Shrani</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { errorHandler } from '../../../errorHandler';

  export default {
    name: 'Wine',
    data() {
      return {
        isLoading: true,
        isLoadingWinemakers: true,
        isSaving: false,
        addVarietyDropdown: false,
        wine: {},
        errors: [],
        winemakers: [],
        wineTypes: [],
        sugars: [],
        varieties: [],
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
      '$route': 'load'
    },
    methods: {
      isNew() {
        return !this.wine || !Number.isInteger(+this.wine.id);
      },

      async load() {
        this.wine.id = this.$route.params.id;

        if (this.isNew())
          this.wine = { name: '', varietyIds: [] };
        else {
          this.isLoading = true;
          this.wine = await this.$http.get('wines/' + this.wine.id).then(data => data.json())
            .catch(errorHandler(this));
        }
        this.isLoading = false;
      },

      async loadWinemakers() {
        this.isLoadingWinemakers = true;
        this.winemakers = await this.$http.get('winemakers').then(data => data.json())
          .catch(errorHandler(this));
        this.isLoadingWinemakers = false;
      },

      async loadWineTypes() {
        this.wineTypes = await this.$http.get('wine-types').then(data => data.json())
          .catch(errorHandler(this));
      },

      async loadSugars() {
        this.sugars = await this.$http.get('sugars').then(data => data.json())
          .catch(errorHandler(this));
      },

      async loadVarieties() {
        this.varieties = await this.$http.get('varieties').then(data => data.json())
          .catch(errorHandler(this));
      },

      async save() {
        this.wine.year = +this.wine.year || null;
        this.wine.price = +this.wine.price || null;
        this.wine.abv = +this.wine.abv || null;
        this.wine.volume = +this.wine.volume || null;
        if (this.wine.varieties) {
          this.wine.varietyIds = this.wine.varieties.map(v => v.id);
        }

        this.isSaving = true;
        try {
          if (this.isNew()) {
            this.wine = await this.$http.post('wines', this.wine).then(data => data.json());
          } else {
            this.wine = await this.$http.put('wines/' + this.wine.id, this.wine).then(data => data.json());
          }
          this.$router.go(-1);
        } catch (e) {
          errorHandler(this)(e);
        }
        this.isSaving = false;
      },

      addVariety(variety) {
        if(!this.wine.varieties)
          this.wine.varieties = [];
        this.wine.varieties.push(variety);

        const onlyUnique = (v, index, array) => array.findIndex(el => el.id === v.id) === index;
        this.wine.varieties = this.wine.varieties.filter(onlyUnique);

        this.addVarietyDropdown = false;
      },

      removeVariety(variety) {
        if(!this.wine.varieties)
          return;
        this.wine.varieties = this.wine.varieties.filter(v => v.id !== variety.id);
      },

      async remove() {
        if (!this.isNew()) {
          await this.$http.delete('wines/' + this.wine.id).catch(errorHandler(this))
        }
        this.$router.go(-1);
      }
    }
  };
</script>

<style scoped>
  .field.columns {
    margin-bottom: -12px;
  }
</style>
