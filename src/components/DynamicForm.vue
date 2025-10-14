<template>
  <div class="dynamic-form-container">
    <!-- 查询区域 -->
    <div v-if="queryConfig && queryConfig.length" class="query-section">
      <div class="query-header">
        <h3>{{ queryTitle || '查询条件' }}</h3>
        <div class="query-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="query-form">
        <el-row :gutter="20">
          <el-col 
            v-for="(item, index) in queryConfig" 
            :key="index"
            :xs="24" :sm="12" :md="8" :lg="6" :xl="6"
          >
            <div class="query-item">
              <label class="query-label">{{ item.label }}</label>
              <component
                :is="getComponentType(item.type)"
                v-model="queryData[item.field]"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :options="item.options"
                :clearable="item.clearable !== false"
                :style="{ width: '100%' }"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 表单区域 -->
    <div v-if="formConfig && formConfig.length" class="form-section">
      <div class="form-header">
        <h3>{{ formTitle || '表单' }}</h3>
      </div>
      <el-form 
        ref="formRef"
        :model="formData" 
        :rules="formRules"
        label-width="auto"
      >
        <el-row :gutter="20">
          <el-col 
            v-for="(item, index) in formConfig" 
            :key="index"
            :xs="24" :sm="12" :md="8" :lg="8" :xl="6"
          >
            <el-form-item :label="item.label" :prop="item.field">
              <component
                :is="getComponentType(item.type)"
                v-model="formData[item.field]"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :options="item.options"
                :clearable="item.clearable !== false"
                :style="{ width: '100%' }"
                :disabled="item.disabled"
                :type="item.inputType"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="form-actions">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleFormReset">重置</el-button>
        </div>
      </el-form>
    </div>

    <!-- 展示区域 -->
    <div v-if="showData" class="data-display">
      <div class="data-header">
        <h3>数据展示</h3>
      </div>
      <div class="data-content">
        <pre>{{ JSON.stringify({ queryData, formData }, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DynamicForm',
  props: {
    // 查询配置
    queryConfig: {
      type: Array,
      default: () => []
    },
    // 表单配置
    formConfig: {
      type: Array,
      default: () => []
    },
    // 查询标题
    queryTitle: {
      type: String,
      default: ''
    },
    // 表单标题
    formTitle: {
      type: String,
      default: ''
    },
    // 是否显示数据
    showData: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      queryData: {},
      formData: {},
      formRules: {}
    }
  },
  watch: {
    queryConfig: {
      handler(newVal) {
        this.initQueryData(newVal)
      },
      immediate: true
    },
    formConfig: {
      handler(newVal) {
        this.initFormData(newVal)
        this.initFormRules(newVal)
      },
      immediate: true
    }
  },
  methods: {
    // 初始化查询数据
    initQueryData(config) {
      if (!config || !config.length) return
      
      const data = {}
      config.forEach(item => {
        data[item.field] = item.defaultValue || ''
      })
      this.queryData = data
    },
    
    // 初始化表单数据
    initFormData(config) {
      if (!config || !config.length) return
      
      const data = {}
      config.forEach(item => {
        data[item.field] = item.defaultValue || ''
      })
      this.formData = data
    },
    
    // 初始化表单验证规则
    initFormRules(config) {
      if (!config || !config.length) return
      
      const rules = {}
      config.forEach(item => {
        if (item.rules) {
          rules[item.field] = item.rules
        }
      })
      this.formRules = rules
    },
    
    // 根据类型获取组件
    getComponentType(type) {
      const componentMap = {
        'input': 'el-input',
        'select': 'el-select',
        'date': 'el-date-picker',
        'textarea': 'el-input',
        'radio': 'el-radio-group',
        'checkbox': 'el-checkbox-group'
      }
      return componentMap[type] || 'el-input'
    },
    
    // 处理查询
    handleQuery() {
      this.$emit('query', this.queryData)
    },
    
    // 重置查询
    handleReset() {
      this.initQueryData(this.queryConfig)
      this.$emit('reset')
    },
    
    // 提交表单
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.formData)
        } else {
          this.$message.error('请检查表单填写是否正确')
          return false
        }
      })
    },
    
    // 重置表单
    handleFormReset() {
      this.$refs.formRef.resetFields()
      this.$emit('form-reset')
    }
  }
}
</script>

<style scoped>
.dynamic-form-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.query-section, .form-section, .data-display {
  background: white;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.query-header, .form-header, .data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.query-header h3, .form-header h3, .data-header h3 {
  margin: 0;
  color: #303133;
}

.query-item {
  margin-bottom: 15px;
}

.query-label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #606266;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.data-content {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  overflow: auto;
}

.data-content pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .dynamic-form-container {
    padding: 10px;
  }
  
  .query-section, .form-section, .data-display {
    padding: 15px;
  }
  
  .query-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .query-actions {
    margin-top: 10px;
  }
}
</style>