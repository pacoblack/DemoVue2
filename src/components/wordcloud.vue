// 获取容器元素
const container = document.getElementById('wordcloud-container');
// 初始化ECharts实例
const chart = echarts.init(container);

// 配置词云选项
const option = {
  series: [{
    type: 'wordCloud',
    shape: 'circle', // 词云形状：circle, cardioid, diamond, triangle, pentagon, star
    sizeRange: [12, 60], // 文字大小范围
    rotationRange: [-45, 45], // 旋转角度范围
    rotationStep: 45, // 旋转步长
    gridSize: 8, // 网格大小，影响词间距
    drawOutOfBound: false, // 是否允许绘制超出画布
    layoutAnimation: true, // 是否开启动画
    textStyle: {
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      color: function () {
        // 随机颜色
        return 'rgb(' + [
          Math.round(Math.random() * 160),
          Math.round(Math.random() * 160),
          Math.round(Math.random() * 160)
        ].join(',') + ')';
      }
    },
    emphasis: { // 鼠标悬停效果
      focus: 'self',
      textStyle: {
        textShadowBlur: 3,
        textShadowColor: '#333'
      }
    },
    data: [ // 词云数据
      { name: '数据分析', value: 100 },
      { name: '可视化', value: 88 },
      { name: '大数据', value: 76 },
      // ...更多数据
    ]
  }]
};

// 渲染图表
chart.setOption(option);

// 响应窗口大小变化
window.addEventListener('resize', function() {
  chart.resize();
});