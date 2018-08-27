<template>
  <div class="file">
    <label class="file-label">
      <input class="file-input" type="file" ref="newImage" v-on:change="uploadImage()">
      <span class="file-cta button" v-bind:class="isUploading ? 'is-loading' : ''">
          <span class="file-label">{{ caption }}</span>
        </span>
    </label>
  </div>
</template>

<script>
export default {
  name: "FileUploadButton",
  props: ["route", "caption"],
  data: () => ({
    isUploading: false
  }),
  methods: {
    async uploadImage() {
      if (this.$refs.newImage.files.length) {
        const formData = new FormData();
        formData.append("file", this.$refs.newImage.files[0]);

        try {
          this.isUploading = true;
          const upload = await this.$http
            .post(this.route, formData)
            .then(data => data.json());
          this.isUploading = false;

          this.$emit("file-uploaded", upload);
        } catch (e) {
          this.$root.$emit("error", e);
        }
        this.isUploading = false;
      }
    }
  }
};
</script>
<style scoped>
.file-cta {
  background-color: white !important;
}
input {
  opacity: 0;
}
</style>
