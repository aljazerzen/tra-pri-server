<template>
  <div class="section">
    <span class="button is-loading is-white" v-if="isLoading"></span>

    <div class="winemaker" v-for="winemaker in winemakers" :key="winemaker.id">
      <nav class="level">
        <div class="level-left">  
          <h1 class="title">
            <LocaleSpan :object=winemaker.name locale='sl'/>
            <span class="is-size-5">
              {{ winemaker.name.en ? `(${winemaker.name.en})` : '' }}
              {{ winemaker.code ? ` - ${winemaker.code}` : '' }}
            </span>
          </h1>
        </div>
        <div class="level-right noprint">
          <router-link class="button is-white" :to="{ name: 'winemaker-edit', params: { id: winemaker.id }}">
            <span class="icon is-small"><i class="fas fa-edit"></i></span>
          </router-link>
          <a href="javascript:window.print()" class="button is-white">
            <span class="icon is-small"><i class="fas fa-print"></i></span>
          </a>
        </div>
      </nav>
  
      <div style="margin-top: -2em"><i class="is-size-5" v-if=winemaker.place>{{ winemaker.place.name }}</i></div>
      
      <br>
      <b>Zgodba: </b><br>
      <div class="columns">
        <p class="column para"><locale-span :object=winemaker.background locale='sl' /></p>
        <p class="column para"><locale-span :object=winemaker.background locale='en' /></p>
      </div>
      
      <p class="para"><b>Spletna stran: </b><a :href=winemaker.website target=_blank>{{ winemaker.website }}</a></p>
      <br>

      <div class="columns is-mobile is-multiline">
        
        <div class="column is-half" v-for="image in winemaker.images" :key=image.id>
          <figure class="image" @click="modalImage=null; $nextTick(() => modalImage = image.url)">
            <img :src=image.url>
          </figure>
        </div>
        
        <div class="column is-half">
          <figure class="image video" v-if="winemaker.video">
            <video controls>
              <source :src=winemaker.video.url>
              Vaš brskalnik ne podpira predvajanja videoposnetkov.
            </video>
          </figure>  
        </div>

      </div>
      <br>
    
      <h2 class="is-size-4">Vina</h2>

      <div class="card" v-for="wine in winemaker.wines" :key=wine.id>
        <router-link :to="{ name: 'wine', params: { id: wine.id } }" class="has-text-black">
          <!-- <div class="card-image">
            <figure class="image is-4by3">
              <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
            </figure>
          </div> -->
          

          <div class="card-content">
            <div>
              <p style="display: inline-block; margin-bottom: 0.2em" class="title is-4">{{ wine.name }} </p>
              <span style="display: inline-block" class="subtitle is-5" v-if=wine.year>, {{ wine.year }}</span>
            
              <span style="margin-left: 0.5em; font-weight: 600; font-size: 13px" v-if="wine.sugar" class=tag>{{ wine.sugar.name.sl }}</span>
              <span style="margin-left: 0.5em; font-weight: 600; font-size: 13px" v-if="wine.type" class=tag>{{ wine.type.name.sl }}</span>
              <span style="margin-left: 0.5em; font-weight: 600; font-size: 15px" v-for="variety in wine.varieties" :key="variety.id" class=tag>
                {{ variety.name.sl }}
              </span>
            </div>
            <p v-if="wine.temperature.from && wine.temperature.to">
              <b>Priporočena temperatura:</b> od {{ wine.temperature.from}}℃ do {{ wine.temperature.to}}℃
            </p>
            <div v-if="wine.features.sl || wine.features.en">
              <b>Značilnosti:</b>
              <div class="columns">
                <locale-span class="column" :object=wine.features locale=sl v-if=wine.features.sl />
                <locale-span class="column" :object=wine.features locale=en v-if=wine.features.en />
              </div>
            </div>
            <div v-if="wine.awards.sl || wine.awards.en">
              <b>Nagrade:</b>
              <div class="columns">
                <locale-span class="column" :object=wine.awards locale=sl v-if=wine.awards.sl />
                <locale-span class="column" :object=wine.awards locale=en v-if=wine.awards.en />
              </div>
            </div>
            <div v-if="wine.culinary.sl || wine.culinary.en">
              <b>Kulinarika:</b>
              <div class="columns">
                <locale-span class="column" :object=wine.culinary locale=sl v-if=wine.culinary.sl />
                <locale-span class="column" :object=wine.culinary locale=en v-if=wine.culinary.en />
              </div>
            </div>
            <div class="columns">
              <p class="column"><b>Cena:</b> {{ wine.price }}€</p>
              <p class="column"><b>Prostornina:</b> {{ wine.volume }}L</p>
              <p class="column"><b>Alkohol:</b> {{ wine.abv }}%</p>
            </div>
            <div class="columns is-mobile is-multiline">        
              <div class="column is-half" v-for="image in wine.images" :key=image.id>
                <figure class="image" @click="modalImage=null; $nextTick(() => modalImage = image.url)">
                  <img :src=image.url>
                </figure>
              </div>
            </div>

          </div>
        </router-link>
      </div>

    </div>
    <ImageModal :src=modalImage />
  </div>
</template>

<script>
import ImageBar from "../../common/ImageBar";
import VideoBar from "../../common/VideoBar";
import LocaleSpan from "../../common/LocaleSpan";
import LocalePicker from "../../common/LocalePicker";
import LocaleString from "../../common/LocaleString";
import LocaleText from "../../common/LocaleText";
import ImageModal from "../../common/ImageModal";
import WineList from "../wine/WineList";

export default {
  components: {
    ImageBar,
    VideoBar,
    LocaleSpan,
    LocalePicker,
    LocaleString,
    LocaleText,
    WineList,
    ImageModal
  },
  data() {
    return {
      isLoading: true,
      isLoadingWines: true,
      winemakers: [],
      modalImage: null
    };
  },
  created() {
    this.load();
  },
  watch: {
    $route: "load"
  },
  methods: {
    async load() {
      const id = this.$route.params.id;

      this.isLoading = true;
      this.winemakers = await this.$http
        .get(`winemakers/full`)
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e));
      // this.winemaker.wines.forEach(w => w.winemaker = this.winemaker);
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.field.columns {
  margin-bottom: 0;
}
figure.image {
  border-radius: 8px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 0 6px #999;
}
figure.image img {
  width: initial;
  max-height: 200px;
  margin: 0 auto;
}
figure.image.video {
  background-color: black;
}
.winemaker {
  margin-bottom: 4em;
}
.card {
  margin-bottom: 0.5em;
  margin-top: 0.75em;
}
.card .card-content {
    padding: 1rem;
  }
@media print {
  h2 {
    margin-top: -1em;
  }
  .para {
    margin-bottom: -0.5em;
  }
  .card {
    page-break-inside: avoid;
  }
  .card .card-content {
    padding: 0.5rem;
  }  
}
</style>

<style>
@media print {
  .winemaker-wines .card {
    width: fit-content;
    box-shadow: none;
    display: inline-block;
  }
  .winemaker-wines .card-header {
    box-shadow: none;
  }
  .winemaker-wines .wine-code {
    display: none;
  }
  .winemaker {
    page-break-after: always;
  }
}
</style>
