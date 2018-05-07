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

    <div ref="map" id="map"></div>

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
  const vipava = { lat: 45.8395977, lng: 13.9481168 };

  export default {
    name: 'Place',
    data() {
      return {
        place: {},
        map: null,
        marker: null,
      };
    },
    created() {
      this.load();
    },
    mounted() {
      this.initMaps();
    },
    watch: {
      '$route': 'load'
    },
    methods: {
      isNew() {
        return !this.place || !Number.isInteger(+this.place.id);
      },

      async load() {
        this.place.id = this.$route.params.id;

        if (this.isNew())
          this.place = { name: '', coordinates: vipava };
        else {
          this.place = await this.$http.get('places/' + this.place.id).then(data => data.json());
          if(this.place.coordinates) {
            this.marker.setPosition(this.place.coordinates);
            this.map.setCenter(this.place.coordinates);
          }
        }
      },

      async save() {
        if (this.isNew()) {
          this.place = await this.$http.post('places', this.place).then(data => data.json());
        } else {
          this.place = await this.$http.put('places/' + this.place.id, this.place).then(data => data.json());
        }
        this.back();
      },

      async remove() {
        if (!this.isNew()) {
          await this.$http.delete('places/' + this.place.id);
        }
        this.back();
      },

      initMaps() {
        // eslint-disable-next-line
        this.map = new google.maps.Map(this.$refs.map, {
          center: vipava,
          zoom: 13
        });
        // eslint-disable-next-line
        this.marker = new google.maps.Marker({ position: vipava, map: this.map });

        this.map.addListener('click', (event) => {
          this.marker.setPosition(event.latLng);
          this.place.coordinates = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        });
      },

      back() {
        if (window.history.length === 1)
          window.close();
        else
          this.$router.go(-1);
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
