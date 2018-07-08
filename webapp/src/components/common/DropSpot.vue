<template>

  <div class="spot empty" 
    @dragover="dragOver" 
    @dragenter="draging = !uploading" 
    @dragleave="draging = false" 
    @drop.prevent.stop="onDrop"
    :class="draging ? 'drag-over' : ''">

    <h2 class="title">Odloži slike tukaj</h2>
  </div>

</template>

<script>
export default {
  name: "DropSpot",
  data: () => ({
    draging: false,
    uploading: false
  }),
  methods: {
    async dragOver($event) {
      if (!this.uploading) {
        $event.dataTransfer.dropEffect = "copy";
        $event.preventDefault();
      }
    },
    async onDrop(event) {
      this.draging = false;

      if (this.uploading) return;
      this.uploading = true;

      if (event.dataTransfer.files)
        for (let file of Array.from(event.dataTransfer.files))
          await this.uploadImage(file);

      this.uploading = false;
    },

    async uploadImage(file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const upload = await this.$http
          .post("label", formData)
          .then(data => data.json());

        this.$emit("file-uploaded", upload);
      } catch (e) {
        this.$root.$emit("error", e);
      }
    }
  }
};
</script>

<style scoped>
.spot {
  border-radius: 10px;
  background-color: #eee;
  min-height: 100px;
  margin-bottom: 1em;

  border: 2px #999 dashed;
  text-align: center;
}

.spot.drag-over {
  border-style: solid;
}

.title {
  line-height: 100px;
  text-align: center;
  pointer-events: none;
  color: #bbb;
}
</style>
