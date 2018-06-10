<template>
  <div v-if="object">
    <input class="input" type="text" v-model="object.sl" v-bind:placeholder="object.en" v-if="locale == 'sl'"/>
    <input class="input" type="text" v-model="object.en" v-bind:placeholder="object.sl" v-if="locale == 'en'"/>
  </div>
</template>

<script>
export default {
  name: "LocaleString",
  props: ["object", "locale"]
};
</script>