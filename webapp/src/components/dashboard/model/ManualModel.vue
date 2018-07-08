<template>
  
  <section class="section">

    <nav class="level">
      <div class="level-left">  
        <h1 class="title">
          Ročno učenje modela
        </h1>
      </div>
    </nav>

    <div>
      <a class="button is-dark is-outlined" :href="$url.options.root + 'tf-models/manual'">Prenos ZIP arhiva s slikami etiket in konfiguracijo za učenje</a>
    </div>
    <br/>
  
    <h2 class="is-size-4">Vnos rezultatov</h2>

    <div class="field is-grouped" v-if="!result">
      <div class="file is-dark">
        <label class="file-label">
          <input class="file-input" type="file" ref="model">
          <span class="file-cta button">
            <span class="file-label">model.pb</span>
          </span>
        </label>
      </div>

      <div class="file is-dark">
        <label class="file-label">
          <input class="file-input" type="file" ref="label_map">
          <span class="file-cta button">
            <span class="file-label">label_map.txt</span>
          </span>
        </label>
      </div>

      <div class="button is-dark" v-bind:class="isUploading ? 'is-loading' : ''" @click="upload">
        <span class="icon is-small"><i class="fas fa-upload"></i></span>
      </div>
    </div>

    <div v-if="result">
      Model uspešno vnešen. Vključen bo v naslednjem vsebinskem paketu.<br/>
      Najdenih in označenih vin/od vseh oznak v label_map.txt:
      <b class="is-size-5"> {{ result.winesMarked }}/{{ result.labelMapLength }}</b>
    </div>

  </section>
</template>
<script>
export default {
  name: "ManualModel",
  data: () => ({
    isUploading: false,
    result: null,
  }),
  methods: {
    async upload() {
      const hasModel = this.$refs.model.files.length > 0;
      const hasLabelMap = this.$refs.label_map.files.length > 0;

      if (!hasModel || !hasLabelMap) {
        if (!hasModel) {
          this.$root.$emit("error", "manjka model.pb datatoteka");
        } else {
          this.$root.$emit("error", "manjka label_map.txt datatoteka");
        }
      } else {
        this.$root.$emit("error", null);

        const formData = new FormData();
        formData.append("model", this.$refs.model.files[0]);
        formData.append("label_map", this.$refs.label_map.files[0]);

        try {
          this.isUploading = true;
          this.result = await this.$http
            .post("tf-models/manual", formData)
            .then(data => data.json());
          
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
.file {
  margin-right: 1em;
}
.file:last-child {
  margin-right: 0;
}
</style>
