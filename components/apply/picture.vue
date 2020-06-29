<template>
  <div class="box has-padding">
    <div class="color-main fs-14">{{ title }}</div>
    <div v-if="!value" @click="choosePicture()" class="btn btn-grey-reverse btn-full">
      点击上传文件
    </div>
    <img v-else :src="value" @click="deletePicture()" mode="widthFix">
    <canvas
      class="water-mark"
      :style="{ height: imageHeight + 'px', width: imageWidth + 'px' }"
      :canvas-id="canvas_id"
    />
    <canvas
      class="water-mark"
      :style="{ height: watermarkHeight + 'px', width: watermarkWidth + 'px' }"
      canvas-id="watermark"
    />
  </div>
</template>


<script>
import { showActionSheet, showModal, chooseImage, getImageInfo, showToast } from '@/utils/adapter';

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    canvas_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      imageHeight: 200,
      imageWidth: 300,
      watermarkHeight: 10,
      watermarkWidth: 100,
      ctx: null,
    };
  },
  mounted() {

  },
  methods: {
    chooseImageWrapper(type) {
      chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: [type],
        success: (res) => {
          try {
            const { size } = res.tempFiles[0];
            if (size >= 6 * 1024 * 1024) {
              showToast({ title: '图片过大！请选择6M以下的图片', icon: 'none' });
              return;
            }
          } catch (e) {
            showToast({ title: '图片上传出问题啦', icon: 'none' });
            return;
          }
          getImageInfo({
            src: res.tempFilePaths[0],
            success: (res2) => {
              this.imageWidth = res2.width;
              this.imageHeight = res2.height;

              this.prepareWaterMark(res.tempFilePaths[0], this.imageWidth, this.imageHeight);
            },
          });
        },
      });
    },
    prepareWaterMark(picPath, width, height) {
      wx.showLoading();
      // 第二个参数传this才能获取到组件内的canvas
      const ctx = wx.createCanvasContext(this.canvas_id, this);
      const rpx = width / 225;
      const watermarkPath = '/static/img/watermark.png';
      const that = this;
      getImageInfo({
        src: watermarkPath,
        success(res) {
          console.log(res);
          ctx.drawImage(watermarkPath, 0, 0, res.width * rpx, res.height * rpx);
          ctx.draw(false, () => {
            console.log('draw');
            // 第二个参数传this才能获取到组件内的canvas
            wx.canvasToTempFilePath({
              canvasId: that.canvas_id,
              width: res.width * rpx,
              height: res.height * rpx,
              quality: 1,
              success(res2) {
                console.log('watermark', res2.tempFilePath);
                that.addWaterMark(ctx, picPath, width, height, res2.tempFilePath);
              },
            }, that);
          });
        },
      });
    },
    addWaterMark(ctx, picPath, width, height, watermark) {
      const pattern = ctx.createPattern(watermark, 'repeat');

      ctx.drawImage(picPath, 0, 0, width, height);

      ctx.rotate((45 * Math.PI) / 180);
      ctx.fillStyle = pattern;
      ctx.fillRect(-height / 1.4, -width / 1.4, (width + height) * 1.5, (width + height) * 1.5);

      const that = this;
      ctx.draw(false, () => {
        console.log('draw');
        // 第二个参数传this才能获取到组件内的canvas
        wx.canvasToTempFilePath({
          canvasId: that.canvas_id,
          quality: 1,
          success(res) {
            console.log(res.tempFilePath);
            that.$emit('input', res.tempFilePath);
            that.$emit('change', res.tempFilePath);
            wx.hideLoading();
          },
        }, this);
      });
    },
    choosePicture() {
      showActionSheet({
        itemList: ['从相册中选择', '拍照'],
        itemColor: '#f56250',
        success: (res) => {
          if (!res.cancel) {
            if (res.tapIndex === 0) {
              this.chooseImageWrapper('album');
            } else if (res.tapIndex === 1) {
              this.chooseImageWrapper('camera');
            }
          }
        },
      });
    },
    deletePicture() {
      showModal({
        title: '您确定要删除此照片吗？',
        content: '',
        success: (res) => {
          if (res.confirm) {
            this.$emit('input', '');
            this.$emit('change', '');
          }
        },
      });
    },
  },
};
</script>
<style>
  .btn {
    margin: 15px 0;
  }
  .has-padding {
    padding: 36rpx 24rpx;
  }
 .has-padding img {
    width: 100%;
  }
  .water-mark {
    position: absolute;
    top: -10000px;
    left: -10000px;
  }

</style>
