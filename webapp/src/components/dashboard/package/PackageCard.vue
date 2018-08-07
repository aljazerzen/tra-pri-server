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
        <div class="media-right">
          <div class="buttons has-addons">
            <a class="button" v-if=!pack.active @click=remove>
              <span class="icon"><i class="fas fa-trash-alt"></i></span>
            </a>
            <a class="button" v-bind:href="pack.url" target="_blank">
              <span class="icon"><i class="fas fa-download"></i></span>
            </a>
            <a class="button" v-on:click="activate()" v-if="!pack.active">Aktiviraj</a>
            <a class="button is-info is-active" v-if="pack.active">
              <span>Aktiven</span><span class="icon"><i class="fas fa-check-circle"></i></span>
            </a>
          </div>
        </div>
      </div>

      <div class="content">
        Vsebuje <b>{{ pack.wineCount }} vin</b>.
        <span v-if="pack.model">Model je bil ustvarjen <b>{{ modelCreatedAt }}</b></span>
        <span v-else>Nima modela.</span>
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
    },
    async remove() {
      const pack = this.$props.pack;
      try {
        await this.$http.delete("packages/" + pack.id);
        this.$emit("removed", { packageId: pack.id });
      } catch (e) {
        this.$root.$emit('error', e);
      }
    }
  },
  computed: {
    date: function() {
      return moment(this.pack.date).calendar();
    },
    modelCreatedAt: function() {
      return moment(this.pack.model.createdAt).calendar();
    },
  }
};
</script>

<style scoped>
.card {
  margin-bottom: 1em;
}
</style>
