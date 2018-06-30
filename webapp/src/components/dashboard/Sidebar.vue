<template>
  <aside class="menu is-fullheight section column is-narrow">
    <p class="menu-label">
      Vsebine
    </p>
    <ul class="menu-list">
      <li>
        <router-link to="/vina">Vina</router-link>
      </li>
      <li>
        <router-link to="/vinarji">Vinarji</router-link>
      </li>
      <li>
        <router-link to="/sorte">Sorte</router-link>
      </li>
      <li>
        <router-link to="/kraji">Kraji</router-link>
      </li>
    </ul>
    <p class="menu-label">
      Sistem
    </p>
    <ul class="menu-list">
      <li>
        <router-link to="/etikete">Etikete</router-link>
      </li>
      <li>
        <router-link to="/modeli">Model</router-link>
      </li>
      <li>
        <router-link to="/paketi">Vsebinski paketi</router-link>
      </li>
      <li><a>Statistika</a></li>
      <li><a v-on:click="logout()">Odjava</a></li>
    </ul>
  </aside>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'Sidebar',
    methods: {
      logout() {
        this.$localStorage.remove('password');
        Vue.http.headers.common['Authorization'] = undefined;
        this.$router.push('/login');
      }
    }
  };
</script>
