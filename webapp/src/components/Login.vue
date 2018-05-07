<template>
  <section class="section columns is-centered">
    <div class="box has-background-dark column is-half-tablet has-text-centered">

      <h1 class="title has-text-white-ter is-size-1">TraPri CMS</h1>

      <form v-on:submit.prevent="login()">
        <div class="field">
          <label class="label has-text-white-ter">Geslo</label>
          <div class="control">
            <input class="input" type="password" v-model="password">
          </div>
          <p class="help is-size-6 is-danger"><br>{{ errors[0] }}<br><br></p>
        </div>

        <button type="submit"
                class="button is-medium is-rounded is-danger has-shadow"
                v-bind:class="loading ? 'is-loading' : ''">Vstop
        </button>
      </form>

    </div>
  </section>
</template>

<script>
  import { errorHandler } from '../errorHandler';
  import Vue from 'vue';

  export default {
    data() {
      return {
        loading: false,
        errors: [],
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          this.loading = true;
          this.errors = [];

          await this.$http.get('auth', { headers: { Authorization: this.password } });

          this.$localStorage.set('password', this.password);
          Vue.http.headers.common['Authorization'] = this.password;
          this.$router.push('/vina');

        } catch (e) {
          errorHandler(this)(e);
        }
        this.loading = false;
      }
    }
  };
</script>

<style scoped>
  .field {
    margin: 7em auto 1em auto;
    max-width: 300px;
  }

  .box {
    padding-top: 6em;
    padding-bottom: 4em;
  }
</style>
