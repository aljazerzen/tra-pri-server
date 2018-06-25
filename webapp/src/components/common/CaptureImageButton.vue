<template>
  <div class="button" v-on:click.self="open()">
    Zajemi
    <div class="modal" v-bind:class="isOpen ? 'is-active' : ''">
      <div class="modal-background"></div>
      <div class="modal-content">
        <p>
          <video v-if="isCapturing" ref="video" v-bind:width="width" v-bind:height="height" autoplay></video>
          <canvas ref="canvas" v-bind:width="width" v-bind:height="height"
                  v-bind:style="isCapturing ? 'display: none' : ''"></canvas>
        </p>

        <div class="button is-large is-rounded is-success" v-if="isCapturing" v-on:click="capture()">Slikaj</div>
        <div v-else>
          <div class="button is-large is-rounded is-danger" v-on:click="open()">⟲</div>
          <div class="button is-large is-rounded is-success" v-on:click="upload()">✓</div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" v-on:click="stopCapturing(); (isOpen = false)"></button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CaptureImageButton',
    props: ['route'],
    data: () => ({
      isOpen: false,
      isCapturing: true,
      isUploading: false,
      stream: null,
      width: 1920,
      height: 1080,
    }),
    methods: {
      open() {
        this.isOpen = true;
        this.isCapturing = true;
        this.$nextTick(() => {
          // Get access to the camera!
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Not adding `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia({
              video: {
                width: this.width,
                height: this.height
              }
            }).then((stream) => {
              this.$refs.video.srcObject = stream;
              this.$refs.video.play();
              this.stream = stream;
            });
          }
        });
      },
      capture() {
        this.$refs.canvas.getContext('2d').drawImage(this.$refs.video, 0, 0, this.width, this.height);
        this.stopCapturing();
      },
      stopCapturing() {
        this.isCapturing = false;
        this.stream.getTracks().forEach(track => track.stop());
      },
      upload() {
        const formData = new FormData();

        this.$refs.canvas.toBlob(async data => {
          formData.append('file', data, 'captured_image.jpg');

          try {
            this.isUploading = true;
            const upload = await this.$http
              .post(this.route, formData)
              .then(data => data.json());
            this.isUploading = false;

            this.$emit('file-uploaded', upload);
          } catch (e) {
            this.$root.$emit('error', e);
          }
          this.isUploading = false;
          this.isOpen = false;
        }, 'image/jpeg');
      }
    },
  };
</script>

<style scoped>
  .modal .button {
    font-size: 1.2em;
    margin-top: 10px;
    margin-left: 1em;
  }

  canvas {
    max-width: 100%;
  }
</style>
