<template>
  <div ref="chart" style="width: 100%; height: 500px;"></div>
</template>

<script>
import * as echarts from 'echarts/core'
import { SurfaceChart } from 'echarts-gl/charts'
import { Grid3DComponent } from 'echarts-gl/components'
echarts.use([SurfaceChart, Grid3DComponent])

export default {
  name: 'Pie3DWithLabels',
  props: {
    chartData: {
      type: Array,
      default: () => [
        { name: 'A', value: 40 },
        { name: 'B', value: 30 },
        { name: 'C', value: 20 },
        { name: 'D', value: 10 }
      ]
    },
    colors: {
      type: Array,
      default: () => ['#5470c6', '#fac858', '#ee6666', '#73c0de']
    },
    innerRadiusRatio: { type: Number, default: 0 },    // 0~1，0实心，0.5半空心
    thickness: { type: Number, default: 10 },           // 饼图厚度
    alpha: { type: Number, default: 40 },               // 俯仰角
    beta: { type: Number, default: 30 },                // 偏航角
    showLabels: { type: Boolean, default: true }        // 是否显示标注
  },
  data() {
    return {
      chart: null,
      containerSize: { width: 0, height: 0 }
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
    this.$nextTick(() => this.updateContainerSize())
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.chart?.dispose()
  },
  methods: {
    handleResize() {
      this.chart?.resize()
      this.updateContainerSize()
      this.updateChart()
    },
    updateContainerSize() {
      const rect = this.$refs.chart.getBoundingClientRect()
      this.containerSize = { width: rect.width, height: rect.height }
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart)
      this.updateChart()
    },
    updateChart() {
      const option = this.buildOption()
      this.chart.setOption(option, { notMerge: false })
    },
    buildOption() {
      const data = this.chartData
      const colors = this.colors
      const total = data.reduce((sum, item) => sum + item.value, 0)
      let start = 0

      // 计算 k 值：内径比例 innerRadiusRatio 转 k
      const k = this.innerRadiusRatio === 0 ? 1 : (1 - this.innerRadiusRatio) / (1 + this.innerRadiusRatio)

      const series = []
      data.forEach((item, index) => {
        const end = start + item.value
        const startRatio = start / total
        const endRatio = end / total

        series.push({
          name: item.name,
          type: 'surface',
          parametric: true,
          wireframe: { show: false },
          itemStyle: { color: colors[index % colors.length] },
          parametricEquation: this.getParametricEquation(
            startRatio, endRatio, false, false, k, this.thickness
          )
        })
        start = end
      })

      const option = {
        xAxis3D: { show: false },
        yAxis3D: { show: false },
        zAxis3D: { show: false },
        grid3D: {
          show: false,
          boxHeight: this.thickness / 2,
          viewControl: {
            alpha: this.alpha,
            beta: this.beta,
            distance: 300,
            autoRotate: false
          }
        },
        series: series
      }

      if (this.showLabels && this.containerSize.width) {
        option.graphic = this.generateGraphics(data, colors, total)
      }

      return option
    },
    getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, height) {
      const startRadian = startRatio * Math.PI * 2
      const endRadian = endRatio * Math.PI * 2
      const hoverRate = isHovered ? 1.05 : 1
      const offsetX = isSelected ? Math.cos((startRadian + endRadian) / 2) * 0.1 : 0
      const offsetY = isSelected ? Math.sin((startRadian + endRadian) / 2) * 0.1 : 0

      return {
        u: { min: -Math.PI, max: Math.PI * 3, step: Math.PI / 32 },
        v: { min: 0, max: Math.PI * 2, step: Math.PI / 20 },
        x: (u, v) => {
          if (u < startRadian) return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
          if (u > endRadian) return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
          return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate
        },
        y: (u, v) => {
          if (u < startRadian) return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
          if (u > endRadian) return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate
        },
        z: (u, v) => (Math.sin(v) > 0 ? height * 0.1 : -height * 0.1)
      }
    },
    generateGraphics(data, colors, total) {
      const graphics = []
      const radius = 2.0 // 估算的外半径（根据参数方程中 (1+cos(v)*k) 的最大值）
      const scale = Math.min(this.containerSize.width, this.containerSize.height) * 0.2 // 转换系数
      const centerX = this.containerSize.width / 2
      const centerY = this.containerSize.height / 2

      let start = 0
      data.forEach((item, index) => {
        const end = start + item.value
        const midRatio = (start + end) / (2 * total)
        const angle = midRatio * Math.PI * 2

        // 估算扇形中心的三维坐标
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const z = 0

        // 映射到 2D 屏幕（简化透视投影）
        const screenX = centerX + x * scale
        const screenY = centerY - y * scale  // 注意 y 轴反向

        // 引导线终点（向外延伸 50px）
        const endX = screenX + Math.cos(angle) * 50
        const endY = screenY - Math.sin(angle) * 50

        // 引导线
        graphics.push({
          type: 'line',
          shape: { x1: screenX, y1: screenY, x2: endX, y2: endY },
          style: { stroke: colors[index % colors.length], lineWidth: 2, lineDash: [4, 4] },
          z: 100
        })

        // 文字背景
        graphics.push({
          type: 'rect',
          left: endX + 5,
          top: endY - 15,
          shape: { width: 80, height: 20 },
          style: { fill: 'rgba(255,255,255,0.8)', stroke: colors[index % colors.length], lineWidth: 1 },
          z: 99
        })

        // 文字
        graphics.push({
          type: 'text',
          left: endX + 10,
          top: endY - 10,
          style: {
            text: `${item.name}: ${item.value}`,
            fill: '#333',
            fontSize: 12,
            fontWeight: 'bold'
          },
          z: 101
        })

        start = end
      })

      return graphics
    }
  }
}
</script>