<template>
    <div class="signature-container">
      <h2 class="signature-title">电子签名板</h2>
      
      <div class="signature-area">
        <canvas 
          ref="signatureCanvas"
          class="signature-canvas"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="stopDrawing">
        </canvas>
        <div v-if="!hasDrawing" class="signature-placeholder">
          请在此处签名
        </div>
      </div>
      
      <div class="button-group">
        <button class="btn btn-danger" @click="clearSignature">清除签名</button>
        <button class="btn btn-primary" @click="saveSignature">保存签名</button>
        <button class="btn btn-success" @click="uploadSignature" :disabled="!hasDrawing">上传签名</button>
      </div>
      
      <div v-if="signatureData" class="preview-container">
        <h3 class="preview-title">签名预览</h3>
        <img :src="signatureData" class="preview-image" alt="签名预览">
      </div>
      
      <div v-if="uploadStatus" class="upload-status" :class="uploadStatusClass">
        {{ uploadStatus }}
      </div>
    </div>
</template>
<script>
  export default {
  name: 'handWrite',
  data() {
    return {
      isDrawing: false,
      hasDrawing: false, // 初始化状态
      lastX: 0,
      lastY: 0,
      signatureData: null,
      uploadStatus: '',
      uploadStatusClass: ''
    };
  },
  mounted() {
    this.initCanvas();
    window.addEventListener('resize', this.initCanvas);
  },
    beforeDestroy() {
    window.removeEventListener('resize', this.initCanvas);
    },
    methods: {
    // 初始化画布
    initCanvas() {
        const canvas = this.$refs.signatureCanvas;
        const ctx = canvas.getContext('2d');
        
        // 设置画布尺寸
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // 设置绘制样式
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    },
    
    // 开始绘制
    startDrawing(e) {
        this.isDrawing = true;
        const canvas = this.$refs.signatureCanvas;
        const rect = canvas.getBoundingClientRect();
        
        // 获取坐标
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        this.lastX = clientX - rect.left;
        this.lastY = clientY - rect.top;
        
        // 阻止默认行为，避免触摸设备上的滚动
        e.preventDefault();
    },
    
    // 处理触摸开始事件
    handleTouchStart(e) {
        this.startDrawing(e);
    },
    
    // 绘制过程
    draw(e) {
        if (!this.isDrawing) return;

        const canvas = this.$refs.signatureCanvas;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // 获取坐标
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        const currentX = clientX - rect.left;
        const currentY = clientY - rect.top;
        
        // 绘制线条
        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        // 更新最后坐标
        this.lastX = currentX;
        this.lastY = currentY;
        
        // 标记已有绘制内容
        this.hasDrawing = true;
        
        // 阻止默认行为
        e.preventDefault();
    },
    
    // 处理触摸移动事件
    handleTouchMove(e) {
        this.draw(e);
    },
    
    // 停止绘制
    stopDrawing() {
        this.isDrawing = false;
    },
    
    // 清除签名
    clearSignature() {
        const canvas = this.$refs.signatureCanvas;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.signatureData = null;
        this.hasDrawing = false;
        this.isDrawing = false;
        this.uploadStatus = '';
    },
    
    // 保存签名
    saveSignature() {
        if (!this.hasDrawing) {
        alert('请先签名');
        return;
        }
        
        const canvas = this.$refs.signatureCanvas;
        
        // 将画布内容转换为Base64格式的PNG图片
        this.signatureData = canvas.toDataURL('image/png');
        this.showStatus('签名已保存，可以上传', 'status-success');
    },
    
    // 上传签名
    uploadSignature() {
        if (!this.signatureData) {
        this.showStatus('请先保存签名', 'status-error');
        return;
        }
        
        // 显示上传中状态
        this.showStatus('正在上传签名...', 'status-success');
        
        // 转换为Blob对象用于上传
        this.dataURLToBlob(this.signatureData)
        .then(blob => {
            // 创建FormData对象
            const formData = new FormData();
            formData.append('signature', blob, 'signature.png');
            
            // 这里调用后端API上传签名
            return this.uploadToServer(formData);
        })
        .then(response => {
            this.showStatus('签名上传成功', 'status-success');
            console.log('上传成功:', response);
        })
        .catch(error => {
            this.showStatus('签名上传失败: ' + error.message, 'status-error');
            console.error('上传失败:', error);
        });
    },
    
    // 将Base64数据转换为Blob对象
    dataURLToBlob(dataURL) {
        return new Promise((resolve, reject) => {
        try {
            // 提取Base64数据部分
            const byteString = atob(dataURL.split(',')[1]);
            const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
            
            // 转换为ArrayBuffer
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            
            for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
            }
            
            // 创建Blob对象
            const blob = new Blob([ab], { type: mimeString });
            resolve(blob);
        } catch (error) {
            reject(error);
        }
        });
    },
    
    // 上传到服务器（需要根据实际后端API调整）
    uploadToServer(formData) {
        // 这里是模拟上传，实际使用时替换为真实API
        return new Promise((resolve, reject) => {
        // 模拟网络延迟
        setTimeout(() => {
            console.log('uploading...', formData)
            // 模拟上传成功
            // 实际应用中，这里应该是真实的API调用，例如：
            // return axios.post('/api/upload-signature', formData, {
            //   headers: {
            //     'Content-Type': 'multipart/form-data'
            //   }
            // });
            
            // 模拟90%成功率
            if (Math.random() > 0.1) {
            resolve({
                success: true,
                message: '签名上传成功',
                fileId: 'signature_' + Date.now()
            });
            } else {
            reject(new Error('服务器错误，请重试'));
            }
        }, 1000);
        });
    },
    
    // 显示状态信息
    showStatus(message, className) {
        this.uploadStatus = message;
        this.uploadStatusClass = className;
        
        // 3秒后清除状态信息
        setTimeout(() => {
        this.uploadStatus = '';
        }, 3000);
    }
    }
  }
  </script>
  <style scoped>
 .signature-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Helvetica Neue', Arial, sans-serif;
    }
    
    .signature-title {
      text-align: center;
      margin-bottom: 20px;
      color: #333;
    }
    
    .signature-area {
      border: 2px dashed #ccc;
      border-radius: 8px;
      background-color: #f9f9f9;
      position: relative;
      margin-bottom: 20px;
    }
    
    .signature-canvas {
      display: block;
      width: 100%;
      height: 300px;
      cursor: crosshair;
      background-color: white;
    }
    
    .signature-placeholder {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #999;
      font-size: 18px;
      pointer-events: none;
    }
    
    .button-group {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s;
    }
    
    .btn-primary {
      background-color: #409EFF;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #66b1ff;
    }
    
    .btn-danger {
      background-color: #F56C6C;
      color: white;
    }
    
    .btn-danger:hover {
      background-color: #f78989;
    }
    
    .btn-success {
      background-color: #67C23A;
      color: white;
    }
    
    .btn-success:hover {
      background-color: #85ce61;
    }
    
    .preview-container {
      text-align: center;
      margin-top: 20px;
    }
    
    .preview-title {
      margin-bottom: 10px;
      color: #333;
    }
    
    .preview-image {
      max-width: 100%;
      max-height: 200px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .upload-status {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      text-align: center;
    }
    
    .status-success {
      background-color: #f0f9ff;
      color: #67C23A;
      border: 1px solid #c2e7b0;
    }
    
    .status-error {
      background-color: #fef0f0;
      color: #F56C6C;
      border: 1px solid #fbc4c4;
    }
</style >