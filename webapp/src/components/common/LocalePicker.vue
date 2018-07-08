<template>
  <div class="tags has-addons">
    <span class="tag is-medium is-dark">
      <span class="icon is-small"><i class="fas fa-globe"></i></span>
    </span>
    <span class="tag is-medium" v-bind:class="locale.lang == 'sl' ? 'is-danger': 'is-black'" v-on:click="locale.lang = 'sl'">SL</span>
    <span class="tag is-medium" v-bind:class="locale.lang == 'en' ? 'is-danger': 'is-black'" v-on:click="locale.lang = 'en'">EN</span>
  </div>
</template>

<script>
  export default {
    name: "LocalePicker",
    props: ["locale"],
  };
</script>