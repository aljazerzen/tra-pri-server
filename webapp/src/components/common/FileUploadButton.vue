<template>
    <div class="file">
      <label class="file-label">
        <input class="file-input" type="file" ref="newImage" v-on:change="uploadImage()">
        <span class="file-cta button" v-bind:class="isUploading ? 'is-loading' : ''">
          <span class="file-label">Dodaj</span>
        </span>
      </label>
    </div>
</template>

<script>
import { errorHandler } from "../../errorHandler";

export default {
  name: "FileUploadButton",
  props: ['route'],
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

          this.$emit('file-uploaded', upload);
        } catch (e) {
          errorHandler(this)(e);
        }
        this.isUploading = false;
      }
    }
  }
};
</script>

