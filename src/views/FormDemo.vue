<template>
  <div class="gantt-container" style="padding: 20px;">
    <!-- 顶部筛选栏 -->
    <div class="filters" style="margin-bottom: 20px; display: flex; gap: 12px; align-items: center;">
      <i-select v-model="filter.level1" style="width: 140px;" placeholder="请选择一级">
        <i-option v-for="item in level1Options" :key="item.value" :value="item.value">
          {{ item.label }}
        </i-option>
      </i-select>

      <i-select v-model="filter.level2" style="width: 140px;" placeholder="请选择二级">
        <i-option v-for="item in level2Options" :key="item.value" :value="item.value">
          {{ item.label }}
        </i-option>
      </i-select>

      <!-- 年份选择器 -->
      <i-select v-model="selectedYear" style="width: 120px;" @on-change="handleYearChange">
        <i-option v-for="year in yearOptions" :key="year" :value="year">
          {{ year }}年
        </i-option>
      </i-select>
    </div>

    <!-- 甘特图表头（月份） -->
    <div class="gantt-header" style="display: flex; border-bottom: 1px solid #e8eaec;">
      <div class="header-left" style="width: 160px; padding: 8px; font-weight: bold;">节点</div>
      <div class="header-months" style="flex: 1; display: flex;">
        <div
          v-for="(month, index) in months"
          :key="index"
          class="month-cell"
          :style="{ width: cellWidth + 'px', textAlign: 'center', padding: '6px 0', fontSize: '12px' }"
        >
          {{ month }}月
        </div>
      </div>
    </div>

    <!-- 甘特图行 -->
    <div class="gantt-rows" style="overflow-y: auto; max-height: 500px;">
      <div
        v-for="(node, idx) in filteredNodes"
        :key="idx"
        class="gantt-row"
        style="display: flex; border-bottom: 1px solid #f5f7f9; min-height: 40px;"
      >
        <div class="row-label" style="width: 160px; padding: 8px; font-size: 13px;">
          {{ node.name }}
        </div>
        <div class="row-timeline" style="flex: 1; position: relative; height: 40px;">
          <!-- 计划条 -->
          <div
            v-if="node.plannedStart && node.plannedEnd"
            class="bar planned"
            :class="getBarClass(node.status)"
            :style="getBarStyle(node.plannedStart, node.plannedEnd)"
          >
            <span class="duration">{{ getDurationDays(node.plannedStart, node.plannedEnd) }}天</span>
          </div>

          <!-- 实际条 -->
          <div
            v-if="node.actualStart && node.actualEnd"
            class="bar actual"
            :class="getBarClass(node.status)"
            :style="getBarStyle(node.actualStart, node.actualEnd)"
          >
            <span class="duration">{{ getDurationDays(node.actualStart, node.actualEnd) }}天</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GanttChart',
  data() {
    return {
      // 筛选项
      level1Options: [
        { value: 'group1', label: '集团A' },
        { value: 'group2', label: '集团B' }
      ],
      level2Options: [
        { value: 'project1', label: '项目X' },
        { value: 'project2', label: '项目Y' }
      ],
      filter: {
        level1: '',
        level2: ''
      },

      // 年份相关
      selectedYear: new Date().getFullYear(), // 默认当前年
      yearOptions: Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i), // 近5年

      // 节点数据（模拟）
      nodes: [
        {
          name: '需求分析',
          plannedStart: '2025-01-10',
          plannedEnd: '2025-02-20',
          actualStart: '2025-01-12',
          actualEnd: '2025-02-18',
          status: 'completed' // 'completed' | 'cancelled' | 'ongoing'
        },
        {
          name: '系统设计',
          plannedStart: '2025-02-21',
          plannedEnd: '2025-04-10',
          actualStart: '2025-02-25',
          actualEnd: null,
          status: 'ongoing'
        },
        {
          name: '开发阶段',
          plannedStart: '2025-04-11',
          plannedEnd: '2025-08-30',
          actualStart: '2025-05-01',
          actualEnd: '2025-08-20',
          status: 'completed'
        },
        {
          name: '测试验收',
          plannedStart: '2025-09-01',
          plannedEnd: '2025-10-15',
          actualStart: '2025-09-10',
          actualEnd: '2025-09-30',
          status: 'cancelled'
        }
      ],

      // 甘特图配置
      cellWidth: 60, // 每个月宽度（px）
      rowHeight: 40
    }
  },
  computed: {
    // 根据年份生成12个月
    months() {
      return Array.from({ length: 12 }, (_, i) => i + 1)
    },
    // 过滤节点（可根据 level1/level2 扩展）
    filteredNodes() {
      // 此处可加真实过滤逻辑
      return this.nodes
    }
  },
  methods: {
    // 处理年份切换
    handleYearChange(year) {
      this.selectedYear = year
      // 可在此触发数据重新加载（如从 API 获取该年数据）
      console.log('切换到年份:', year)
    },

    // 计算时间条样式
    getBarStyle(startDateStr, endDateStr) {
      const start = new Date(startDateStr)
      const end = new Date(endDateStr)

      // 若跨年，只显示本年内部分（简化处理）
      const yearStart = new Date(this.selectedYear, 0, 1)
      const yearEnd = new Date(this.selectedYear + 1, 0, 1)

      // 裁剪到当前年范围内
      const displayStart = start < yearStart ? yearStart : start
      const displayEnd = end > yearEnd ? yearEnd : end

      if (displayStart >= yearEnd || displayEnd <= yearStart) {
        return { display: 'none' }
      }

      const totalDaysInYear = 365
      const pixelPerDay = (12 * this.cellWidth) / totalDaysInYear

      const leftOffset = Math.floor(
        (displayStart - yearStart) / (1000 * 60 * 60 * 24) * pixelPerDay
      )
      const width = Math.max(
        4, // 最小宽度
        Math.floor(
          (displayEnd - displayStart) / (1000 * 60 * 60 * 24) * pixelPerDay
        )
      )

      return {
        position: 'absolute',
        left: leftOffset + 'px',
        width: width + 'px',
        height: '16px',
        top: '4px',
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        color: '#fff',
        overflow: 'hidden'
      }
    },

    // 获取状态类名
    getBarClass(status) {
      return {
        completed: status === 'completed',
        cancelled: status === 'cancelled',
        ongoing: status === 'ongoing'
      }
    },

    // 计算持续天数
    getDurationDays(startStr, endStr) {
      if (!startStr || !endStr) return 0
      const start = new Date(startStr)
      const end = new Date(endStr)
      const diffTime = Math.abs(end - start)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
  }
}
</script>

<style scoped>
/* 计划条样式 */
.bar.planned {
  background-color: #90caf9;
  border: 1px solid #42a5f5;
}
.bar.planned.completed {
  background-color: #a5d6a7;
  border-color: #4caf50;
}
.bar.planned.cancelled {
  background-color: #bdbdbd;
  border-color: #9e9e9e;
}

/* 实际条样式（稍深） */
.bar.actual {
  background-color: #42a5f5;
  border: 1px solid #1976d2;
  top: 22px !important;
}
.bar.actual.completed {
  background-color: #4caf50;
  border-color: #388e3c;
}
.bar.actual.cancelled {
  background-color: #9e9e9e;
  border-color: #757575;
}

/* 持续天数文字 */
.duration {
  white-space: nowrap;
  text-shadow: 0 0 2px rgba(0,0,0,0.6);
}
</style>