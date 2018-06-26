<template>
  <span v-if="object">{{ locale == 'sl' 
      ? object.sl
      : object.en || (defaultToSl ? object.sl : '')
    }}</span>
</template>

<script>
export default {
  name: "LocaleString",
  props: ["object", "locale", "defaultToSl"]
};
</script>
