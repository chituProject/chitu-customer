<template>
  <div v-show="visible" class="dialog flex" @touchmove.stop="nullFunc">
    <div class="dialog-container">
      <h3 class="withdraw-text">提现</h3>
      <div class="dialog-title">
        ¥ {{ price - serviceFee | formatPrice }}
      </div>
      <div class="content flex">
        <span style="flex: 1">手续费</span>
        <span>¥{{ serviceFee | formatPrice }}</span>
      </div>
      <div class="btns">
        <div class="cancel-btn" @click="$emit('cancel')">
          取消
        </div>
        <div class="confirm-btn" @click="$emit('confirm')">
          确认
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    price: {
      type: Number,
      default: 0.5,
    },
    serviceFee: {
      type: Number,
      default: 0.5,
    },
    visible: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  methods: {
    nullFunc() {},
  },
};
</script>

<style lang="less" scoped>
.dialog {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  .dialog-container {
    margin: auto;
    width: 572rpx;
    background: #ffffff;
    border-radius: 16rpx;
    position: relative;
    .btns {
      display: flex;
      width: 100%;
      height: 84rpx;
      // line-height: 60px;
      // position: absolute;
      // bottom: 0;
      // left: 0;
      text-align: center;
      box-sizing: border-box;
      & > div {
        border-top: solid 2rpx #dbdbdb;
        font-size: 33rpx;
        display: inline-block;
        height: 84rpx;
        width: 50%;
        line-height: 84rpx;
        // background: #f1f1f1;
        cursor: pointer;
      }
      // :first-child{
      //   border-bottom-left-radius: 8px;
      // }
      // :last-child{
      //   border-bottom-right-radius: 8px;
      // }
      .cancel-btn {
        color: #101010;
        border-right: solid 2rpx #dbdbdb;
      }
      .confirm-btn {
        color: #f56250;
        // background: #f56250;
      }
      .confirm-btn-full {
        width: 100%;
      }
    }
    .close-btn {
      position: absolute;
      top: 25rpx;
      right: 25rpx;
      text-align: center;
      cursor: pointer;
    }
  }
}

    .dialog-title {
      width: 100%;
      font-size: 72rpx;
      text-align: center;
      padding: 32rpx 0;
      box-sizing: border-box;
      border-bottom: 1px solid #EEEEEE;
    }
    .withdraw-text {
      padding: 32rpx 0 0 0;
      text-align: center;
    }
    .content {
      padding: 32rpx;
      font-size: 28rpx;
      color: #797979;
      line-height: 52rpx;
    }
    .content-modal {
      text-align: center;
    }
</style>
