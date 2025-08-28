<template>
  <div>
    <!-- 加载状态提示 -->
    <div v-if="loading" style="text-align: center; margin: 20px;">
      <p>正在加载 Word 文件...</p>
    </div>

    <!-- Word 预览容器 -->
    <div id="docx-preview-container" style="border: 1px solid #ccc; padding: 10px; width: 100%; height: 600px; overflow: auto;"></div>

    <!-- 错误提示 -->
    <div v-if="error" style="color: red; margin-top: 10px;">
      {{ error }}
    </div>
  </div>
</template>
<script>
import { renderAsync } from 'docx-preview';
export default {
  name: 'HelloWorld',
  data() {
    return {
      loading: true,
      error: '',
    };
  },
  mounted() {
    this.loadAndRenderWord();
  },
  methods: {
    async loadAndRenderWord() {
        try {
        // 1. 从 public 目录加载 aaa.docx 文件
        const response = await fetch('/docs/aaa.docx');
        if (!response.ok) {
          throw new Error('文件加载失败，请检查路径或文件是否存在');
        }

        // 2. 将响应数据转换为 ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // 3. 获取渲染容器
        const container = document.getElementById('docx-preview-container');

        // 4. 使用 docx-preview 渲染
        renderAsync(arrayBuffer, container).then(() => {
            console.log('Word 文件预览渲染完成');
            this.loading = false;
          })
          .catch(err => {
            console.error('渲染失败:', err);
            this.loading = false;
          });

        // 渲染完成
        
      } catch (err) {
        this.error = '无法加载 Word 文件：' + err.message;
        this.loading = false;
        console.error('加载或渲染失败:', err);
      }
    }
  }
}
</script>