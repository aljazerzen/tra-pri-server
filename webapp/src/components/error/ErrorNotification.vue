<template>
    
  <div class="notification is-danger" v-if="errors.length">
    <button v-on:click="errors = []" class="delete"></button>
    <div v-for="(error, index) in errors" v-bind:key="index"><b>{{error}}</b></div>
  </div>

</template>

<script>
export default {
  name: "ErrorNotification",
  data: () => ({
    errors: []
  }),
  created() {
    this.$root.$on("error", e => (this.errors = this.handleError(e)));
  },
  methods: {
    handleError(e) {
      switch (e.status) {
        case 0:
          return ["Strežnik nedosegljiv."];

        case 500:
          return ["Napaka na strežniku."];

        case 401:
          this.$router.push("/login");
          return ["Prosimo višite geslo."];

        case 400:
          switch (e.body.error) {
            case "DELETE_FOREIGN_KEY_VIOLATION":
              return ["Ne morem izbrisati, ker obstajajo odvisni objekti"];

            case "INCORRECT_PASSWORD":
              this.$router.push("/login");
              return ["Napačno geslo"];
            default:
              console.error(e.body);
              return Array.isArray(e.body.message)
                ? e.body.message
                : [e.body.message];
          }

        default:
          console.error(e);
      }
    }
  }
};
</script>

<style scoped>
.notification {
  margin-top: 1.5rem;
  margin-bottom: 0;
}
</style>

