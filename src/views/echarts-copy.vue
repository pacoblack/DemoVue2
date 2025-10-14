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
    myChart.setOption({
            title: {
                text: '项目状态统计（近6个月）',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function(params) {
                    let result = params[0].name + '<br/>';
                    params.forEach(item => {
                        result += `${item.marker} ${item.seriesName}: ${item.value}%<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['进行中', '已完成', '预期'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: '百分比',
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            yAxis: {
                type: 'category',
                name: '月份',
                data: ['2024-01', '2024-02', '2023-03', '2023-04', '2023-05', '2023-06'],
                axisTick: {
                    alignWithLabel: true
                }
            },
            series: [
                {
                    name: '进行中',
                    type: 'bar',
                    stack: 'total',
                    emphasis: { focus: 'series' },
                    itemStyle: { color: '#5470c6' },
                    label: { show: true, formatter: '{c}%' },
                    data: [25, 30, 20, 35, 15, 40]
                },
                {
                    name: '已完成',
                    type: 'bar',
                    stack: 'total',
                    emphasis: { focus: 'series' },
                    itemStyle: { color: '#91cc75' },
                    label: { show: true, formatter: '{c}%' },
                    data: [60, 50, 65, 45, 70, 40]
                },
                {
                    name: '预期',
                    type: 'bar',
                    stack: 'total',
                    emphasis: { focus: 'series' },
                    itemStyle: { color: '#fac858' },
                    label: { show: true, formatter: '{c}%' },
                    data: [15, 20, 15, 20, 15, 20]
                }
            ]
  });
  }
}
</script>

<style scoped>

</style>