<template>
  <view class="bottom">
    <view class="buttons" @click="nav('/pages/analysis/simulate')"
      >构建模拟组合</view
    >
    <view class="buttons" @click="nav('/pages/analysis/across')"
      >指标横向比较</view
    >
  </view>
</template>

<script>
import { navigateTo } from "@/utils/adapter";

export default {
  data() {
    return {};
  },
  methods: {
    nav(url) {
      navigateTo({ url });
    }
  }
};
</script>

<style scoped>
.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 98upx;
  background-image: linear-gradient(#ffffff, #ffffff),
    linear-gradient(#f5f5f5, #f5f5f5);
  background-blend-mode: normal, normal;
  box-shadow: 0px -1px 1px 0px rgba(187, 187, 187, 0.3);
  display: flex;
  justify-content: space-around;
}

.buttons {
  color: #9a1f27;
  font-size: 34upx;
  line-height: 98upx;
}
</style>
