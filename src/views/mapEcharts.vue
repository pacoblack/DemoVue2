<template>
  <div ref="chart" style="width:100%; height:600px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import xionganMap from '@/assets/map/xiongan.json';

export default {
  mounted() {
    echarts.registerMap('xiongan', xionganMap);
    const chart = echarts.init(this.$refs.chart);
    chart.setOption({
      series: [{
        type: 'map',
        map: 'xiongan',
        label: { show: true },
        // 可以为每个县设置不同颜色（需数据中包含区域名称）
        data: [
          { name: '雄县', itemStyle: { areaColor: '#a1c9f0' } },
          { name: '容城县', itemStyle: { areaColor: '#f0c9a1' } },
          { name: '安新县', itemStyle: { areaColor: '#c9f0a1' } }
        ]
      }]
    });
  }
}
</script>