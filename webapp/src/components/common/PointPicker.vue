<template>
  <div class="picker">
    <canvas :width="width * 5" :height="height * 5" ref="canvas"
      style="pointer-events: all;"
      @mousedown="dragStart"
      @mousemove="dragMove"
      @mouseup="dragEnd"></canvas>
  </div>
</template>

<script>
export default {
  name: "PointPicker",
  props: ["width", "height", "points"],
  data: () => ({
    ctx: null,
    dragging: null,
    default: false,
  }),
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");

    this.$watch("width", () => this.reset());
    if (this.$refs.canvas) this.reset();
  },
  methods: {
    reset() {
      if (this.default || !this.points || this.points.length < 6) {
        let points = [
          { x: 0.1, y: 0.3 },
          { x: 0.5, y: 0.25 },
          { x: 0.9, y: 0.3 },
          { x: 0.9, y: 0.7 },
          { x: 0.5, y: 0.75 },
          { x: 0.1, y: 0.7 }
        ].map(a => ({ x: this.width * a.x, y: this.height * a.y }));
        this.default = true;

        this.$emit("points-set", points);
      }
      this.$nextTick(this.redraw);
    },
    dragStart(event) {
      const x = this.width * event.offsetX / this.$refs.canvas.clientWidth;
      const y = this.height * event.offsetY / this.$refs.canvas.clientHeight;
      this.dragging = this.points.find(
        p => Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)) < 15
      );
    },
    dragMove(event) {
      if (this.dragging) {
        this.dragging.x =
          this.width * event.offsetX / this.$refs.canvas.clientWidth;
        this.dragging.y =
          this.height * event.offsetY / this.$refs.canvas.clientHeight;
        this.default = false;
        this.redraw();
      }
    },
    dragEnd() {
      this.dragging = null;
      this.$emit("points-set", this.points);
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

      this.ctx.moveTo(this.points[0].x * 5, this.points[0].y * 5);
      this.ctx.lineTo(this.points[1].x * 5, this.points[1].y * 5)
      this.ctx.lineTo(this.points[2].x * 5, this.points[2].y * 5)
      this.ctx.lineTo(this.points[3].x * 5, this.points[3].y * 5)
      this.ctx.lineTo(this.points[4].x * 5, this.points[4].y * 5)
      this.ctx.lineTo(this.points[5].x * 5, this.points[5].y * 5);
      this.ctx.lineTo(this.points[0].x * 5, this.points[0].y * 5);

      this.ctx.fillStyle = "rgba(255,255,255,0.5)";
      this.ctx.fill();
      this.ctx.strokeStyle = "rgba(128,128,128,1)";
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
    },
    drawCircle(x, y, r, opacity) {
      this.ctx.beginPath();
      this.ctx.arc(x * 5, y * 5, r * this.width / 20, 0, Math.PI * 2);
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
