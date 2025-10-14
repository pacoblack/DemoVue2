<template>
  <div>
    <!-- 为ECharts准备一个具备大小（宽高）的DOM -->
    <div ref="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
// 引入ECharts主模块
import * as echarts from 'echarts';

export default {
  name: 'EchartsDemo',
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main);

    // 绘制图表
    const testData = [2.0, 18.2, 3.3, 4.5, 16.3, 10.2, 20.3].map(num => ({value: num >= 15 ? 15 : num, num }))
    myChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      },
      formatter(params) {
        console.log(params);
        return params.reduce((res, item, index) => {
          if (index === 0) {
            res += `${item.axisValue}`
          }
          if (item.seriesName === 'Temperature') {
            res += `${item.marker + item.seriesName + item.data.num} ℃`
          } else {
            res += `${item.marker + item.seriesName + item.data} ml`
          }
          return res
        }, '')
      }
    },
    legend: {
      data: ['Evaporation', 'Precipitation', 'Temperature'],
      bottom: 10
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Precipitation',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} ml'
        }
      },
      {
        type: 'value',
        name: 'Temperature',
        min: 0,
        max: 15,
        interval: 5,
        axisLabel: {
          formatter: '{value} °C'
        }
      }
    ],
    series: [
      {
        name: 'Evaporation',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ml';
          }
        },
        data: [
          2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
        ]
      },
      {
        name: 'Precipitation',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ml';
          }
        },
        data: [
          2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
        ]
      },
      {
        name: 'Temperature',
        type: 'line',
        yAxisIndex: 1,
        data: testData
      }
    ]
  });
  }
}
</script>

<style scoped>

</style>