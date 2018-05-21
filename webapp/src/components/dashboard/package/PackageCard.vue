<template>

  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img src="../../../assets/box.svg"/>
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">Paket v{{ pack.id }}

          </p>
          <p class="subtitle is-6">{{ pack.sizeHuman }}</p>
        </div>
        <div class="media-right buttons has-addons">
          <a class="button" v-on:click="activate()" v-if="!pack.active">Aktiviraj</a>
          <a class="button is-primary is-active" v-if="pack.active">Aktiven</a>
          <a class="button" v-bind:href="pack.url" target="_blank">Prenesi</a>
        </div>
      </div>

      <div class="content">
        Vsebuje {{ pack.wineCount }} vin.
        <br>
        <time><i>Ustvarjeno: {{ date }}</i></time>
      </div>
    </div>
  </div>

</template>

<script>
import moment from "moment";

moment.locale("sl");

export default {
  name: "PackageCard",
  props: ["pack"],
  data: () => ({
    isActivating: false
  }),
  methods: {
    async activate() {
      const pack = this.$props.pack;

      this.isActivating = true;
      try {
        await this.$http.put("packages/" + pack.id);
        pack.active = true;
        this.$emit("activated", { packageId: pack.id });
      } catch (e) {
        this.$root.$emit('error', e);
      }
      this.isActivating = false;
    }
  },
  computed: {
    date: function() {
      return moment(this.pack.date).calendar();
    }
  }
};
</script>

<style scoped>
.card {
  margin-bottom: 1em;
}
</style>
