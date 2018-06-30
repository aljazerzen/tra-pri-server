<template>
  <section class="section">

    <nav class="level">
      <div class="level-left">  
        <h1 class="title">
          Generiranje modela <span class="tag" v-if="connected">Connected</span>
        </h1>
      </div>
      <div class="level-right">
        <div class="button" @click=load style="margin-right: 10px">Osveži</div>
        <div class="button is-primary" @click=start>Start</div>
      </div>
    </nav>

    <pre id="terminal" ref="terminal">
      <div v-for="(line, index) in lines" :key="index" :style="line.style" >{{line.text}}</div>
    </pre>

  </section>
</template>
<script>
export default {
  name: "Model",
  data: () => ({
    lines: [],
    connected: false,
  }),
  mounted() {
    this.load();
  },
  methods: {
    start() {
      this.$http.post("tf-models");
    },
    load() {
      this.lines = [];
      let req = new XMLHttpRequest();

      req.open("GET", this.$url.options.root + "tf-models/stream");
      req.setRequestHeader(
        "authorization",
        this.$http.headers.common["Authorization"]
      );

      let last_index = 0;
      req.onprogress = () => {
        this.connected = true;

        let curr_index = req.response.length;
        if (last_index == curr_index) return;
        let s = req.response.substring(last_index, curr_index);
        last_index = curr_index;
        this.dataRecieved(s);
      };
      req.onload = () => {
        this.connected = false;
      }

      req.send();
    },
    dataRecieved(data) {
      this.lines.push(
        ...data.split("\n").map(text => {
          if (text.substr(0, 3) === "...")
            return {
              text: text.substr(3),
              style: "color: #fbff00"
            };
          if (text.substr(0, 3) === "###")
            return {
              text: text.substr(3),
              style: "color: #ff7878"
            };
          return { text, style: "" };
        })
      );

      this.$nextTick(() => {
        if (this.$refs.terminal)
          this.$refs.terminal.scrollTop = this.$refs.terminal.scrollHeight;
      });
    }
  }
};
</script>

<style>
pre {
  background-color: #444;
  border-radius: 8px;
  padding: 0 2em;

  color: #eee;
  font-size: 12px;
  white-space: pre-wrap;
  font-weight: bold;
  max-height: 80vh;
  min-height: 500px;
}
</style>
