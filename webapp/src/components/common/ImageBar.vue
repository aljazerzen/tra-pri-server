<template>
    
    <div class="field">
      <label class="label">Slike</label>

      <div class="field image-inline">
        <div class="control" v-for="image in object.images" v-bind:key="image.id">
          <figure class="image is-128x128">
            <img v-bind:src="image.url">
          </figure>
          <a class="is-danger is-medium delete" v-on:click="removeImage(image)"></a>
        </div>

        <FileUploadButton class="control" v-bind:route="'image'" v-on:file-uploaded="addImage"/>
      </div>
    </div>

</template>

<script>
import FileUploadButton from "./FileUploadButton";

export default {
  name: "ImageBar",
  components: { FileUploadButton },
  props: ["object"],
  methods: {
    addImage(image) {
      if (!this.object.images) this.object.images = [];
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
