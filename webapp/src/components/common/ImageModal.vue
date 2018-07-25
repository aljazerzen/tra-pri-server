<template>
  <div class="modal" :class="{ 'is-active': open }">
    <div class="modal-background" @click="open = false"></div>
    <div class="modal-content">
      <p class="image">
        <img :src="src">
      </p>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="open = false"></button>
  </div>
</template>

<script>
export default {
  name: "ImageModal",
  props: ["src", "isActive"],
  data: () => ({
    open: false
  }),
  watch: {
    src: function() {
      this.open = true;
    }
  }
};
</script>
