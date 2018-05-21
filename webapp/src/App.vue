<template>
  <div id="app">
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import VueRouter from 'vue-router';
  import routes from './routes';

  export default {
    name: 'app',
    router: new VueRouter({ routes })
  };
</script>

<style lang="scss">
  @import "~bulma/sass/utilities/initial-variables";
  @import "~bulma/sass/utilities/functions";

  $widescreen: 1000px;
  $fullhd: 1000px;

  @import "~bulma/bulma";

  #app {
    font-family: 'Raleway', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100%;
  }

  .section.narrow {
    max-width: 700px;
    margin-right: auto;
    margin-left: auto;
  }
</style>
