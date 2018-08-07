<template>
  <div class="section narrow">
    <nav class="level">
      <div class="level-left">
        <h1 class="title">
          Neuporabljene datoteke ({{ files.length }})
          <span class="button is-loading is-white" v-if="isLoading"></span>
        </h1>
      </div>
      <div class="level-right">
        <div class="button is-danger" @click=removeUnused() >Odstrani</div>
      </div>
    </nav>

    <table class="table">
      <thead>
        <tr>
          <th>id</th>
          <th>url</th>
          <th>ustvarjeno</th>
          <th>tip</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files" :key=file.id>
          <td>{{ file.id }}</td>
          <td>{{ file.url }}</td>
          <td>{{ file.createdAt }}</td>
          <td>{{ file.type }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  data: () => ({
    isLoading: false,
    files: [],
  }),
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.isLoading = true;
      this.files = await this.$http.get("files/unused").then(data => data.json());
      this.isLoading = false;
    },
    async removeUnused() {
      this.isLoading = true;
      await this.$http.delete("files/unused").then(data => data.json());
      await this.load();
    }
  }
}
</script>
