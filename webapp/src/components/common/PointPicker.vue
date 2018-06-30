<template>
  <div class="picker">
    <canvas v-bind:width="width" v-bind:height="height" ref="canvas"
      style="pointer-events: all;"
      @mousedown="dragStart"
      @mousemove="dragMove"
      @mouseup="dragging = null"></canvas>
  </div>
</template>

<script>
export default {
  name: "PointPicker",
  props: ["width", "height", "points"],
  data: () => ({
    ctx: null,
    dragging: null
  }),
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");

    this.$watch("width", () => this.setPoints([]));
    if (this.$refs.canvas) this.setPoints([]);
  },
  methods: {
    setPoints(points) {
      if (!points || points.length < 6) {
        points = [
          { x: 0.1, y: 0.3 },
          { x: 0.5, y: 0.25 },
          { x: 0.9, y: 0.3 },
          { x: 0.9, y: 0.7 },
          { x: 0.5, y: 0.75 },
          { x: 0.1, y: 0.7 }
        ].map(a => ({ x: this.width * a.x, y: this.height * a.y }));
      }

      this.$emit("points-set", points);
      this.$nextTick(this.redraw);
    },
    dragStart(event) {
      const x = this.width * event.offsetX / this.$refs.canvas.clientWidth;
      const y = this.height * event.offsetY / this.$refs.canvas.clientHeight;
      this.dragging = this.points.find(
        p => Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)) < 100
      );
    },
    dragMove(event) {
      if (this.dragging) {
        this.dragging.x =
          this.width * event.offsetX / this.$refs.canvas.clientWidth;
        this.dragging.y =
          this.height * event.offsetY / this.$refs.canvas.clientHeight;
        this.redraw();
      }
    },
    redraw() {
      this.ctx.clearRect(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
      this.drawPolygon();
      for (let { x, y } of [...this.points]) {
        this.drawCircle(x, y, 2, 0.3);
        this.drawCircle(x, y, 0.5, 1);
      }
    },
    drawPolygon() {
      if(this.points.length < 6)
        return;
      this.ctx.beginPath();

      this.ctx.moveTo(this.points[0].x, this.points[0].y);
      this.ctx.quadraticCurveTo(
        this.points[1].x,
        this.points[1].y,
        this.points[2].x,
        this.points[2].y
      );
      this.ctx.lineTo(this.points[3].x, this.points[3].y);
      this.ctx.quadraticCurveTo(
        this.points[4].x,
        this.points[4].y,
        this.points[5].x,
        this.points[5].y
      );
      this.ctx.lineTo(this.points[0].x, this.points[0].y);

      this.ctx.fillStyle = "rgba(255,255,255,0.5)";
      this.ctx.fill();
      this.ctx.strokeStyle = "rgba(128,128,128,1)";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    },
    drawCircle(x, y, r, opacity) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, r * this.width / 100, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0,0,0,${opacity})`;
      this.ctx.fill();
    }
  }
};
</script>

<style scoped>
.picker,
canvas {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

.topbar {
  width: 100%;
  margin-top: 5px;
  text-align: center;
}

.topbar > * {
  margin-right: 1em;
  /*display: inline-block;*/
}
</style>
