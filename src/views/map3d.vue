<template>
  <div class="topology-container">
    <!-- 全局唯一的 G6 画布挂载点 -->
    <div class="canvas-wrapper" ref="canvasRef"></div>

    <!-- Vue 原生自定义 Tooltip 浮层，像素级紧贴鼠标，零延迟不漂移 -->
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
    // 1. 优先注册 100% 兼容 3.x 的纯原生 Canvas 复合节点形状
    this.registerPureCanvasNode();
    // 2. 注册高精度全景“中轴对齐”正交阶梯折线
    this.registerCustomOrthoEdge();
    // 3. 初始化画布
    this.initTopology();
  },
  beforeDestroy() {
    if (this.graphInstance) {
      this.graphInstance.destroy();
    }
  },
  methods: {
    /**
     * 🌟【最核心改动点】：注册纯 Canvas 复合图形节点
     * 动态测算子节点数量，完美实现“1个垂直居中对齐，多个横向并排直角分叉”的终极视觉效果！
     */
    registerPureCanvasNode() {
      G6.registerNode('combo-canvas-column-node', {
        draw(cfg, group) {
          const leaves = cfg.leaves || [];
          const leafCount = leaves.length;

          // 1. 绘制二级中字头企业的核心青蓝色底框矩形 (110px * 40px)
          const parentRect = group.addShape('rect', {
            attrs: {
              x: -55, // 中心点对称 (110/2)
              y: 0,
              width: 110,
              height: 40,
              fill: '#5bc0be', // 100% 还原截图青蓝色
              radius: 4,
            },
            name: 'parent-rect-shape'
          });

          // 2. 二级节点核心公司名称白字文本
          group.addShape('text', {
            attrs: {
              x: 0,
              y: 20, // 垂直居中
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

          // 🌟【目标图新特征一】：绘制从二级卡片底部正中央垂直引出的短主干轴线
          const branchLineY = 40 + 20; // 在二级卡片下方 20px 高度作为水平分叉平面
          group.addShape('path', {
            attrs: {
              path: [
                ['M', 0, 40], 
                ['L', 0, branchLineY]
              ],
              stroke: '#cbd5e1',
              lineWidth: 1.5
            },
            name: 'axis-main-stem-line'
          });

          // 🌟【目标图新特征二】：根据标段的实际总数，动态建立横向平铺的错位网格跨度
          // 两个相邻并排的长条标段之间横向空开 10px 的安全呼吸留白空隙
          const leafCardW = 46;
          const leafSpacingX = 56; // 46px 宽度 + 10px 留白
          const startLeafX = -((leafCount - 1) * leafSpacingX) / 2;

          // 3. 循环动态排版绘制三级长条标段
          leaves.forEach((leafName, index) => {
            // 依据动态槽位公式，算出每个卡片绝对不会发生重叠的精准 X 轴中心投影坐标
            const currentLeafX = startLeafX + index * leafSpacingX;
            const startY = branchLineY + 15; // 长条卡片顶部固定 Y 轴高度为 75px

            // 🌟【目标图新特征三】：绘制倒 T 型直角分叉的接入线条
            // 线条从半空的分叉点 (0, branchLineY) 出发，水平拉展到当前卡片中轴，再垂直接入卡片顶部中心
            group.addShape('path', {
              attrs: {
                path: [
                  ['M', 0, branchLineY],
                  ['L', currentLeafX, branchLineY],
                  ['L', currentLeafX, startY]
                ],
                stroke: '#cbd5e1',
                lineWidth: 1.5
              },
              name: 'axis-sub-branch-line'
            });

            // 4. 绘制三级长条标段的白底青边框矩形 (46px * 190px)
            group.addShape('rect', {
              attrs: {
                x: currentLeafX - leafCardW / 2, // 动态对称居中
                y: startY,
                width: leafCardW,
                height: 190,
                fill: '#ffffff',
                stroke: '#5bc0be',
                lineWidth: 1.5,
                radius: 4,
                rawText: leafName, // 备份长全称对接 Tooltip
                isLeafBlock: true
              },
              name: 'leaf-rect-shape'
            });

            // 5. 将文本使用换行符 \n 强行垂直拆分，达成文字从上往下、绝对居中的高级竖排呈现
            const verticalText = leafName.split('').join('\n');
            group.addShape('text', {
              attrs: {
                x: currentLeafX, 
                y: startY + 95, // 190px高度垂直中心对齐
                text: verticalText,
                fontSize: 11,
                fontWeight: 500,
                fill: '#3a7d7b', // 深青色字体
                textAlign: 'center',
                textBaseline: 'middle',
                lineHeight: 14,
                letterSpacing: 2,
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
     * 注册高精度全景“中轴锁死”正交阶梯折线（一级连向二级）
     */
    registerCustomOrthoEdge() {
      G6.registerEdge('custom-ortho-polyline', {
        draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;
          const absoluteCenterX = 0; 

          let path = [];
          if (cfg.source === 'root' && cfg.target === 'hub') {
            path = [
              ['M', absoluteCenterX, startPoint.y],
              ['L', absoluteCenterX, endPoint.y]
            ];
          } else {
            path = [
              ['M', startPoint.x, startPoint.y],
              ['L', endPoint.x, startPoint.y],   
              ['L', endPoint.x, endPoint.y]      
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
     * 组装您的真实完整九个公司分支数据（根据目标图动态调整间距）
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
        { 
          id: 'root', 
          label: '指挥部', 
          rawLabel: '指挥部',
          x: 0, 
          y: -160, 
          type: 'rect', 
          size: [160, 50],
          anchorPoints: [[0.5, 1]], 
          style: { x: -80, y: -25, fill: '#264653', stroke: '#1a202c', lineWidth: 1, radius: 4 },
          labelCfg: { style: { fill: '#ffffff', fontSize: 13, fontWeight: 'bold' } }
        },
        {
          id: 'hub',
          x: 0,
          y: -125,
          type: 'circle',
          size: 1,
          style: { opacity: 0, fill: 'none', stroke: 'none' } 
        }
      ];
      const edges = [];

      edges.push({ source: 'root', target: 'hub' });

      const totalCount = config.length;
      // 🌟【高精度视觉对齐】：为了容纳并排的多个标段，将大列之间的横向安全间距调整为 165px，防止列与列之间发生任何擦碰
      const spacingX = 165; 
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

        edges.push({ source: 'hub', target: parent.id });
      });

      return { nodes, edges };
    },

    /**
     * 【修改部分一】：初始化画布体系（废除手动横向坐标相加，改用官方安全的 fitCenter 居中）
     */
    /**
     * 【修改部分一】：初始化画布体系（废除手动横向坐标相加，改用官方安全的 fitCenter 居中）
     */
    initTopology() {
      const container = this.$refs.canvasRef;
      if (!container || container.clientWidth === 0) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      this.graphInstance = new G6.Graph({
        container: container,
        width,
        height,
        renderer: 'canvas', 
        fitView: true,
        fitViewPadding: 60, // 增大留白边距，让画面在画布中更显舒展大方
        modes: {
          default: ['drag-canvas',] 
        },
        defaultEdge: {
          type: 'custom-ortho-polyline'
        }
      });

      const data = this.generateLayoutData();
      
      // 🌟【最核心修复点】：完全删除原先的 node.x = node.x + width / 2 逻辑！
      // 保持数据最清澈的 0 点对称状态直接送给 Canvas 矩阵
      this.graphInstance.data(data);
      this.graphInstance.render();

      // 🌟【最核心修复点】：调用 G6 3.x 标准的视口自适应组合拳，强制让图形的数学几何中心和屏幕的物理中心点像素级重合
      this.graphInstance.fitCenter();
      this.graphInstance.fitView(60);

      this.bindCustomTooltipEvents();
    },

    /**
     * 【修改部分二】：智能数据刷新与重绘引擎（同步更正为标准 changeData 数据流）
     */
    renderOrRefreshChart() {
      const container = this.$refs.canvasRef;
      if (!container) return;

      if (!this.graphInstance) {
        // 如果实例还不存在，触发初始化
        this.initTopology();
      } else {
        if (container.clientWidth === 0) return;

        const data = this.generateLayoutData();

        // 🌟【最核心修复点】：同样删除此处的 node.x 平移，交由 G6 闭环原生的数据流更新
        this.graphInstance.changeData(data); 
        
        // 刷新完毕后，重新命令 Canvas 引擎执行全局视角高精度居中
        this.graphInstance.fitCenter();
        this.graphInstance.fitView(60);
      }
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
