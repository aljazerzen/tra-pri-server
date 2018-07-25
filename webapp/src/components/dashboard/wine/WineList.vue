<template>
  <div>
    <div class="card" v-for="wine in wines" v-bind:key="wine.id" :ref="'card' + wine.id" tabindex="0">
      <a class="card-header" @click="$emit('wine-click', wine)">
        <div class="card-header-title level">
          <p class="level-left">
            <i class="has-text-grey" v-if=wine.winemaker>
              <LocaleSpan v-bind:object="wine.winemaker.name" v-if="wine.winemaker" locale='sl'/>: 
            </i> {{ wine.name }}
          </p>
          <p class="level-right " v-if="wine.code">
            <span v-if="wine.year" class="tag is-light">{{ wine.year}}</span>
            {{ wine.code }}
          </p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import LocaleSpan from "../../common/LocaleSpan";

export default {
  name: "WineList",
  components: { LocaleSpan },
  props: ['wines']
};
</script>

<style scoped>
.card {
  margin-bottom: 10px;
}

.card-header-title .tag {
  margin-right: 10px;
}

.card-header-title .level-left i {
  margin-right: 10px;
}

.a {
  color: black;
}
</style>
