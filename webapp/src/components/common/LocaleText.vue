<template>
  <div v-if="object">
    <textarea class="textarea" v-model="object.sl" v-if="locale == 'sl'" :rows="rows"></textarea>
    <textarea class="textarea" v-model="object.en" :placeholder="defaultToSl ? object.sl : ''" v-if="locale == 'en'" :rows="rows"></textarea>
  </div>
</template>

<script>
export default {
  name: "LocaleText",
  props: ["object", "locale", "rows", "defaultToSl"]
};
</script>