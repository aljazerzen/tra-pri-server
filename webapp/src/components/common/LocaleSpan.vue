<template>
  <span v-if="object">
    {{ locale == 'sl' ? object.sl || object.en : object.en || object.sl }}
  </span>
</template>

<script>
  export default {
    name: "LocaleString",
    props: ["object", "locale"],
  };
</script>