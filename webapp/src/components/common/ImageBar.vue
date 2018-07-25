<template>
    
  <div class="field">
    <label class="label">Slike</label>

    <div class="field image-inline">
      <div class="control" v-for="image in object.images" v-bind:key="image.id">
        <figure class="image is-128x128" @click="modalImage = null; $nextTick(() => modalImage = image.url)">
          <img v-bind:src="image.url">
        </figure>
        <a class="is-danger is-medium delete" v-on:click="removeImage(image)"></a>
      </div>

      <FileUploadButton class="control" route="image" v-on:file-uploaded="addImage" caption="Dodaj"/>
    </div>

    <image-modal :src=modalImage />
  </div>

</template>

<script>
import FileUploadButton from "./FileUploadButton";
import ImageModal from "./ImageModal";

export default {
  name: "ImageBar",
  components: { FileUploadButton, ImageModal },
  props: ["object"],
  data: () => ({
    modalImage: null,
  }),
  mounted() {
    if (!this.object.images) this.object.images = [];
  },
  methods: {
    addImage(image) {
      this.object.images.push(image);
    },

    removeImage(image) {
      this.object.images = this.object.images.filter(i => i.id !== image.id);
    }
  }
};
</script>

<style scoped>

  .image-inline>.control {
    position: relative;
    display: inline-block;
    margin-right: 1em;
    vertical-align: text-top;
  }

  .image-inline .delete {
    position: absolute;
    right: 5px;
    top: 5px;
  }

  .image-inline .image {
    overflow: hidden;
  }

</style>
