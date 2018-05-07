<template>
  <section class="columns">
    <Sidebar/>
    <div class="column">
      <router-view/>
    </div>
  </section>
</template>

<script>
  import Sidebar from './Sidebar';

  export default {
    name: 'Dashboard',
    components: {
      Sidebar,
    }
  };
</script>

<style>
</style>
