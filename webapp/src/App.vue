<template>
  <div id="app">
    <div class="container">
      <ErrorNotification ref="errorNotification"/>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import VueRouter from "vue-router";
import routes from "./routes";
import ErrorNotification from "./components/error/ErrorNotification";

export default {
  name: "app",
  components: { ErrorNotification },  
  router: new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    }
  })
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/initial-variables";
@import "~bulma/sass/utilities/functions";

$widescreen: 1000px;
$fullhd: 1000px;

@import "~bulma/bulma";

#app {
  font-family: "Raleway", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100%;
}

.section.columns {
  max-width: 100%;
}
@media print {
  .noprint {
    display: none;
  }
}
</style>
