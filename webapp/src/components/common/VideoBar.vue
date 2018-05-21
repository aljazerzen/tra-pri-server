<template>
    
    <div class="field">
      <label class="label">Video</label>

      <div class="field">
        <div class="control" v-if="object.video">
          <figure class="image">
            <video controls>
              <source v-bind:src="object.video.url">
              Your browser does not support the video tag.
            </video>
          </figure>
          <a class="has-background-danger is-medium delete" v-on:click="remove()"></a>
        </div>

        <FileUploadButton class="control" v-bind:route="'video'" v-on:file-uploaded="addVideo" v-if="!object.video"/>
      </div>
    </div>

</template>

<script>
import FileUploadButton from "./FileUploadButton";

export default {
  components: { FileUploadButton },
  props: ["object"],
  methods: {
    addVideo(upload) {
      this.object.video = upload;
      this.$forceUpdate();
    },

    remove() {
      this.object.video = null;
    }
  }
};
</script>

<style scoped>

  .control {
    position: relative;
  }

  .delete {
    position: absolute;
    right: 5px;
    top: 5px;
  }

</style>


