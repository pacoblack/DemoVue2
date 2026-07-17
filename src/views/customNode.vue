<template>
  <div class="custom-topology-node" :style="{ borderColor: nodeColor }">
    <!-- 左侧状态色条 -->
    <div class="color-bar" :style="{ backgroundColor: nodeColor }"></div>
    
    <div class="node-content">
      <div class="node-title">{{ label }}</div>
      <!-- 如果有留存金额则显示 -->
      <div v-if="remaining" class="node-remaining">
        留存金额: <span class="price">{{ remaining }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomNode',
  inject: ['getGraph', 'getNode'],
  data() {
    return {
      label: '',
      remaining: '',
      nodeColor: '#409EFF',
    };
  },
  mounted() {
    const node = this.getNode();
    const data = node.getData() || {};
    
    this.label = data.label || '';
    this.remaining = data.remaining || '';
    this.nodeColor = data.color || '#409EFF';
    
    // 监听数据改变
    node.on('change:data', ({ current }) => {
      this.label = current.label || '';
      this.remaining = current.remaining || '';
      this.nodeColor = current.color || '#409EFF';
    });
  },
};
</script>

<style scoped>
.custom-topology-node {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  box-sizing: border-box;
}

.color-bar {
  width: 6px;
  height: 100%;
  flex-shrink: 0;
}

.node-content {
  flex: 1;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.node-title {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-remaining {
  font-size: 11px;
  color: #909399;
  margin-top: 4px;
}

.node-remaining .price {
  color: #e6a23c;
  font-weight: bold;
}
</style>