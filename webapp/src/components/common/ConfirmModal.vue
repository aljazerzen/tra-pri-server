<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="isActive=false"></div>
    <div class="modal-content">
      <header class="modal-card-head">
        <p class="modal-card-title">Si prepričan?</p>
      </header>
      <footer class="modal-card-foot">
        <div style="flex-grow: 1"></div>
        <button class="button is-danger" @click="$emit('confirm')">{{ actionConfirm }}</button>
        <button class="button" @click="isActive=false">Prekliči</button>
      </footer>        
    </div>
  </div>
</template>
<script>
export default {
  name: "ConfirmModal",
  props: ["actionConfirm"],
  data: () => ({
    isActive: false
  }),
  methods: {
    show() {
      this.isActive = true;
    }
  }
};
</script>
