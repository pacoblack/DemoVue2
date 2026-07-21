<template>
  <div class="x6-chart-container">
    <div ref="container" class="x6-canvas"></div>
  </div>
</template>

<script>
import { Graph } from '@antv/x6'
import { response, transformListToAlignedTopology,sourceColorPalette } from './data'

export default {
  name: 'X6PortStyleChart',
  data() {
    return {
      graph: null,
      NODE_DATA:[],
      EDGE_DATA:[]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initGraph()
      this.renderChart()
      if (this.graph) {
        this.graph.centerContent()
      }
      window.addEventListener('resize', this.handleResize)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.graph) this.graph.dispose()
  },
  methods: {
    initGraph() {

      this.graph = new Graph({
        container: this.$refs.container,
        autoResize: true,
        grid: {
          size: 10,
          visible: true,
          type: 'doubleMesh',
          args: [{ color: '#f0f0f0', thickness: 1 }, { color: '#e5e5e5', thickness: 1, factor: 4 }],
        },
        panning: true,
        mousewheel: false,
        zIndex: true, 
        sorting: 'exact', 
      })
    },

    getNodeStyleStrategy(node, ) {
      const arrowAttrs = {
        'arrow-track-0': {
          d: 'M 10 6 L 2 11 L 5 6 L 2 1 Z', 
          fill: 'none', // 默认透明不占地
          stroke: 'none',
          refX: 0,
          refX2: -12, // 贴在卡片最左侧边缘
          refY: 0.5,
          refY2: -6,  // 雷打不动物理锁死在卡片高度的最正中心线！
        },
        'arrow-track-1': {
          d: 'M 10 6 L 2 11 L 5 6 L 2 1 Z',
          fill: 'none',
          stroke: 'none',
          refX: 0,
          refX2: -18, // 往左错开 6 像素排队
          refY: 0.5,
          refY2: -6,
        },
        'arrow-track-2': {
          d: 'M 10 6 L 2 11 L 5 6 L 2 1 Z',
          fill: 'none',
          stroke: 'none',
          refX: 0,
          refX2: -24, // 往左错开 12 像素排队
          refY: 0.5,
          refY2: -6,
        }
      }
      const strategies = {
        'source-node': {
          markup: [{ tagName: 'rect', selector: 'body' }, { tagName: 'text', selector: 'text' }],
          attrs: {
            body: { fill: node.levelIndex >=0 ?sourceColorPalette[node.levelIndex] : '#000', stroke: 'none', rx: 20, ry: 20 },
            text: { text: node.label, fill: '#fff', fontSize: 13, fontWeight: 'bold' }
          }
        },
        'center-card': {
          markup: [
            { tagName: 'rect', selector: 'body' }, 
            { tagName: 'text', selector: 'text' },
          ],
          attrs: {
            body: { fill: '#fff', stroke: '#cbd5e1', strokeWidth: 1, rx: 12, ry: 12 },
            text: { 
              text: node.label, 
              fill: '#333', 
              fontSize: 14, 
              fontWeight: 'bold', 
              refX: 0.5,               // 文字水平居中
              refY: 70,                // 距离顶部 70 像素，挪到图片下方
              textAnchor: 'middle', 
            }
          }
        },
        'line-node': {
          markup: [
            { tagName: 'rect', selector: 'body' }, 
            { tagName: 'text', selector: 'text' },
            {
              tagName: 'path',
              selector: 'arrow-track-0', // 专门负责第一条连线（比如橙色）的箭头
            },
            {
              tagName: 'path',
              selector: 'arrow-track-1', // 专门负责第二条连线（比如紫色）的箭头
            },
            {
              tagName: 'path',
              selector: 'arrow-track-2', // 专门负责第三条连线的箭头（做2-5个拓展兜底）
            } ],
          attrs: {
            body: { fill: '#3b82f6', stroke: 'none', rx: 20, ry: 20 },
            text: { text: node.label, fill: '#fff', fontSize: 14, fontWeight: 'bold' },
            ...arrowAttrs
          }
        },
        'target-card': {
          markup: [
            { tagName: 'rect', selector: 'body' }, 
            { tagName: 'text', selector: 'text' }, 
            { tagName: 'text', selector: 'subText' },
            {
              tagName: 'path',
              selector: 'arrow-track-0', // 专门负责第一条连线（比如橙色）的箭头
            },
            {
              tagName: 'path',
              selector: 'arrow-track-1', // 专门负责第二条连线（比如紫色）的箭头
            },
            {
              tagName: 'path',
              selector: 'arrow-track-2', // 专门负责第三条连线的箭头（做2-5个拓展兜底）
            }],
          attrs: {
            body: { fill: '#eff6ff', stroke: '#bfdbfe', strokeWidth: 1, rx: 20, ry: 20 },
            text: { text: node.label, fill: '#1e40af', fontSize: 13, fontWeight: 'bold', refY: node.subLabel ? 22 : 0.5 },
            subText: { text: node.subLabel || '', fill: '#64748b', fontSize: 11, refY: 42 },
            ...arrowAttrs
          }
        }
      }

      return strategies[node.type] || {
        markup: [
          { tagName: 'text', selector: 'text' },
          {
            tagName: 'path',
            selector: 'arrow-track-0', // 专门负责第一条连线（比如橙色）的箭头
          },
          {
            tagName: 'path',
            selector: 'arrow-track-1', // 专门负责第二条连线（比如紫色）的箭头
          },
          {
            tagName: 'path',
            selector: 'arrow-track-2', // 专门负责第三条连线的箭头（做2-5个拓展兜底）
          }
        ],
        attrs: { 
          text: { text: node.label, fill: '#333', fontSize: 12, textAnchor: 'start' },
          ...arrowAttrs
        }
      }
    },

    /// 3. 精简、标准的连接桩画线函数（优化版：100% 保持原风格，支持 2-5 条线由中间向周围完美对称扩散）
    drawEdge(options) {
      const { sourceId, sourcePort, targetId, targetPort, color, labelText, labelPos, sourceTotal = 1, sourceIndex = 0,level = -1, colorIndex, colorTotal} = options
      let finalSource = { cell: sourceId, port: sourcePort }
      let finalTarget = { cell: targetId, port: targetPort }

      let forkVertices = null
      // 💡 只有当多轨平行线总数大于 1 时，才触发动态轨道扩散偏移逻辑
        // 💡 动态间距策略：线越多，间距稍微收紧（5条线用6px，3-4条用8px，2条用10px），防止线束过宽超出卡片边缘
        let trackGap = 4
        // if (sourceTotal >= 5) trackGap = 6
        let currentOffset = 0
        if(colorTotal > 0) {
          const offsetFactor = colorIndex - (colorTotal - 1) / 2
          currentOffset = offsetFactor * trackGap
        } else {
          const offsetFactor = sourceIndex - (sourceTotal - 1) / 2
          currentOffset = offsetFactor * trackGap
        }

        const targetNode = this.NODE_DATA.find(node => node.id === targetId)
        const sourceNode = this.NODE_DATA.find(node => node.id === sourceId)

        let bottomTarget = 1
        if ((sourcePort === 'top' || sourcePort === 'bottom' || sourcePort === 'unset') && sourceNode && targetNode && targetNode.y > sourceNode.y && level != 1) {
          bottomTarget = -1
        }
        
        // 左右出线：在 Y 轴上纵向对称扩充
        finalSource = { 
          cell: sourceId, 
          port: sourcePort,
          anchor: { 
            name: 'right', 
            args: { 
              dy: currentOffset 
            } 
          } 
        }

        // const nodeW = targetNode ? targetNode.width : 120  
        // const nodeH = targetNode ? targetNode.height : 60  
        
        // const offsetY = (nodeH / 2) + 16
        // const offsetX = (nodeW / 2) + 11

        finalTarget = {
          cell: targetId,
          // 💡 保持目标点的偏移与起点的 finalOffset 严格同步
          anchor: { 
            name: 'left', 
            args: { 
              dy: currentOffset * bottomTarget
            } 
          },
          connectionPoint: {
            name: 'anchor',
            args: {
          //     offset: { x: offsetX * bottomTarget } 
              offset: { x: -10 } 
            }
          }
        }
        

        // ==================== ✨ 1.32版本终极订正：两步法强控 0.3 处垂直折弯 ====================
        if (level > 1 && sourceNode && targetNode) {
          const startX = sourceNode.x + sourceNode.width;
          const endX = targetNode.x;
          const distanceX = endX - startX;
          
          const forkX = startX + (distanceX * 0.3);
          
          const sourceY = sourceNode.y + sourceNode.height / 2;
          const targetY = targetNode.y + targetNode.height / 2 + currentOffset;

          forkVertices = [
            { x: Math.round(forkX), y: Math.round(sourceY) },
            { x: Math.round(forkX), y: Math.round(targetY) }
          ];
        }
        // =======================================================================================

      const labels = []
      if (labelText){
        let labelPositionConfig = labelPos || 0.65;

        if (level === 3 && sourceNode && targetNode) {

          labelPositionConfig = {
            distance: -85, // 负数代表从【终点】向【起点】倒数 45 像素。可根据需要微调（如 -50, -40）
          };
        }

        if (level === 4 && sourceNode && targetNode) {

          labelPositionConfig = {
            distance: -45, // 负数代表从【终点】向【起点】倒数 45 像素。可根据需要微调（如 -50, -40）
          };
        }
        labels.push({
          attrs: {
            text: { text: labelText, fontSize: 15, fill: '#64748b' },
            rect: { fill: '#ffffff', rx: 3, ry: 3, stroke: '#e2e8f0', strokeWidth: 1 },
          },
          position: labelPositionConfig,
        })
      }
      if (level === 1) {
        labels.push({
          position: 1, // 1 代表连线的终点（0代表起点，0.5代表中间）
          options: {
            keepRotation: true, // 👈 超级重要：开启这个，箭头会自动根据线是横着走还是竖着走来自动旋转方向！
          },
          markup: [
            {
              tagName: 'path',
              selector: 'customArrow',
            },
          ],
          attrs: {
            customArrow: {
              d: 'M 10 6 L 2 11 L 5 6 L 2 1 Z', 
              fill: color || '#3b82f6', 
              // stroke: '#1e40af',             // 可定制：箭头边框颜色
              strokeWidth: 1,
              transform: 'scale(1, 1) translate(-10, -6)', 
            },
          },
        })
      }


      const edgeConfig = {
        source: finalSource,
        target: finalTarget,
        router: {
          name: 'orth',
          args: {
            step: 10,
            padding: 24, 
          },
        },
        connector: {
          name: 'rounded', 
          args: { radius: 12 },
        },
        attrs: {
          line: { 
            stroke: color, 
            strokeWidth: 2, 
            targetMarker: ''
          },
        },
        labels: labels,
      }
      const addedEdge = this.graph.addEdge(edgeConfig)
      if (addedEdge) {
        if (labelText) {
          addedEdge.setZIndex(100 - sourceIndex) 
        } else {
          addedEdge.setZIndex(1)
        }
      }

      // 2. 判定如果起点的自定义属性里存有 0.3 处的转折顶点，立刻强行注入
      if (addedEdge && forkVertices) {
        // 调用 1.x 版本最稳妥的动态顶点设置 API，强行掰正曼哈顿路由的分叉位置！
        addedEdge.setVertices(forkVertices) 
      }
    },
    renderAllLevel4Arrows() {
      // 1. 获取全场所有的节点实例
      const allNodes = this.graph.getNodes();
      
      allNodes.forEach(node => {
        // 💡 过滤出第 4 级的文字卡片（根据你的业务属性来辨别，或者通过它的位置/ID前缀过滤）
        // 假设你的第 4 级卡片数据的层级记录在 node.getData() 里，或者根据传入的 ID 区分：
        // 这里我们判断：只要该节点有入线，并且属于我们想加箭头的右侧卡片
        const incomingEdges = this.graph.getIncomingEdges(node);
        
        if (incomingEdges && incomingEdges.length > 0) {
          // 2. 🌟 绝妙之法：既然现在全场的线都已经渲染完毕，卡片可以直接清点有哪些线连向了自己！
          // 我们按照颜色或者原先的局部序号，给这批入线排个队
          incomingEdges.forEach((edge, index) => {
            const edgeColor = edge.attr('line/stroke') || '#ff9900'; // 提取这条线的真实颜色
            
            // 限制在 0-2 范围内（对齐卡片定义里 arrow-track-0, 1, 2 的占位符）
            const trackSelector = `arrow-track-${Math.min(index, 2)}`;
            
            // 3. 🌟 顺理成章地点亮卡片身上自带的对应箭头插槽！
            node.prop(`attrs/${trackSelector}/fill`, edgeColor);
          });
        }
      });
    },
    renderChart() {
      if (!this.graph) return
      const { NODE_DATA, EDGE_DATA } = transformListToAlignedTopology(response, this.$refs.container)
      this.NODE_DATA = NODE_DATA
      this.EDGE_DATA = EDGE_DATA
      // 1. 批量渲染带有内置 Port 信息的节点
      this.NODE_DATA.forEach(node => {
        const { id, x, y, width, height, ports } = node
        const { markup, attrs } = this.getNodeStyleStrategy(node, width, height)
        this.graph.addNode({ id, x, y, width, height, markup, attrs, ports })
      })

      // 2. 批量进行标准连接桩连线
      this.EDGE_DATA.forEach(edge => {
        this.drawEdge(edge)
      })
      this.renderAllLevel4Arrows()
    },

    handleResize() {
      if (this.graph) {
        this.graph.resize(this.$refs.container.clientWidth, this.$refs.container.clientHeight)
      }
    }
  }
}
</script>

<style scoped>
.x6-chart-container {
  width: 100%;
  height: 50vh;
  min-height: 600px;
  background-color: #f8fafc;
  position: relative;
  overflow: hidden;
}
.x6-canvas {
  width: 100%;
  height: 100%;
}
</style>
