<template>

  <div class="spot">
    <div v-if="image" class="image" v-bind:style="'background-image: url(\'' + image.url + '\')'">
      <img v-bind:src="image.url" v-on:load="imageLoaded" ref="img"/>
      <PointPicker v-if="hasCoordinates"
                        v-bind:width="width"
                        v-bind:height="height"
                        v-bind:points="points"
                        v-on:points-set="$emit('points-set', $event)"/>
      <div class="delete is-large" v-on:click="setImage(null)"></div>
    </div>
    <div v-else class="empty">
      <div class="placeholder">
        <p class="title">{{ placeholder }}</p>
      </div>
      <div class="add-buttons">
        <div>
          <CaptureImageButton route="image" v-on:file-uploaded="setImage"/>
        </div>
        <div>
          <FileUploadButton route="image" caption="Naloži" v-on:file-uploaded="setImage"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import FileUploadButton from './FileUploadButton';
  import CaptureImageButton from './CaptureImageButton';
  import PointPicker from './PointPicker';

  export default {
    name: 'ImageSpot',
    components: { PointPicker, CaptureImageButton, FileUploadButton },
    props: ['placeholder', 'hasCoordinates', 'image', 'points'],
    data: () => ({
      width: 100,
      height: 100
    }),
    mounted() {
      this.setImage(this.image);
    },
    methods: {
      setImage(image) {
        this.$emit('image-set', image);
      },
      imageLoaded(event) {
        this.width = event.target.naturalWidth;
        this.height = event.target.naturalHeight;
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

  .placeholder {
    text-align: center;
    flex-grow: 1;
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
