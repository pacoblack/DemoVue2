
<template>
  <div class="topology-container">
    <!-- 全局唯一的 G6 画布挂载点 -->
    <div class="canvas-wrapper" ref="canvasRef"></div>

    <!-- Vue 原生 Tooltip 浮层 -->
    <div 
      v-show="tooltip.show" 
      class="custom-vue-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="tooltip-title">{{ tooltip.title }}</div>
      <div class="topology-tooltip-content">{{ tooltip.text }}</div>
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6';

export default {
  name: 'PerfectMatchG6Topology',
  data() {
    return {
      graphInstance: null,
      tooltip: { show: false, x: 0, y: 0, title: '', text: '' }
    };
  },
  mounted() {
    this.registerPureCanvasNode();
    this.registerCustomOrthoEdge();
    this.initTopology();
  },
  beforeDestroy() {
    if (this.graphInstance) {
      this.graphInstance.destroy();
    }
  },
  methods: {
    /**
     * 1. 注册纯 Canvas 节点：二级青蓝色块，三级长条竖排文本
     */
    registerPureCanvasNode() {
      G6.registerNode('combo-canvas-column-node', {
        draw(cfg, group) {
          const leaves = cfg.leaves || [];
          const leafCount = leaves.length;

          const parentRect = group.addShape('rect', {
            attrs: {
              x: -55,
              y: 0,
              width: 110,
              height: 40,
              fill: '#5bc0be', 
              radius: 4,
            },
            name: 'parent-rect-shape'
          });

          group.addShape('text', {
            attrs: {
              x: 0,
              y: 20,
              text: cfg.label,
              fontSize: 12,
              fontWeight: 'bold',
              fill: '#ffffff',
              textAlign: 'center',
              textBaseline: 'middle',
              fontFamily: 'sans-serif'
            },
            name: 'parent-text-shape'
          });

          if (leafCount === 0) return parentRect;

          const axisLineHeight = 30 + leafCount * 210 - 20;
          group.addShape('path', {
            attrs: {
              path: [
                ['M', 0, 40], 
                ['L', 0, 40 + axisLineHeight]
              ],
              stroke: '#cbd5e1',
              lineWidth: 1.5
            },
            name: 'axis-main-line'
          });

          leaves.forEach((leafName, index) => {
            const startY = 40 + 30 + index * 210;

            group.addShape('rect', {
              attrs: {
                x: -23,
                y: startY,
                width: 46,
                height: 190,
                fill: '#ffffff',
                stroke: '#5bc0be',
                lineWidth: 1.5,
                radius: 4,
                rawText: leafName,
                isLeafBlock: true
              },
              name: 'leaf-rect-shape'
            });

            const verticalText = leafName.split('').join('\n');
            group.addShape('text', {
              attrs: {
                x: 0,
                y: startY + 95,
                text: verticalText,
                fontSize: 12,
                fontWeight: 500,
                fill: '#3a7d7b',
                textAlign: 'center',
                textBaseline: 'middle',
                lineHeight: 14,
                letterSpacing: 3,
                fontFamily: 'sans-serif',
                pointerEvents: 'none'
              },
              name: 'leaf-text-shape'
            });
          });

          return parentRect;
        }
      });
    },

    /**
     * 2. 注册自定义分流折线
     * 指挥部到半空隐形点只拉一根唯一的垂直线；从隐形点出发的线再统一在水平方向上分串展开。
     */
    registerCustomOrthoEdge() {
      G6.registerEdge('custom-ortho-polyline', {
        draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;

          let path = [];
          if (cfg.source === 'root' && cfg.target === 'hub') {
            // A. 主干线：从指挥部底部正中心垂直拉到半空分流点
            path = [
              ['M', startPoint.x, startPoint.y],
              ['L', endPoint.x, endPoint.y]
            ];
          } else {
            // B. 分支线：从半空的隐形点出发，先向左向右拉平，然后再垂直直角接入下级公司
            path = [
              ['M', startPoint.x, startPoint.y],
              ['L', endPoint.x, startPoint.y],   // 在半空中平铺横展开
              ['L', endPoint.x, endPoint.y]      // 垂直接入公司顶部中心
            ];
          }

          const shape = group.addShape('path', {
            attrs: {
              path,
              stroke: '#cbd5e1', 
              lineWidth: 1.5,
              radius: 4          
            },
            name: 'custom-path-edge'
          });
          return shape;
        }
      });
    },

    /**
     * 3. 组装数据源
     */
    generateLayoutData() {
      const config = [
        { id: 'dept-1', label: '中国铁路', leaves: ['青藏铁路xx至xx标段'] },
        { id: 'dept-2', label: '中国中铁', leaves: ['青藏铁路A1标段工程', '青藏铁路A2常规路基标段'] }, 
        { id: 'dept-3', label: '中国铁工', leaves: ['青藏铁路xx至xx标段', '青藏铁路xx至xx标段'] },
        { id: 'dept-4', label: '中国中建', leaves: ['青藏铁路xx至xx标段', '青藏铁路xx至xx标段'] },
        { id: 'dept-5', label: '中国交建', leaves: ['青藏铁路xx至xx标段'] }, 
        { id: 'dept-6', label: '中国中冶', leaves: ['青藏铁路xx至xx标段'] },
        { id: 'dept-7', label: '中国电建', leaves: ['青藏铁路xx至xx标段'] },
        { id: 'dept-8', label: '中国铁建', leaves: ['青藏铁路xx至xx标段'] },
        { id: 'dept-9', label: '中国新兴', leaves: ['青藏铁路xx至xx标段'] }
      ];

      const nodes = [
        // 🌟【高精度居中校准点】：显式改写 style.x 和 style.y，减去其自身宽高的一半
        // 这会强行把一级的“原点参考参考系”由左上角修正为正几何中心，从而令主干线零误差精准从其中轴线垂下
        { 
          id: 'root', 
          label: '指挥部', 
          rawLabel: '指挥部',
          x: 0, 
          y: -240, 
          type: 'rect', 
          size: [160, 50],
          anchorPoints: [[0.5, 1]], // 强制锁死在指挥部底边中点发射连线
          style: { 
            x: -80, // 宽160的一半
            y: -25, // 高50的一半
            fill: '#264653', 
            stroke: '#1a202c', 
            lineWidth: 1, 
            radius: 4 
          },
          labelCfg: { 
            style: { 
              fill: '#ffffff', 
              fontSize: 13, 
              fontWeight: 'bold' 
            } 
          }
        },
        // 在半空中埋入一个隐形的小圆点作为连线集线器
        {
          id: 'hub',
          x: 0,
          y: -140,
          type: 'circle',
          size: 1,
          style: { opacity: 0, fill: 'none', stroke: 'none' } 
        }
      ];
      const edges = [];

      // 指挥部只连线向这个半空的隐形桩点
      edges.push({ source: 'root', target: 'hub' });

      const totalCount = config.length;
      const spacingX = 145; 
      const startX = -((totalCount - 1) * spacingX) / 2;

      config.forEach((parent, index) => {
        const currentX = startX + index * spacingX;
        
        let shortLabel = parent.label;
        if (shortLabel && shortLabel.length > 6) {
          shortLabel = shortLabel.substring(0, 6) + '...';
        }

        nodes.push({
          id: parent.id,
          label: shortLabel,
          rawLabel: parent.label,
          x: currentX,
          y: -100, 
          type: 'combo-canvas-column-node', 
          leaves: parent.leaves,
          anchorPoints: [[0.5, 0]] 
        });

        // 所有的二级公司，全部由半空中这个隐形桩点横向发散连过去
        edges.push({ source: 'hub', target: parent.id });
      });

      return { nodes, edges };
    },

    initTopology() {
      const container = this.$refs.canvasRef;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      this.graphInstance = new G6.Graph({
        container: container,
        width,
        height,
        renderer: 'canvas', 
        fitView: true,
        fitViewPadding: 50,
        modes: {
          default: ['drag-canvas', 'zoom-canvas'] 
        },
        defaultEdge: {
          type: 'custom-ortho-polyline'
        }
      });

      const data = this.generateLayoutData();
      
      data.nodes.forEach(node => {
        node.x = node.x + width / 2;
        node.y = node.y + height / 2;
      });

      this.graphInstance.data(data);
      this.graphInstance.render();

      this.bindCustomTooltipEvents();
    },

    bindCustomTooltipEvents() {
      this.graphInstance.on('mousemove', (e) => {
        const targetShape = e.target;
        if (!targetShape) {
          this.tooltip.show = false;
          return;
        }

        const model = e.item ? e.item.getModel() : null;
        if (!model) {
          this.tooltip.show = false;
          return;
        }

        if (model.id === 'hub') {
          this.tooltip.show = false;
          return;
        }

        const isLeafBlock = targetShape.get('attrs') && targetShape.get('attrs').isLeafBlock;
        
        this.tooltip.x = e.clientX + 15;
        this.tooltip.y = e.clientY + 15;
        this.tooltip.show = true;

        if (isLeafBlock) {
          this.tooltip.title = '标段详情';
          this.tooltip.text = targetShape.get('attrs').rawText;
        } else {
          if (model.id === 'root') {
            this.tooltip.show = false; 
            return;
          }
          this.tooltip.title = '单位名称';
          this.tooltip.text = model.rawLabel; 
        }
      });

      this.graphInstance.on('canvas:mouseleave', () => { this.tooltip.show = false; });
      this.graphInstance.on('canvas:dragstart', () => { this.tooltip.show = false; });
      this.graphInstance.on('canvas:zoomstart', () => { this.tooltip.show = false; });
    }
  }
};
</script>

<style scoped>
.topology-container {
  width: 100%;
  height: 850px;
  background: #ffffff; 
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
}

.custom-vue-tooltip {
  position: fixed; 
  z-index: 9999;
  background-color: rgba(15, 23, 42, 0.96);
  border: 1px solid #334155;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  padding: 10px 14px;
  pointer-events: none;
  max-width: 240px;
  word-break: break-all;
  white-space: normal;
  transition: opacity 0.05s ease;
}

.tooltip-title {
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
  font-weight: 700;
  font-family: sans-serif;
}

.topology-tooltip-content {
  font-size: 13px;
  color: #38bdf8;
  font-weight: 600;
  line-height: 1.4;
  font-family: sans-serif;
}
</style>
