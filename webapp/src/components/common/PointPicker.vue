<template>
  <div class="picker">
    <canvas v-bind:width="width" v-bind:height="height" v-on:click="addPoint" ref="canvas"></canvas>
    <div class="topbar">
      <div class="tag is-medium">{{ points.length }} / 6</div>
      <div class="tag is-medium button is-danger" v-on:click.stop="setPoints([])">Clear</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PointPicker',
    props: ['width', 'height', 'points'],
    data: () => ({
      ctx: null,
    }),
    mounted() {
      this.ctx = this.$refs.canvas.getContext('2d');

      this.$watch('width', this.redraw);
      this.$watch('height', this.redraw);
      if(this.$refs.canvas) this.redraw();
    },
    methods: {
      addPoint(event) {
        if (this.points.length >= 6) return;
        this.setPoints([...this.points, {
          x: this.width * event.offsetX / this.$refs.canvas.clientWidth,
          y: this.height * event.offsetY / this.$refs.canvas.clientHeight
        }]);
      },
      setPoints(points) {
        this.$emit('points-set', points);
        this.$nextTick(this.redraw);
      },
      redraw() {
        this.ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
        this.drawPolygon();
        for (let { x, y } of [...this.points]) {
          this.drawCircle(x, y, 2, 0.3);
          this.drawCircle(x, y, 0.5, 1);
        }
      },
      drawPolygon() {
        this.ctx.beginPath();
        for (let { x, y } of [...this.points]) {
          this.ctx.lineTo(x, y);
        }
        if (this.points[0]) {
          const { x, y } = this.points[0];
          this.ctx.lineTo(x, y);
        }
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(128,128,128,1)';
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
  .picker, canvas {
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
