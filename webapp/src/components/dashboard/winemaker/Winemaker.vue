<template>
  <div class="section">
    <nav class="level">
      <div class="level-left">  
        <h1 class="title">
          <span v-if=winemaker>
            <LocaleSpan :object=winemaker.name :locale='locale.lang' :defaultToSl="true"/>
            {{ winemaker.code ? `(${winemaker.code})` : '' }}
            <span class="button is-loading is-white" v-if="isLoading"></span>
          </span>
        </h1>
      </div>
      <div class="level-right noprint">
        <router-link class="button is-white" :to="{ name: 'winemaker-edit', params: { id: winemaker.id }}">
          <span class="icon is-small"><i class="fas fa-edit"></i></span>
        </router-link>
        <a href="javascript:window.print()" class="button is-white" style="margin-right: 0.5em">
          <span class="icon is-small"><i class="fas fa-print"></i></span>
        </a>
        <LocalePicker :locale="locale" />
      </div>
    </nav>
  
    <div v-if=winemaker>
      <div style="margin-top: -2em"><i class="is-size-5" v-if=winemaker.place>{{ winemaker.place.name }}</i></div>
      
      <br>
      
      <b>Zgodba: </b><locale-span :object=winemaker.background :locale=locale.lang />
      <br><br>

      <b>Spletna stran: </b><a :href=winemaker.website target=_blank>{{ winemaker.website }}</a>
      <br><br>

      <div class="columns is-mobile is-multiline">
        
        <div class="column is-half" v-for="image in winemaker.images" :key=image.id>
          <figure class="image ">
            <img :src=image.url>
          </figure>
        </div>
        
        <div class="column is-half">
          <figure class="image" v-if="winemaker.video">
            <video controls>
              <source :src=winemaker.video.url>
              Vaš brskalnik ne podpira predvajanja videoposnetkov.
            </video>
          </figure>  
        </div>

      </div>
      <br>
    </div>


    <h2 class="is-size-4">Vina</h2>
    
    <WineList :wines=winemaker.wines @wine-click="$router.push({ name: 'wine', params: { id: $event.id } })" />

  </div>
</template>

<script>
import ImageBar from "../../common/ImageBar";
import VideoBar from "../../common/VideoBar";
import LocaleSpan from "../../common/LocaleSpan";
import LocalePicker from "../../common/LocalePicker";
import LocaleString from "../../common/LocaleString";
import LocaleText from "../../common/LocaleText";
import WineList from "../wine/WineList";

export default {
  name: "Wine",
  components: {
    ImageBar,
    VideoBar,
    LocaleSpan,
    LocalePicker,
    LocaleString,
    LocaleText,
    WineList
  },
  data() {
    return {
      isLoading: true,
      isLoadingWines: true,
      winemaker: {},
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
    async load() {
      const id = this.$route.params.id;

      this.isLoading = true;
      this.winemaker = await this.$http
        .get(`winemakers/${id}/full`)
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
  background-color: black;
}
</style>
