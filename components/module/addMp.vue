<template>
  <div
    v-show="addmp && !clickClose"
    class="bubble flex"
    :style="{ top: 64 + systemInfo.statusBarHeight + 'px' }"
    @click="closeMask"
  >
    <div
      class="bubble-tri"
      :style="{ top: 64 + systemInfo.statusBarHeight + 'px' }"
    />
    <div>
      <div class="flex">
        <div class="fs-12 grey39-color">
          点击“
        </div>
        <i class="iconfont icon-15 grey39-color">&#xe615;</i>
        <div class="fs-12 grey39-color">
          ”添加到我的小程序，
        </div>
      </div>
      <div class="fs-12 grey39-color">
        微信首页下拉即可快速访问店铺
      </div>
    </div>
    <i class="iconfont icon-20 grey39-color close">&#xe64e;</i>
  </div>
</template>

<script>
import { vibrateShort } from "@/utils/adapter";
import { mapGetters } from "vuex";

export default {
  props: {
    addmp: {
      default: false
    }
  },
  data() {
    return {
      clickClose: false
    };
  },
  computed: {
    ...mapGetters("app", ["systemInfo"])
  },
  methods: {
    openMask() {
      this.clickClose = false;
    },
    closeMask() {
      vibrateShort();
      this.clickClose = true;
    }
  }
};
</script>

<style scoped>
.bubble {
  z-index: 99;
  position: fixed;
  right: 0;
  box-shadow: -10rpx 10rpx 20rpx -8rpx #666, 10rpx 10rpx 20rpx -8rpx #666,
    0 -10rpx 20rpx -10rpx #666;
  border-radius: 6rpx;
  padding: 12rpx;
  margin: 16rpx;
  background-color: #fff;
}

.bubble-tri {
  z-index: 100;
  position: fixed;
  right: 126rpx;
  width: 0;
  height: 0;
  border-width: 0 16rpx 20rpx;
  border-style: solid;
  border-color: transparent transparent #fff; /*透明 透明  灰*/
}

.close {
  margin-left: 12rpx;
}
</style>
