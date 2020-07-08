<template>
  <div :class="loadingAnimation" @touchmove.stop="">
    <div class="spinner">
      <div class="rect1" />
      <div class="rect2" />
      <div class="rect3" />
      <div class="rect4" />
      <div class="rect5" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showAnimation: {
      default: true
    }
  },
  computed: {
    loadingAnimation() {
      return this.showAnimation ? "place-holder" : "place-holder-none";
    }
  }
};
</script>

<style scoped>
.spinner {
  margin: 40vh auto;
  width: 100rpx;
  height: 120rpx;
  text-align: center;
  font-size: 20rpx;
}

.spinner > div {
  margin: 4rpx;
  background-color: #a5323a;
  height: 100%;
  width: 12rpx;
  display: inline-block;
  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

.place-holder {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  animation: animation 2s -10ms normal linear;
  z-index: 10000;
  background-color: #fff;
}
.place-holder-none {
  display: none;
}
@-webkit-keyframes stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}
</style>
