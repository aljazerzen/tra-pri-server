<template>

  <div class="spot" 
    @dragover.prevent="$event.dataTransfer.dropEffect = 'copy';" 
    @dragenter="draging = true" 
    @dragleave="draging = false" 
    @drop.prevent.stop="onDrop">

    <div v-if="image" class="image" v-bind:style="'background-image: url(\'' + image.url + '\')'">
      <img v-bind:src="image.url" v-on:load="imageLoaded" ref="img"/>
      <PointPicker v-if="hasCoordinates"
                        v-bind:width="width"
                        v-bind:height="height"
                        v-bind:points="points"
                        v-on:points-set="$emit('points-set', $event)"/>
      <div class="delete is-large" v-on:click="setImage(null)"></div>
    </div>
    <div v-else class="empty" :class="draging ? 'drag-over' : ''">
      <div class="placeholder">
        <p class="title">{{ placeholder }}</p>
      </div>
      <div class="add-buttons">
        <div>
          <CaptureImageButton route="label" v-on:file-uploaded="setImage"/>
        </div>
        <div>
          <FileUploadButton route="label" caption="Naloži" v-on:file-uploaded="setImage"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import FileUploadButton from "./FileUploadButton";
import CaptureImageButton from "./CaptureImageButton";
import PointPicker from "./PointPicker";

export default {
  name: "ImageSpot",
  components: { PointPicker, CaptureImageButton, FileUploadButton },
  props: ["placeholder", "hasCoordinates", "image", "points"],
  data: () => ({
    width: 1000,
    height: 1000,
    draging: false
  }),
  mounted() {
    this.setImage(this.image);
  },
  methods: {
    setImage(image) {
      this.$emit("image-set", image);
    },
    imageLoaded(event) {
      this.width = event.target.naturalWidth;
      this.height = event.target.naturalHeight;
    },
    async onDrop(event) {
      this.draging = false;
      if (event.dataTransfer.files)
        for(let file of Array.from(event.dataTransfer.files))
          await this.uploadImage(file);
    },

    async uploadImage(file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const upload = await this.$http
          .post('label', formData)
          .then(data => data.json());

        if(!this.image)
          this.setImage(upload);
        else
          this.$emit('multiple-image-drag', upload);
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
}

.image {
  position: relative;
  border-radius: inherit;
  background: no-repeat center center;
  background-size: cover;
  box-shadow: #aaa 0 0 30px 0;
}

.image img {
  min-width: 100%;
  min-height: 100%;
  opacity: 0;
}

.image .delete {
  position: absolute;
  top: 10px;
  right: 10px;
}

.empty {
  min-height: inherit;
  border-radius: inherit;
  border: 2px #999 dashed;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.empty.drag-over {
  border-style: solid;
}

.placeholder {
  text-align: center;
  flex-grow: 1;
  pointer-events: none;
}

.placeholder .title {
  color: #bbb;
}

.add-buttons {
  flex-shrink: 1;
}

.add-buttons > * {
  margin-right: 0.75em;
  display: inline-block;
  vertical-align: middle;
}
</style>
