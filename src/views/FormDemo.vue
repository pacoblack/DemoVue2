<template>
  <div id="app">
    <DynamicForm
      :query-config="queryConfig"
      :form-config="formConfig"
      query-title="用户查询"
      form-title="用户信息"
      @query="handleQuery"
      @submit="handleSubmit"
      @reset="handleReset"
    />
  </div>
</template>

<script>
import DynamicForm from '../components/DynamicForm.vue'

export default {
  name: 'App',
  components: {
    DynamicForm
  },
  data() {
    return {
      queryConfig: [
        {
          type: 'input',
          label: '用户名',
          field: 'username',
          placeholder: '请输入用户名'
        },
        {
          type: 'select',
          label: '状态',
          field: 'status',
          placeholder: '请选择状态',
          options: [
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' }
          ]
        },
        {
          type: 'date',
          label: '创建时间',
          field: 'createTime',
          placeholder: '请选择日期'
        }
      ],
      formConfig: [
        {
          type: 'input',
          label: '姓名',
          field: 'name',
          placeholder: '请输入姓名',
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          type: 'input',
          label: '邮箱',
          field: 'email',
          placeholder: '请输入邮箱',
          rules: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ]
        },
        {
          type: 'select',
          label: '性别',
          field: 'gender',
          placeholder: '请选择性别',
          options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
          ]
        },
        {
          type: 'date',
          label: '生日',
          field: 'birthday',
          placeholder: '请选择生日'
        },
        {
          type: 'textarea',
          label: '备注',
          field: 'remark',
          placeholder: '请输入备注'
        }
      ]
    }
  },
  methods: {
    handleQuery(queryData) {
      console.log('查询条件:', queryData)
      // 这里可以发送API请求
    },
    handleSubmit(formData) {
      console.log('提交表单:', formData)
      // 这里可以发送API请求
    },
    handleReset() {
      console.log('重置查询')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
}
</style>