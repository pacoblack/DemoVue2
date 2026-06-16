<template>
  <div class="chart-wrapper">
    <div class="chart-title">资金穿透流向图（像素级对齐版）</div>
    <div class="container-inner">
      <div id="mountNode" ref="chartRef"></div>
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6';

export default {
  name: 'MoneyFlowChart',
  data() {
    return {
      graph: null,
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    if (this.graph) this.graph.destroy();
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initChart() {
      const container = this.$refs.chartRef;
      const width = container.scrollWidth || 1200;
      const height = container.scrollHeight || 600;

      // 统一配色定义
      const COLOR_ZX = '#13c2c2';      // 专项债：深青色
      const COLOR_CZ = '#722ed1';      // 财政拨款：紫色

      // ==================== 1. 注册自定义第4层级高级卡片 ====================
      G6.registerNode('custom-card', {
        draw(cfg, group) {
          const w = 150;
          const h = 75;
          const shape = group.addShape('rect', {
            attrs: { x: -w / 2, y: -h / 2, width: w, height: h, fill: '#f4f9ff', stroke: '#bcd6f7', lineWidth: 1.5, radius: 4 },
            name: 'main-box',
          });
          group.addShape('text', {
            attrs: { text: cfg.label, x: 0, y: -14, textAlign: 'center', textBaseline: 'middle', fill: '#1890ff', fontWeight: 'bold', fontSize: 12 },
            name: 'title-text',
          });
          group.addShape('text', {
            attrs: { text: cfg.subLabel || '', x: 0, y: 16, textAlign: 'center', textBaseline: 'middle', fill: '#666666', fontSize: 11 },
            name: 'sub-text',
          });
          return shape;
        },
      });

      // ==================== 2. 全链路数据源（含节点专属 size 配置） ====================
      const data = {
        nodes: [
          // 第 1 层级：源头 (专有 size)
          { id: 'n1', label: '专项债', type: 'rect', size:[90, 36], style: { fill: COLOR_ZX, stroke: COLOR_ZX, radius: 4 }, labelCfg: { style: { fill: '#fff', fontSize: 13, fontWeight: 'bold' } } },
          { id: 'n2', label: '财政拨款', type: 'rect', size:[90, 36], style: { fill: COLOR_CZ, stroke: COLOR_CZ, radius: 4 }, labelCfg: { style: { fill: '#fff', fontSize: 13, fontWeight: 'bold' } } },
          
          // 第 2 层级：中心枢纽 (专有大 size)
          { id: 'n3', label: '上海城市建设发展\n集团有限公司', type: 'rect', size:[150, 60], style: { fill: '#1890ff', stroke: '#1890ff', radius: 4 }, labelCfg: { style: { fill: '#fff', fontSize: 12, lineHeight: 16 } } },
          
          // 第 3 层级：项目分类 (专有中等 size)
          { id: 'n4', label: '城市路面\n维护项目', type: 'rect', size:[110, 50], style: { fill: '#1890ff', stroke: '#1890ff', radius: 4 }, labelCfg: { style: { fill: '#fff', fontSize: 12, lineHeight: 16 } } },
          { id: 'n5', label: '城市桥梁\n整改项目', type: 'rect', size:[110, 50], style: { fill: '#1890ff', stroke: '#1890ff', radius: 4 }, labelCfg: { style: { fill: '#fff', fontSize: 12, lineHeight: 16 } } },
          
          // 第 4 层级：承建商卡片 (size 告知布局计算间距)
          { id: 'n6', label: '华宇建设集团\n有限公司', subLabel: '留存金额：100万元', type: 'custom-card', size: [150, 75] },
          { id: 'n7', label: '嘉宏建设发展\n有限公司', subLabel: '留存金额：100万元', type: 'custom-card', size: [150, 75] },
          
          // 第 5 层级：末端纯文本 (🔴 必须声明固定宽高占位 size，结合底色透明，完美复刻左对齐纯文本并终结大圆圈)
          { id: 'n8',  label: '恒基盛达建材有限公司',   type: 'rect', size:[140, 30], style: { fill: 'transparent', stroke: 'transparent' }, labelCfg: { style: { fill: '#595959', fontSize: 11, textAlign: 'left' } } },
          { id: 'n9',  label: '鑫泰源建筑材料集团',     type: 'rect', size:[140, 30], style: { fill: 'transparent', stroke: 'transparent' }, labelCfg: { style: { fill: '#595959', fontSize: 11, textAlign: 'left' } } },
          { id: 'n10', label: '安速工程机械租赁公司',   type: 'rect', size:[140, 30], style: { fill: 'transparent', stroke: 'transparent' }, labelCfg: { style: { fill: '#595959', fontSize: 11, textAlign: 'left' } } },
          { id: 'n11', label: '启盛机电设备安装商行',   type: 'rect', size:[140, 30], style: { fill: 'transparent', stroke: 'transparent' }, labelCfg: { style: { fill: '#595959', fontSize: 11, textAlign: 'left' } } },
          { id: 'n12', label: '德信门窗幕墙供应商',     type: 'rect', size:[140, 30], style: { fill: 'transparent', stroke: 'transparent' }, labelCfg: { style: { fill: '#595959', fontSize: 11, textAlign: 'left' } } },
          { id: 'n13', label: '瑞达恒砂石水泥供应站',   type: 'rect', size:[140, 30], style: { fill: 'transparent', stroke: 'transparent' }, labelCfg: { style: { fill: '#595959', fontSize: 11, textAlign: 'left' } } },
          { id: 'n14', label: '员工',                   type: 'rect', size:[140, 30], style: { fill: 'transparent', stroke: 'transparent' }, labelCfg: { style: { fill: '#595959', fontSize: 11, textAlign: 'left' } } },
          { id: 'n15', label: '农民工',                 type: 'rect', size:[140, 30], style: { fill: 'transparent', stroke: 'transparent' }, labelCfg: { style: { fill: '#595959', fontSize: 11, textAlign: 'left' } } }
        ],
        edges: [
          // 🔴 曲线1：1/2 处等分曲折 (源头聚合)
          { source: 'n1', target: 'n3', label: '2000.00万元', curveType: 'type-1', style: { stroke: COLOR_ZX } },
          { source: 'n2', target: 'n3', label: '1000.00万元', curveType: 'type-1', style: { stroke: COLOR_CZ } },
          
          // 🔴 曲线2：1/3 与 2/3 处曲折 (路面维护项目为“青紫双线”平行分叉，桥梁项目为单线)
          { source: 'n3', target: 'n4', label: '2000.00万元', curveType: 'type-2', parallelIndex: 1, style: { stroke: COLOR_ZX } },
          { source: 'n3', target: 'n4', curveType: 'type-2', parallelIndex: 2, style: { stroke: COLOR_CZ } }, 
          { source: 'n3', target: 'n5', label: '1000.00万元', curveType: 'type-2', style: { stroke: COLOR_ZX } },
          
          // 🔴 曲线3：不曲折（纯绝对平直直线段，路面流向华宇保持两条，桥梁流向嘉宏为单条）
          { source: 'n4', target: 'n6', label: '500.00万元', curveType: 'type-3', parallelIndex: 1, style: { stroke: COLOR_ZX } },
          { source: 'n4', target: 'n6', curveType: 'type-3', parallelIndex: 2, style: { stroke: COLOR_CZ } },
          { source: 'n5', target: 'n7', label: '500.00万元', curveType: 'type-3', style: { stroke: COLOR_ZX } },
          
          // 🔴 曲线4：1/4 与 2/4 处曲折并拉直 (最右侧叶子节点多曲线分流展示)
          { source: 'n6', target: 'n8', label: '100.00万元', curveType: 'type-4', style: { stroke: COLOR_ZX } },
          { source: 'n6', target: 'n9', label: '100.00万元', curveType: 'type-4', style: { stroke: COLOR_ZX } },
          { source: 'n6', target: 'n10', label: '100.00万元', curveType: 'type-4', style: { stroke: COLOR_ZX } },
          { source: 'n6', target: 'n8', label: '100.00万元', curveType: 'type-4', parallelIndex: 1, style: { stroke: COLOR_CZ } },
          { source: 'n6', target: 'n9', label: '100.00万元', curveType: 'type-4', parallelIndex: 1, style: { stroke: COLOR_CZ } },
          { source: 'n6', target: 'n10', label: '100.00万元', curveType: 'type-4', parallelIndex: 1, style: { stroke: COLOR_CZ } },
          
          { source: 'n7', target: 'n11', label: '100.00万元', curveType: 'type-4', style: { stroke: COLOR_ZX } },
          { source: 'n7', target: 'n12', label: '100.00万元', curveType: 'type-4', style: { stroke: COLOR_ZX } },
          { source: 'n7', target: 'n13', label: '100.00万元', curveType: 'type-4', style: { stroke: COLOR_ZX } },
          { source: 'n7', target: 'n14', label: '100.00万元', curveType: 'type-4', style: { stroke: COLOR_ZX } },
          { source: 'n7', target: 'n15', label: '100.00万元', curveType: 'type-4', style: { stroke: COLOR_ZX } },
        ],
      };
      // ==================== 3. 🔴 核心逻辑重构：手搓 4 种特定比例控制点的自定义连线 ====================
      G6.registerEdge('perfect-link', {
        draw(cfg, group) {
            let startPoint = cfg.startPoint;
            const endPoint = cfg.endPoint;
            const strokeColor = (cfg.style && cfg.style.stroke) || '#1890ff';

            if (cfg.curveType === 'type-4' && group) {
                // 在 G6 的高级图形组中，group.get('item') 可以直接拿到当前 Edge 的完整实例对象
                const edgeItem = group.get('item'); 
                if (edgeItem && typeof edgeItem.getSource === 'function') {
                    const sourceNode = edgeItem.getSource(); // 直接通过边拿到它的起点节点
                    if (sourceNode) {
                        const model = sourceNode.getModel();
                        // 🎯 强行抹平飘移：无视锚点带来的计算扰动，直接捕获整个主节点的几何中心点坐标
                        startPoint = {
                            x: startPoint.x,
                            y: model.y 
                        };
                    }
                }
            }
            
            // 1. 人工强制纵向微调偏置（解决第2、第4条链路中多条平行折线完全重叠、看不清的问题）
            let offsetPadding = 0;
            if (strokeColor === COLOR_CZ) offsetPadding = -6; // 第一条线中段往上偏 6px

            let path = [];
            const deltaX = endPoint.x - startPoint.x;

            // 🔴 折线类型 1：第一条线 -> 在横坐标 1/2 处精准直角折弯，纵坐标在 1/2 处与目标完全平齐
            if (cfg.curveType === 'type-1') {
                const turnX = startPoint.x + deltaX * 0.5;
                path = [
                    ['M', startPoint.x, startPoint.y],                      // 1. 从起点出发
                    ['L', turnX, endPoint.y + offsetPadding],                // 3. 🔴 90度垂直下落：纵坐标在此处直接与目标完全对齐！
                    ['L', endPoint.x - 6, endPoint.y+ offsetPadding]                        // 4. 再次90度直角折弯，笔直滑入目标节点
                ];
            } 
            // 🔴 折线类型 2：第二条线 -> 在横坐标 1/3 发生直角折弯，并在 2/3 处完成平移（双拐点阶梯直角折线）
            else if (cfg.curveType === 'type-2') {
                const turnX1 = startPoint.x + deltaX * 0.33;
                const turnX2 = startPoint.x + deltaX * 0.66;
                path = [
                    ['M', startPoint.x, startPoint.y+ offsetPadding],                      // 1. 从起点出发
                    ['L', turnX1, startPoint.y + offsetPadding],             // 2. 直线水平走到 1/3 处
                    ['L', turnX2, endPoint.y + offsetPadding],               // 4. 水平笔直向前走到 2/3 处（双曲线在此平行错开）
                    ['L', endPoint.x - 6, endPoint.y + offsetPadding]                        // 5. 笔直滑入目标节点
                ];
            } 
            // 🔴 折线类型 3：第三条线 -> 完全不曲折（100% 绝对纯水平直线）
            else if (cfg.curveType === 'type-3') {
                path = [
                    ['M', startPoint.x, startPoint.y+ offsetPadding],                      // 起点
                    ['L', endPoint.x - 6, endPoint.y+ offsetPadding]                        // 终点，直接一根直线连过去
                ];
            } 
            // 🔴 折线类型 4：第四条线 -> 在横坐标 1/4 处发生 90度垂直折弯，纵坐标在 1/4 处立刻与目标完全平齐
            else if (cfg.curveType === 'type-4') {
                console.log("###. "+ cfg.source, cfg.startPoint.y)
                const turnX = startPoint.x + deltaX * 0.25;
                const halfX = startPoint.x + deltaX * 0.5;
                path = [
                    ['M', startPoint.x, startPoint.y + offsetPadding],                      // 1. 从起点出发
                    ['L', turnX, startPoint.y+offsetPadding],              // 2. 直线水平走到 1/4 处
                    ['L', halfX, endPoint.y + offsetPadding],                // 3. 🔴 90度垂直下落：纵坐标在 1/4 处瞬间拉平与目标对齐！
                    ['L', endPoint.x - 8, endPoint.y+offsetPadding]                        // 4. 剩下的 3/4 极长距离全是一条绝对平直的直线，清爽分流
                ];
            }

            // A. 绘制标准的直角折线
            const keyShape = group.addShape('path', {
                attrs: {
                    path,
                    stroke: strokeColor,
                    lineWidth: 1.8,
                },
                name: 'edge-path',
            });

            // B. 建立百分之百方向端正的实心三角形箭头
            group.addShape('path', {
                attrs: {
                    path: [
                        ['M', endPoint.x - 2, endPoint.y],        
                        ['L', endPoint.x - 9, endPoint.y - 7],  
                        ['L', endPoint.x - 9, endPoint.y + 7],  
                        ['Z']                                     
                    ],
                    fill: strokeColor, 
                    stroke: strokeColor,
                },
                name: 'edge-arrow',
            });

             // ==================== 🔴 核心修复：在此处手工将文字渲染上屏 ====================
            if (cfg.label) {
                // 1. 获取全局与单边的 labelCfg 配置
                const labelCfg = (cfg.labelCfg) || {};
                const labelStyle = labelCfg.style || {};
                const bgStyle = labelStyle.background || {};
                const padding = bgStyle.padding || 4;

                // 2. 🔴 控制位置：从数据或配置中获取位置比例（如 0.5 居中，0.75 靠右，0.3 靠左）
                // 您可以在 edges 数据的单条边里加上 labelPosition: 0.65 来单独控制某条线的文字位置
                const positionRatio = cfg.labelPosition || labelCfg.position || 0.5;
                const centerPoint = keyShape.getPoint(positionRatio); 
                
                // 3. 计算文字向上漂浮的纵向位移
                const refY = labelCfg.refY !== undefined ? labelCfg.refY : -10;
                const textX = centerPoint.x;
                const textY = centerPoint.y + refY;

                // 4. 精确测量文本物理高宽以适配底框
                const fontSize = labelStyle.fontSize || 10;
                const size = G6.Util.getTextSize(cfg.label, fontSize);
                const bgWidth = size[0] + padding[1] + padding[3];  // 文字宽 + 右padding + 左padding
                const bgHeight = size[1] + padding[0] + padding[2]; // 文字高 + 上padding + 下padding

                // 5. 🔴 绘制全白底色，并增加了 border（边框）支持
                group.addShape('rect', {
                    attrs: {
                        x: textX - bgWidth / 2,
                        y: textY - bgHeight / 2,
                        width: bgWidth,
                        height: bgHeight,
                        fill: bgStyle.fill || '#ffffff',
                        radius: bgStyle.radius || 2,
                        
                        // 🌟 新增边框核心属性：
                        stroke: bgStyle.stroke || '#e8e8e8',      // 边框颜色（不传默认给淡淡的灰色 border）
                        lineWidth: bgStyle.lineWidth || 1,        // 边框粗细
                        lineDash: bgStyle.lineDash || undefined,   // 还可以支持虚线边框 [4, 4]
                    },
                    name: 'edge-label-bg',
                });

                // 6. 绘制真实的金额文本
                group.addShape('text', {
                    attrs: {
                        text: cfg.label,
                        x: textX,
                        y: textY,
                        fontSize,
                        fill: labelStyle.fill || '#999999',
                        textAlign: 'center',
                        textBaseline: 'middle',
                    },
                    name: 'edge-label-text',
                });
            }

            return keyShape;
        }
      });

      // ==================== 4. 初始化图表控制参数（含核心 padding 配置） ====================
      this.graph = new G6.Graph({
        container: 'mountNode',
        width,
        height,
        fitView: true,
        // 🔴 核心配置一：[上, 右, 下, 左] 安全视口边距。右侧强行给 180px 安全阻尼，确保最右侧长文本绝不溢出画布！
        fitViewPadding:[40, 180, 40, 40], 
        modes: { default: ['drag-canvas', 'zoom-canvas'] },
        layout: {
          type: 'dagre',
          rankdir: 'LR',
          nodesep: 15,   // 纵向各卡片的连贯间距
          ranksep: 110,  // 横向层级大幅拉开，为 1/4 快速曲折后的水平拉直段提供完美的伸展舞台
          controlPoints: false, // 🔴 核心：禁止系统自动干预控制点，彻底解冻我们上方手写的完美几分之几曲率
        },
        defaultNode: {
          type: 'rect',
          size:[110,40],
          style: { fill: '#fff', stroke: '#ced4da', lineWidth: 1 },
          labelCfg: { style: { fontSize: 12, fill: '#333' } },
        },
        defaultEdge: {
          type: 'perfect-link', // 绑定上面用经典数学算法写死的手绘线条类型
          labelCfg: {
            autoRotate: false,   // 金额文本一律保持完全水平端正放置，不随线条偏斜
            refY: -10,           // 标签全部舒适地漂浮在水平线条正上方 10px 处，不压线
            style: {
              fontSize: 10,
              fill: '#999999',   // 高级淡灰色文本
              // 🔴 核心配置二：建立白色微型遮罩包裹文字，防止线段直接穿透文本
              background: { 
                fill: '#ffffff', 
                padding:[3, 6, 3, 6], // [上边距, 右边距, 下边距, 左边距] 精准控制文字四周的呼吸感
                radius: 2 
              }
            },
          },
        },
      });

      // ==================== 5. 载入并执行渲染 ====================
      this.graph.data(data);
      this.graph.render();
    },
    handleResize() {
      if (!this.graph || this.graph.get('destroyed')) return;
      const container = this.$refs.chartRef;
      if (container) {
        this.graph.changeSize(container.scrollWidth, container.scrollHeight);
        this.graph.fitView();
      }
    },
  },
};
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100vh;
  min-height: 600px;
  background-color: #ffffff; /* 还原白底洁净界面 */
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}
.chart-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  border-left: 4px solid #1890ff;
  padding-left: 10px;
}
.container-inner {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#mountNode {
  width: 100%;
  height: 100%;
  background: #ffffff;
}
</style>
