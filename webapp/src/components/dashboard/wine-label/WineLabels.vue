<template>
  <div class="section">

    <nav class="level">
      <div class="level-left">
        <h1 class="title">
          <span v-if="wine">
            <i><LocaleString v-bind:object="wine.winemaker.name" locale="si"/>: </i>
            <b>{{ wine.name }}</b>{{ wine.year ? ', ' + wine.year : '' }}
          </span>
          <span class="button is-loading is-white" v-if="isLoading"></span>
        </h1>
      </div>
      <div class="level-right">
        <div class="button is-primary" v-on:click="save()" v-bind:class="isSaving ? 'is-loading' : ''">Shrani</div>
      </div>
    </nav>
    <div v-if="wine">
      <ImageSpot placeholder="Slika 1"
                 has-coordinates="true"
                 v-bind:points="points"
                 v-bind:image="wine.labels[0]"
                 v-on:image-set="i => setImage(0, i)"
                 v-on:points-set="setPoints"/>
      <ImageSpot v-for="index in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
                 v-bind:placeholder="'Slika ' + (index + 1)"
                 v-bind:key="index"
                 v-bind:image="wine.labels[index]"
                 v-on:image-set="i => setImage(index, i)"/>
    </div>
  </div>

</template>

<script>
  import LocaleString from '../../common/LocaleSpan';
  import ImageBar from '../../common/ImageBar';
  import ImageSpot from '../../common/ImageSpot';

  export default {
    name: 'WineLabels',
    components: { ImageSpot, ImageBar, LocaleString },
    data: () => ({
      wine: null,
      isSaving: false,
      isLoading: true,
      points: [],
    }),
    async mounted() {
      this.isLoading = true;
      this.load(await this.$http
        .get('labels/' + this.$route.params.id)
        .then(data => data.json())
        .catch(e => this.$root.$emit('error', e))
      );
      this.isLoading = false;
    },
    methods: {
      async load(data) {
        this.wine = data;

        if (!this.wine.labels)
          this.wine.labels = [];

        this.wine.labels.length = 10;
        this.points = [];
        if (this.wine.coordinates)
          for (let i = 0; i < this.wine.coordinates.length / 2; i++)
            this.points.push({ x: this.wine.coordinates[2 * i], y: this.wine.coordinates[2 * i + 1] });
      },
      async save() {
        this.isSaving = true;
        try {
          this.load(await this.$http
            .put('labels/' + this.$route.params.id, this.wine)
            .then(data => data.json())
          );
        } catch (e) {
          this.$root.$emit('error', e);
        }
        this.isSaving = false;
        this.$router.go(-1);
      },
      setImage(index, image) {
        this.wine.labels[index] = image;
        this.$forceUpdate();
      },
      setPoints(points) {
        this.points = points;
        this.wine.coordinates = points.reduce((acc, p) => [...acc, p.x, p.y], []).map(Math.floor);
      }
    }
  };
</script>

<style scoped>

</style>
