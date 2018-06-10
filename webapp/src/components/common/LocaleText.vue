<template>
  <div v-if="object">
    <textarea class="textarea" v-model="object.sl" v-bind:placeholder="object.en" v-if="locale == 'sl'" v-bind:rows="rows"></textarea>
    <textarea class="textarea" v-model="object.en" v-bind:placeholder="object.sl" v-if="locale == 'en'" v-bind:rows="rows"></textarea>
  </div>
</template>

<script>
  export default {
    name: "LocaleText",
    props: ["object", "locale", "rows"]
  };
</script>