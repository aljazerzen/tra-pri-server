<template>
  <div class="section">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">
          <span v-if="wine">
            <i><LocaleString :object="wine.winemaker.name" locale="sl"/>: </i>
            <b>{{ wine.name }}</b>{{ wine.year ? ', ' + wine.year : '' }}
          </span>
          <span class="button is-loading is-white" v-if="isLoading"></span>
        </h1>
      </div>
      <div class="level-right">
        <div class="button is-primary" @click="save()" :class="isSaving ? 'is-loading' : ''">Shrani</div>
      </div>
    </nav>
    <div v-if="wine">
      <DropSpot @file-uploaded="addToFirstEmpty"/>
      <ImageSpot placeholder="Slika 1"
                 has-coordinates="true"
                 :points="points"
                 :image="wine.labels[0]"
                 @image-set="i => setImage(0, i)"
                 @points-set="setPoints"/>
      <ImageSpot v-for="(label, index) in wine.labels.slice(1)"
                 :placeholder="'Slika ' + (index + 2)"
                 :key="index"
                 :image="label"
                 @image-set="i => setImage(index + 1, i)"/>
      <ImageSpot :placeholder="'Slika ' + (wine.labels.length + 1)"
                 :image="null"
                 @image-set="i => setImage(wine.labels.length, i)"/>
    </div>
  </div>

</template>

<script>
import LocaleString from "../../common/LocaleSpan";
import ImageBar from "../../common/ImageBar";
import ImageSpot from "../../common/ImageSpot";
import DropSpot from "../../common/DropSpot";

export default {
  name: "WineLabels",
  components: { ImageSpot, ImageBar, LocaleString, DropSpot },
  data: () => ({
    wine: null,
    isSaving: false,
    isLoading: true,
    points: []
  }),
  async mounted() {
    this.isLoading = true;
    this.load(
      await this.$http
        .get("labels/" + this.$route.params.id)
        .then(data => data.json())
        .catch(e => this.$root.$emit("error", e))
    );
    this.isLoading = false;
  },
  methods: {
    load(data) {
      this.wine = data;

      if (!this.wine.labels) this.wine.labels = [];

      this.points = [];
      if (this.wine.coordinates)
        for (let i = 0; i < this.wine.coordinates.length / 2; i++)
          this.points.push({
            x: this.wine.coordinates[2 * i],
            y: this.wine.coordinates[2 * i + 1]
          });
    },
    async save() {
      this.isSaving = true;
      try {
        this.load(
          await this.$http
            .put("labels/" + this.$route.params.id, this.wine)
            .then(data => data.json())
        );
        this.$router.go(-1);
      } catch (e) {
        this.$root.$emit("error", e);
      }
      this.isSaving = false;
    },
    setImage(index, image) {
      this.wine.labels[index] = image;
      while (this.wine.labels.length > 1 && !this.wine.labels[this.wine.labels.length - 1])
        this.wine.labels.pop();
      this.$forceUpdate();
    },
    setPoints(points) {
      this.points = points;
      this.wine.coordinates = points
        .reduce((acc, p) => [...acc, p.x, p.y], [])
        .map(Math.floor);
    },
    addToFirstEmpty(image) {
      let i = 0;
      while (this.wine.labels[i]) i++;

      this.wine.labels[i] = image;
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
</style>
